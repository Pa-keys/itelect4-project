import { Calendar, Clock, User, Check, ArrowRight, BookOpen } from "lucide-react";
import type { TutoringSession } from "../types";

export interface TutoringSessionCardProps {
  session: TutoringSession;
  tutorName: string;
  isSelected: boolean;
  isBookingPending?: boolean;
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
  isSelected,
  isBookingPending = false,
  onBookSession,
  variant = "default",
}: TutoringSessionCardProps) {
  const isCompact = variant === "compact";

  return (
    <article
      onClick={() => onBookSession(session.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onBookSession(session.id);
        }
      }}
      aria-pressed={isSelected}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected
          ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-1 ring-emerald-500/30 dark:border-emerald-400 dark:bg-emerald-950/20 dark:ring-emerald-400/30"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:border-slate-700"
      }`}
    >
      <div>
        {/* Top Header: Subject + Status */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h4
                className={`font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                  isCompact ? "text-sm" : "text-base"
                }`}
              >
                {session.subject}
              </h4>
              <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <User className="h-3 w-3" />
                <span>{tutorName}</span>
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              isSelected
                ? "bg-emerald-100/80 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
            }`}
          >
            {isSelected ? (
              <>
                <Check className="h-3 w-3" />
                <span>Selected</span>
              </>
            ) : (
              "Open Slot"
            )}
          </span>
        </div>

        {/* Schedule Time Pill Grid */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50/80 p-2.5 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                Date
              </p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {dayFormatter.format(session.scheduledAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                Time
              </p>
              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {timeFormatter.format(session.scheduledAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>Duration</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {session.durationMinutes} minutes
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-3.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <button
          type="button"
          tabIndex={-1}
          disabled={isBookingPending}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
            isSelected
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-700"
              : "bg-blue-600 text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isSelected ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Selected for Checkout</span>
            </>
          ) : isBookingPending ? (
            <span>Processing...</span>
          ) : (
            <>
              <span>Select this Session</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
