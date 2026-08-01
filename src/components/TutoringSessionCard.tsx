import type { TutoringSession } from "../types";

export interface TutoringSessionCardProps {
  session: TutoringSession;
  tutorName: string;
  isBooked: boolean;
  onBookSession: (id: TutoringSession["id"]) => void;
  variant?: "default" | "compact";
}

const dayFormatter = new Intl.DateTimeFormat("en-PH", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-PH", {
  hour: "numeric",
  minute: "2-digit",
});

export function TutoringSessionCard({
  session,
  tutorName,
  isBooked,
  onBookSession,
  variant = "default",
}: TutoringSessionCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      className={`rounded-2xl border bg-white shadow-sm ring-1 ring-slate-950/5 transition hover:shadow-md dark:bg-slate-900 dark:ring-white/10 ${
        isBooked
          ? "border-emerald-300 dark:border-emerald-500/30"
          : "border-slate-200 dark:border-slate-700 dark:hover:border-slate-600"
      } ${isCompact ? "p-3" : "p-3.5"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            Available session
          </p>
          <h2
            className={`mt-1 font-semibold tracking-tight text-slate-950 dark:text-white ${
              isCompact ? "text-base" : "text-lg"
            }`}
          >
            {session.subject}
          </h2>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            isBooked
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          {isBooked ? "Booked" : "Open"}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/70">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Date
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {dayFormatter.format(session.scheduledAt)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Time
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            {timeFormatter.format(session.scheduledAt)}
          </p>
        </div>
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
        <p>
          Tutor: <span className="font-medium text-slate-900 dark:text-white">{tutorName}</span>
        </p>
        <p>
          Duration: <span className="font-medium text-slate-900 dark:text-white">{session.durationMinutes} minutes</span>
        </p>
      </div>

      <button
        type="button"
        disabled={isBooked}
        onClick={() => onBookSession(session.id)}
        className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:focus-visible:ring-offset-slate-950 dark:disabled:bg-slate-700 dark:disabled:text-slate-300"
      >
        {isBooked ? "Booked for this student" : "Book this session"}
      </button>
    </article>
  );
}
