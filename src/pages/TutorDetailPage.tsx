import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSessions, getTutor } from "../api/client";

function TutorDetailPage() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const tutorQuery = useQuery({
    queryKey: ["tutor", tutorId],
    queryFn: () => getTutor(tutorId!),
    enabled: tutorId !== undefined,
  });
  const sessionsQuery = useQuery({
    queryKey: ["sessions", { tutorId }],
    queryFn: () => getSessions(tutorId),
    enabled: tutorId !== undefined,
  });

  if (tutorId === undefined) {
    return <section className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"><h1 className="text-xl font-semibold">Tutor not found</h1><p className="mt-2 text-sm">The tutor ID is missing.</p></section>;
  }

  if (tutorQuery.isPending || sessionsQuery.isPending) {
    return <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-300">Loading tutor profile...</section>;
  }

  if (tutorQuery.isError || sessionsQuery.isError) {
    return <section className="mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"><h1 className="text-xl font-semibold">Could not load tutor data.</h1><p className="mt-2 text-sm">Check that the tutoring API is running, then try again.</p><button type="button" onClick={() => { void tutorQuery.refetch(); void sessionsQuery.refetch(); }} className="mt-4 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Retry loading</button></section>;
  }

  const tutor = tutorQuery.data;

  if (tutor === null) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
        <h1 className="text-xl font-semibold">Tutor not found</h1>
        <p className="mt-2 text-sm">The tutor ID is missing or does not match an available profile.</p>
        <button type="button" onClick={() => navigate("/tutors")} className="mt-4 rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">
          Return to tutors
        </button>
      </section>
    );
  }

  const sessions = sessionsQuery.data;

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Tutor profile</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{tutor.name}</h1>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{tutor.bio}</p>
      <h2 className="mt-6 text-lg font-semibold text-slate-950 dark:text-white">Upcoming sessions</h2>
      <ul className="mt-3 space-y-2">
        {sessions.map((session) => (
          <li key={session.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
            <span className="font-semibold text-slate-950 dark:text-white">{session.subject}</span>
            <span className="ml-2 text-slate-500 dark:text-slate-400">({session.durationMinutes} minutes)</span>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => navigate("/sessions")} className="mt-5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">
        Browse all sessions
      </button>
    </section>
  );
}

export default TutorDetailPage;
