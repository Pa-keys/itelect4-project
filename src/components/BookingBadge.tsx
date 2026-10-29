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
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-300"
      : booking.status === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/40 dark:text-amber-300"
        : booking.status === "cancelled"
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/40 dark:bg-rose-950/40 dark:text-rose-300"
          : "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${statusClasses}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {booking.status}
      {children}
    </span>
  );
};
