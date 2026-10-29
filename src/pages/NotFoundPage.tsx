import { Link } from "react-router";
import { Compass, ArrowRight } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto my-12 text-center">
      <section className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 mb-4">
          <Compass className="h-7 w-7" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          Error 404
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Page Not Found
        </h1>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          The requested page or resource could not be found. Let's get you back to the campus tutoring hub.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <span>Return to Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
