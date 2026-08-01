import type React from "react";
import type { Booking } from "../types";

export interface BookingBadgeProps {
  booking: Booking;
  children?: React.ReactNode;
}

export const BookingBadge: React.FC<BookingBadgeProps> = ({
  booking,
  children,
}) => {
  const statusClasses =
    booking.status === "confirmed"
      ? "border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
      : booking.status === "pending"
        ? "border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
        : booking.status === "cancelled"
          ? "border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
          : "border border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusClasses}`}
    >
      {booking.status}
      {children}
    </span>
  );
};
