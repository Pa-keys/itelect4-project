import type { ApiBooking, ApiTutoringSession, Booking, NewBooking, TutoringSession, User } from "../types";

const API_URL = "http://localhost:3001";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) throw new Error(`API request failed with status ${response.status}.`);
  return response.json() as Promise<T>;
}

const toSession = (session: ApiTutoringSession): TutoringSession => ({ ...session, scheduledAt: new Date(session.scheduledAt) });
const toBooking = (booking: ApiBooking): Booking => ({ ...booking, createdAt: new Date(booking.createdAt) });

export async function getTutors(): Promise<User[]> {
  return requestJson<User[]>("/tutors");
}

export async function getTutor(tutorId: string): Promise<User | null> {
  const tutors = await requestJson<User[]>(`/tutors?id=${encodeURIComponent(tutorId)}`);
  return tutors[0] ?? null;
}

export async function getSessions(tutorId?: string): Promise<TutoringSession[]> {
  const filter = tutorId === undefined ? "" : `?tutorId=${encodeURIComponent(tutorId)}`;
  const sessions = await requestJson<ApiTutoringSession[]>(`/sessions${filter}`);
  return sessions.map(toSession);
}

export async function getBookings(tuteeId: string): Promise<Booking[]> {
  const bookings = await requestJson<ApiBooking[]>(`/bookings?tuteeId=${encodeURIComponent(tuteeId)}`);
  return bookings.map(toBooking);
}

export async function createBooking(payload: NewBooking): Promise<Booking> {
  const booking = await requestJson<ApiBooking>("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return toBooking(booking);
}
