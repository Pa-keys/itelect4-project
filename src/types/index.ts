export type UserRole = "tutor" | "tutee" | "admin";
export interface User { id: string; name: string; email: string; role: UserRole; isActive: boolean; }
export interface TutoringSession { id: string; tutorId: string; subject: string; scheduledAt: Date; durationMinutes: number; }
export enum BookingStatus { Pending = "pending", Confirmed = "confirmed", Completed = "completed", Cancelled = "cancelled" }
export interface Booking { id: string; sessionId: string; tuteeId: string; status: BookingStatus; note?: string; createdAt: Date; }
export interface ApiResponse<T> { success: boolean; data: T; message?: string; }
export type BookingUpdate = Partial<Booking>; export type BookingPreview = Pick<Booking, "id" | "sessionId" | "status">; export type StringOrNumber = string | number;
export function getFirst<T>(items: T[]): T | undefined { return items[0]; }
