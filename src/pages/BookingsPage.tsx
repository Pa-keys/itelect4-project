import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../api/client";
import { BookingBadge } from "../components/BookingBadge";
import { tutee } from "../data/mockData";
import useAuthStore from "../store/authStore";

function BookingsPage() {
  const userName = useAuthStore((state) => state.userName);
  const { data: bookings = [], isPending, isError, refetch } = useQuery({
    queryKey: ["bookings", tutee.id],
    queryFn: () => getBookings(tutee.id),
  });

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Protected booking area</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{userName}&apos;s bookings</h1>
      {isPending ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">Loading your bookings...</div>
      ) : isError ? (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"><p>Could not load your bookings. Check that the tutoring API is running.</p><button type="button" onClick={() => void refetch()} className="mt-3 rounded-xl bg-rose-600 px-3 py-2 font-semibold text-white">Retry loading</button></div>
      ) : bookings.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">No bookings yet. Choose a session from the dashboard to create one.</div>
      ) : (
        <ul className="mt-5 space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-950 dark:text-white">Session {booking.sessionId}</p><BookingBadge booking={booking} /></div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Created {booking.createdAt.toLocaleString("en-PH")}</p>
              {booking.note && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Note: {booking.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BookingsPage;
