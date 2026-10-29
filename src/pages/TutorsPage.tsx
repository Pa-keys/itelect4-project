import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTutors } from "../api/client";
import {
  GraduationCap,
  BookOpen,
  UserCheck,
  ArrowRight,
  Search,
  RefreshCw,
  X,
} from "lucide-react";

function TutorsPage() {
  const [search, setSearch] = useState("");
  const { data: tutors = [], isPending, isError, refetch } = useQuery({
    queryKey: ["tutors"],
    queryFn: getTutors,
  });

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const filtered = tutors.filter((tutor) =>
    `${tutor.name} ${tutor.subjects?.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 mb-2">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Campus Mentors</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Meet the Peer Tutors
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Browse experienced student mentors and open their profiles to view subjects and available session slots.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by name or subject..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 text-xs text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Tutors Grid */}
      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-3xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200">
          <h2 className="text-base font-bold">Could not load tutor directory.</h2>
          <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
            Check that the tutoring API backend is online, then retry.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
          No peer tutors match your criteria.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tutor) => (
            <article
              key={tutor.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-sm font-bold text-white shadow-sm">
                      {getInitials(tutor.name)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          {tutor.name}
                        </h2>
                        <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Peer Mentor
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      tutor.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                    }`}
                  >
                    {tutor.isActive ? "Available" : "Offline"}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {tutor.bio}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tutor.subjects?.map((subject) => (
                    <span
                      key={subject}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                    >
                      <BookOpen className="h-2.5 w-2.5 text-slate-400" />
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <Link
                  to={`/tutors/${tutor.id}`}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 transition"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default TutorsPage;
