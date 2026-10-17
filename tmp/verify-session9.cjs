const { createRequire } = require('node:module');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const path = require('node:path');
const backend = path.resolve(__dirname, '../../itelect4-backend');
const load = createRequire(path.join(backend, 'package.json'));
load('dotenv').config({ path: path.join(backend, '.env'), quiet: true });
const mongoose = load('mongoose');
const jwt = load('jsonwebtoken');
const bcrypt = load('bcryptjs');
const runId = crypto.randomUUID();
const emails = [0, 1].map(n => `gt4-check-${runId}-${n}@example.invalid`);
const password = crypto.randomBytes(24).toString('hex');
const ids = [];
let child;
let checks = 0;
function check(condition, label) { assert.ok(condition, label); checks++; console.log(`PASS ${label}`); }
async function main() {
  check(Boolean(process.env.MONGODB_URI?.trim() && process.env.JWT_SECRET?.trim()), 'environment keys configured (values hidden)');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  console.log('PASS MongoDB connection');
  const { User } = load('./dist/models/User.js');
  const { Booking } = load('./dist/models/Booking.js');
  await User.init();
  child = spawn(process.execPath, ['dist/server.js'], { cwd: backend, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  await Promise.race([
    new Promise((resolve, reject) => {
      child.stdout.on('data', data => { if (data.toString().includes('API listening')) resolve(); });
      child.once('exit', () => reject(new Error('Server exited before listening')));
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Server startup timeout')), 12000).unref()),
  ]);
  const base = `http://127.0.0.1:${process.env.PORT || 4000}/api`;
  async function request(method, route, body, token, expected = 200) {
    const response = await fetch(base + route, { method, headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    assert.equal(response.status, expected, `${method} ${route} status`);
    const text = await response.text();
    return text ? JSON.parse(text) : undefined;
  }
  const health = await request('GET', '/health');
  check(health.ok && health.db, 'server startup and health report database connected');
  const tokens = [];
  for (let n = 0; n < 2; n++) {
    const user = await request('POST', '/auth/register', { name: 'GT4 Verification', email: emails[n].toUpperCase(), password, role: 'admin', isActive: false }, undefined, 201);
    ids.push(user.id);
    check(user.id && !('password' in user) && !('_id' in user) && user.role === 'tutee' && user.isActive, `register user ${n + 1}: safe output and privileged fields ignored`);
    const stored = await User.findById(user.id).select('+password');
    check(stored.password !== password && /^\$2[aby]\$/.test(stored.password) && await bcrypt.compare(password, stored.password), `user ${n + 1} stored password is bcrypt hash`);
    const login = await request('POST', '/auth/login', { email: emails[n], password });
    const decoded = jwt.verify(login.token, process.env.JWT_SECRET);
    check(decoded.userId === user.id && decoded.exp - decoded.iat === 7200 && !('password' in login.user), `login user ${n + 1}: signed two-hour JWT and safe user`);
    tokens.push(login.token);
  }
  await request('POST', '/auth/register', { name: 'Duplicate', email: emails[0], password }, undefined, 409);
  await request('POST', '/auth/login', { email: emails[0], password: 'incorrect' }, undefined, 401);
  check(true, 'duplicate email and incorrect login rejected');
  for (const token of [undefined, 'invalid', jwt.sign({ userId: ids[0] }, process.env.JWT_SECRET, { expiresIn: -1 }), jwt.sign({ userId: ids[0] }, crypto.randomBytes(32).toString('hex'), { expiresIn: '2h' })]) {
    await request('GET', '/bookings', undefined, token, 401);
  }
  check(true, 'missing, malformed, expired and wrong-signature tokens rejected');
  const row = await request('POST', '/bookings', { sessionId: 'gt4-test-session', note: 'Review algebra concepts', tuteeId: ids[1], createdAt: '2000-01-01' }, tokens[0], 201);
  check(row.tuteeId === ids[0] && row.status === 'pending' && !('_id' in row) && !('__v' in row) && new Date(row.createdAt).getFullYear() !== 2000, 'POST uses JWT owner, server date, defaults and serialized ids');
  const other = await request('POST', '/bookings', { sessionId: 'gt4-other-session' }, tokens[1], 201);
  const newer = await request('POST', '/bookings', { sessionId: 'gt4-newer-session' }, tokens[0], 201);
  const list = await request('GET', '/bookings', undefined, tokens[0]);
  check(list.length === 2 && list[0].id === newer.id && list.every(item => item.tuteeId === ids[0]) && !list.some(item => item.id === other.id), 'list isolates user and sorts newest first');
  check((await request('GET', `/bookings/${row.id}`, undefined, tokens[0])).id === row.id, 'owned GET works');
  const updated = await request('PATCH', `/bookings/${row.id}`, { status: 'confirmed', note: 'Updated learning goals', tuteeId: ids[1], createdAt: '2000-01-01' }, tokens[0]);
  check(updated.status === 'confirmed' && updated.note === 'Updated learning goals' && updated.tuteeId === ids[0] && updated.createdAt === row.createdAt, 'PATCH returns validated update and ignores ownership/date fields');
  for (const [method, body] of [['GET', undefined], ['PATCH', { status: 'completed' }], ['DELETE', undefined]]) {
    await request(method, `/bookings/${row.id}`, body, tokens[1], 404);
    await request(method, '/bookings/not-an-objectid', body, tokens[0], 400);
  }
  check(true, 'foreign ids return 404 and invalid ids return 400 for read/update/delete');
  for (const fields of [{ sessionId: '' }, { status: 'invalid' }, { note: 'short' }, { note: '' }, { note: null }, { note: 'x'.repeat(161) }]) {
    await request('POST', '/bookings', { sessionId: 'test', ...fields }, tokens[0], 400);
    await request('PATCH', `/bookings/${row.id}`, fields, tokens[0], 400);
  }
  await request('POST', '/bookings', {}, tokens[0], 400);
  check(true, 'Mongoose required/status/note validation rejects invalid creates and patches');
  check((await request('GET', `/bookings/${row.id}`, undefined, tokens[0])).status === 'confirmed', 'invalid PATCH leaves stored data unchanged');
  check(await request('DELETE', `/bookings/${row.id}`, undefined, tokens[0], 204) === undefined, 'owned DELETE returns 204 without body');
  await request('GET', `/bookings/${row.id}`, undefined, tokens[0], 404);
  await request('DELETE', `/bookings/${row.id}`, undefined, tokens[0], 404);
  check(true, 'deleted booking stays nonexistent');
  await request('GET', '/missing-route', undefined, undefined, 404);
  check(true, 'JSON fallback 404');
  console.log(`Verification complete: ${checks} grouped checks passed.`);
}
main().catch(error => {
  const reason = /bad auth|authentication failed/i.test(error.message) ? 'Atlas authentication failed' :
    error.name === 'AssertionError' ? error.message : 'runtime verification failed; connection details withheld';
  console.error(`FAIL ${error.name}: ${error.code || ''} ${reason}`);
  process.exitCode = 1;
}).finally(async () => {
  if (mongoose.connection.readyState === 1) {
    const { User } = load('./dist/models/User.js');
    const { Booking } = load('./dist/models/Booking.js');
    const users = await User.find({ email: { $in: emails } }).select('_id');
    const testIds = users.map(user => user._id);
    const bookings = await Booking.deleteMany({ tuteeId: { $in: testIds } });
    const removed = await User.deleteMany({ _id: { $in: testIds }, email: { $in: emails } });
    console.log(`Cleanup: removed ${removed.deletedCount} temporary users and ${bookings.deletedCount} remaining temporary bookings.`);
  }
  if (child && child.exitCode === null) { child.kill(); await once(child, 'exit'); }
  await mongoose.disconnect();
});
