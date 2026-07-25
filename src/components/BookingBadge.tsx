import type React from "react"; import type { Booking } from "../types";
export interface BookingBadgeProps { booking: Booking; children?: React.ReactNode; }
export const BookingBadge: React.FC<BookingBadgeProps> = ({booking,children}) => <span className="badge">{booking.status}{children}</span>;
