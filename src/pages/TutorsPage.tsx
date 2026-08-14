import { Link } from "react-router";
import { mockTutors } from "../data/mockData";

function TutorsPage() {
  return (
    <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Tutor directory</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Meet the peer tutors</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Open a profile to review subjects and available sessions.</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {mockTutors.map((tutor) => (
          <article key={tutor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">{tutor.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{tutor.bio}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tutor.subjects?.map((subject) => <span key={subject} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-900 dark:text-slate-200">{subject}</span>)}
            </div>
            <Link to={`/tutors/${tutor.id}`} className="mt-4 inline-flex rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-700">
              View tutor profile
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TutorsPage;
