import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white/95 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
      <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">That tutoring page does not exist or may have moved.</p>
      <Link to="/" className="mt-5 inline-flex rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700">Return to dashboard</Link>
    </section>
  );
}

export default NotFoundPage;
