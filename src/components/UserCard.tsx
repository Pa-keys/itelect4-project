import { Check, Sparkles, BookOpen, UserCheck } from "lucide-react";
import type { Tutor } from "../types";

export interface UserCardProps {
  user: Tutor;
  isSelected?: boolean;
  onSelectTutor: (id: Tutor["id"]) => void;
}

export function UserCard({
  user,
  isSelected = false,
  onSelectTutor,
}: UserCardProps) {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <article
      onClick={() => onSelectTutor(user.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectTutor(user.id);
        }
      }}
      aria-pressed={isSelected}
      className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected
          ? "border-blue-500 bg-blue-50/60 shadow-md ring-1 ring-blue-500/30 dark:border-blue-400 dark:bg-blue-950/20 dark:ring-blue-400/30"
          : "border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-md dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:border-slate-700"
      }`}
    >
      <div>
        {/* Top Header: Avatar + Name + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-sm font-bold text-white shadow-sm">
              {getInitials(user.name)}
              {user.isActive && (
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {user.name}
                </h3>
                <UserCheck className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Academic Peer Tutor
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              user.isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {user.isActive ? "Available" : "Offline"}
          </span>
        </div>

        {/* Bio */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
          {user.bio}
        </p>

        {/* Subjects / Expertise Pills */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {user.subjects?.map((subject) => (
            <span
              key={subject}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 text-[11px] font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <BookOpen className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              {subject}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Action & Indicator */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {isSelected ? "Filtering sessions" : "Click to view sessions"}
        </span>
        <button
          type="button"
          tabIndex={-1}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            isSelected
              ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-600"
              : "bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-blue-600"
          }`}
        >
          {isSelected ? (
            <>
              <Check className="h-3.5 w-3.5" />
              <span>Selected</span>
            </>
          ) : (
            <span>View Sessions</span>
          )}
        </button>
      </div>
    </article>
  );
}
