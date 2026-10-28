export type UserRole = "tutor" | "tutee" | "admin";
export interface User { id: string; name: string; email: string; role: UserRole; isActive: boolean; bio?: string; subjects?: string[]; }
export interface Tutor { id: string; name: string; email: string; isActive: boolean; bio?: string; subjects?: string[]; }
export interface TutoringSession { id: string; tutorId: string; subject: string; scheduledAt: Date; durationMinutes: number; }
export enum BookingStatus { Pending = "pending", Confirmed = "confirmed", Completed = "completed", Cancelled = "cancelled" }
export interface Booking { id: string; sessionId: string; tuteeId: string; status: BookingStatus; note?: string; createdAt: Date; }
export type ApiTutoringSession = Omit<TutoringSession, "scheduledAt"> & { scheduledAt: string };
export type ApiBooking = Omit<Booking, "createdAt"> & { createdAt: string };
export type NewBooking = Pick<Booking, "sessionId" | "status" | "note">;
export type BookingUpdate = Partial<Pick<Booking, "sessionId" | "status" | "note">>;
export type AuthenticatedUser = Pick<User, "id" | "name" | "email" | "role" | "isActive">;
export interface AuthResponse { token: string; user: AuthenticatedUser; }
export type SupportLevel = "light-guidance" | "focused-help" | "foundational-help";
export interface SessionPrep { learningGoal: string; focusAreas: string[]; prepSteps: string[]; supportLevel: SupportLevel; }
