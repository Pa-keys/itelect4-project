import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSessions, getTutors } from "../api/client";
import {
  Calendar,
  Clock,
  User,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

const dayFormatter = new Intl.DateTimeFormat("en-PH", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-PH", {
  hour: "numeric",
  minute: "2-digit",
});

function SessionsPage() {
  const [filterSubject, setFilterSubject] = useState<string | null>(null);
  const tutorsQuery = useQuery({ queryKey: ["tutors"], queryFn: getTutors });
  const sessionsQuery = useQuery({ queryKey: ["sessions"], queryFn: () => getSessions() });

  if (tutorsQuery.isPending || sessionsQuery.isPending) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-48 rounded-3xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  if (tutorsQuery.isError || sessionsQuery.isError) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
        <h1 className="text-base font-bold">Could not load sessions.</h1>
        <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
          Check that the tutoring API is running, then try again.
        </p>
        <button
          type="button"
          onClick={() => {
            void tutorsQuery.refetch();
            void sessionsQuery.refetch();
          }}
          className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </section>
    );
  }

  const tutors = tutorsQuery.data ?? [];
  const sessions = sessionsQuery.data ?? [];

  const uniqueSubjects = Array.from(new Set(sessions.map((s) => s.subject)));

  const filteredSessions = sessions.filter(
    (s) => !filterSubject || s.subject === filterSubject,
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 mb-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Campus Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Upcoming Tutoring Sessions
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Browse all open slots across subjects and book your peer mentoring session.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <span>Open Booking Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Subject Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Filter by topic:</span>
          </div>
          <button
            type="button"
            onClick={() => setFilterSubject(null)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              filterSubject === null
                ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            All ({sessions.length})
          </button>
          {uniqueSubjects.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setFilterSubject(filterSubject === subject ? null : subject)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                filterSubject === subject
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      </section>

      {/* Sessions Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredSessions.map((session) => {
          const tutor = tutors.find((item) => item.id === session.tutorId);

          return (
            <article
              key={session.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        {session.subject}
                      </h2>
                      {tutor && (
                        <Link
                          to={`/tutors/${tutor.id}`}
                          className="text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1 mt-0.5"
                        >
                          <User className="h-3 w-3" />
                          <span>{tutor.name}</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    Open Slot
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-slate-50/80 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Date</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {dayFormatter.format(session.scheduledAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Time</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {timeFormatter.format(session.scheduledAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                  <span>Session Length</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {session.durationMinutes} minutes
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
                >
                  <span>Book on Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {tutor && (
                  <Link
                    to={`/tutors/${tutor.id}`}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    Tutor Profile
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default SessionsPage;
