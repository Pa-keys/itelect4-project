import { Link } from "react-router";
import { mockSessions, mockTutors } from "../data/mockData";

const scheduleFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
});

function SessionsPage() {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Session availability</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Upcoming tutoring sessions</h1>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {mockSessions.map((session) => {
          const tutor = mockTutors.find((item) => item.id === session.tutorId);
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
