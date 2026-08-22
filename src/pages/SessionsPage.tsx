import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSessions, getTutors } from "../api/client";

const scheduleFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
});

function SessionsPage() {
  const tutorsQuery = useQuery({ queryKey: ["tutors"], queryFn: getTutors });
  const sessionsQuery = useQuery({ queryKey: ["sessions"], queryFn: () => getSessions() });

  if (tutorsQuery.isPending || sessionsQuery.isPending) {
    return <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white/95 p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-300">Loading session availability...</section>;
  }

  if (tutorsQuery.isError || sessionsQuery.isError) {
    return <section className="mx-auto max-w-5xl rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"><h1 className="text-xl font-semibold">Could not load sessions.</h1><p className="mt-2 text-sm">Check that the tutoring API is running, then try again.</p><button type="button" onClick={() => { void tutorsQuery.refetch(); void sessionsQuery.refetch(); }} className="mt-4 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Retry loading</button></section>;
  }

  const tutors = tutorsQuery.data;
  const sessions = sessionsQuery.data;

  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Session availability</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Upcoming tutoring sessions</h1>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {sessions.map((session) => {
          const tutor = tutors.find((item) => item.id === session.tutorId);
          return (
            <article key={session.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <h2 className="font-semibold text-slate-950 dark:text-white">{session.subject}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{scheduleFormatter.format(session.scheduledAt)}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{session.durationMinutes} minutes</p>
              {tutor && <Link to={`/tutors/${tutor.id}`} className="mt-3 inline-flex text-sm font-semibold text-sky-700 hover:underline dark:text-sky-300">Tutor: {tutor.name}</Link>}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default SessionsPage;
