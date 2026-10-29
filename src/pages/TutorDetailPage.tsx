import { useNavigate, useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getSessions, getTutor } from "../api/client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  UserCheck,
  ArrowRight,
  RefreshCw,
  Mail,
} from "lucide-react";

const scheduleFormatter = new Intl.DateTimeFormat("en-PH", {
  dateStyle: "medium",
  timeStyle: "short",
});

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

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (tutorId === undefined) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
        <h1 className="text-lg font-bold">Tutor not found</h1>
        <p className="mt-1 text-xs">The requested tutor identifier is missing.</p>
        <Link to="/tutors" className="mt-3 inline-flex text-xs font-bold text-rose-700 underline">
          Back to Tutors
        </Link>
      </section>
    );
  }

  if (tutorQuery.isPending || sessionsQuery.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-64 rounded-3xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
      </div>
    );
  }

  if (tutorQuery.isError || sessionsQuery.isError) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
        <h1 className="text-lg font-bold">Could not load tutor profile.</h1>
        <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
          Check that the tutoring API backend is online, then try again.
        </p>
        <button
          type="button"
          onClick={() => {
            void tutorQuery.refetch();
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

  const tutor = tutorQuery.data;

  if (tutor === null || tutor === undefined) {
    return (
      <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">Tutor Profile Not Found</h1>
        <p className="mt-1 text-xs text-slate-500">
          This tutor profile is inactive or does not exist.
        </p>
        <button
          type="button"
          onClick={() => navigate("/tutors")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
        >
          <span>Return to Tutors</span>
        </button>
      </section>
    );
  }

  const sessions = sessionsQuery.data ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/tutors"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to All Tutors</span>
      </Link>

      {/* Main Profile Card */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-xl font-extrabold text-white shadow-md">
              {getInitials(tutor.name)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {tutor.name}
                </h1>
                <UserCheck className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Campus Peer Mentor &middot; Computer Science Department
              </p>
              {tutor.email && (
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                  <Mail className="h-3 w-3" />
                  <span>{tutor.email}</span>
                </p>
              )}
            </div>
          </div>

          <span
            className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${
              tutor.isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800"
            }`}
          >
            {tutor.isActive ? "Available for Booking" : "Offline"}
          </span>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            About the Mentor
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {tutor.bio}
          </p>
        </div>

        {/* Subjects */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Areas of Expertise
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects?.map((subject) => (
              <span
                key={subject}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
              >
                <BookOpen className="h-3 w-3 text-blue-500" />
                {subject}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Available Sessions Section */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Study Slots
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reserved appointments with {tutor.name}
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            {sessions.length} slot{sessions.length === 1 ? "" : "s"}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-500 dark:border-slate-800">
            No upcoming session slots listed for this mentor right now.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {session.subject}
                  </h3>
                  <span className="rounded-md bg-blue-100/60 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {session.durationMinutes}m
                  </span>
                </div>

                <div className="mt-2.5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>{scheduleFormatter.format(session.scheduledAt)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <Link
                    to="/"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    <span>Book on Dashboard</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TutorDetailPage;
