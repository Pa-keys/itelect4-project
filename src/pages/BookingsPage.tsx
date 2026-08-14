import useAuthStore from "../store/authStore";

function BookingsPage() {
  const userName = useAuthStore((state) => state.userName);

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Protected booking area</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{userName}&apos;s bookings</h1>
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
        New bookings confirmed from the dashboard will appear here when persistent data is added in a later session.
      </div>
    </section>
  );
}

export default BookingsPage;
