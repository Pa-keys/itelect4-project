import useAuthStore from "../store/authStore";
import type { ApiBooking, ApiTutoringSession, AuthResponse, AuthenticatedUser, Booking, BookingUpdate, NewBooking, SessionPrep, Tutor, TutoringSession } from "../types";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
if (!configuredApiUrl) throw new Error("VITE_API_URL is missing. Set it in .env before starting the frontend.");
const API_URL = configuredApiUrl.replace(/\/+$/, "");

class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); }
}

interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
  body?: unknown;
  private?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, private: isPrivate = false, ...init } = options;
  const headers = new Headers();
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (isPrivate) {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("Your session has ended. Please log in again.");
    headers.set("Authorization", `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new Error(`Could not reach the API at ${API_URL}.`);
  }
  const text = response.status === 204 ? "" : await response.text();
  let data: unknown = undefined;
  if (text) {
    try { data = JSON.parse(text) as unknown; } catch { data = text; }
  }
  if (!response.ok) {
    const message = typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
      ? data.message
      : `API request failed with status ${response.status}.`;
    if (isPrivate && response.status === 401) useAuthStore.getState().logout();
    throw new ApiError(message, response.status);
  }
  return data as T;
}

const toSession = (session: ApiTutoringSession): TutoringSession => ({ ...session, scheduledAt: new Date(session.scheduledAt) });
const toBooking = (booking: ApiBooking): Booking => ({ ...booking, createdAt: new Date(booking.createdAt) });

export async function getTutors(): Promise<Tutor[]> {
  return request<Tutor[]>("/api/tutors");
}

export async function getTutor(tutorId: string): Promise<Tutor | null> {
  try { return await request<Tutor>(`/api/tutors/${encodeURIComponent(tutorId)}`); }
  catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
}

export async function getSessions(tutorId?: string): Promise<TutoringSession[]> {
  const filter = tutorId === undefined ? "" : `?tutorId=${encodeURIComponent(tutorId)}`;
  const sessions = await request<ApiTutoringSession[]>(`/api/sessions${filter}`);
  return sessions.map(toSession);
}

export async function getSession(sessionId: string): Promise<TutoringSession> {
  return toSession(await request<ApiTutoringSession>(`/api/sessions/${encodeURIComponent(sessionId)}`));
}

export async function getBookings(): Promise<Booking[]> {
  const bookings = await request<ApiBooking[]>("/api/bookings", { private: true });
  return bookings.map(toBooking);
}

export async function createBooking(payload: NewBooking): Promise<Booking> {
  const booking = await request<ApiBooking>("/api/bookings", {
    method: "POST",
    body: payload,
    private: true,
  });
  return toBooking(booking);
}

export async function getBooking(bookingId: string): Promise<Booking> {
  return toBooking(await request<ApiBooking>(`/api/bookings/${encodeURIComponent(bookingId)}`, { private: true }));
}

export async function updateBooking(bookingId: string, payload: BookingUpdate): Promise<Booking> {
  return toBooking(await request<ApiBooking>(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: "PATCH", body: payload, private: true }));
}

export async function deleteBooking(bookingId: string): Promise<void> {
  await request<void>(`/api/bookings/${encodeURIComponent(bookingId)}`, { method: "DELETE", private: true });
}

export async function askAi(prompt: string): Promise<SessionPrep> {
  return request<SessionPrep>("/api/ai", { method: "POST", body: { prompt }, private: true });
}

export async function loginUser(credentials: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", { method: "POST", body: credentials });
}

export async function registerUser(details: { name: string; email: string; password: string }): Promise<AuthenticatedUser> {
  return request<AuthenticatedUser>("/api/auth/register", { method: "POST", body: details });
}
