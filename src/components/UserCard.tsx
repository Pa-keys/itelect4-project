import type { User } from "../types";

export interface UserCardProps {
  user: User;
  isSelected?: boolean;
  onSelectTutor: (id: User["id"]) => void;
}

export function UserCard({
  user,
  isSelected = false,
  onSelectTutor,
}: UserCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelectTutor(user.id)}
      className={`group flex flex-col rounded-2xl border bg-white p-3 text-left shadow-sm ring-1 ring-slate-950/5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:bg-slate-900 dark:ring-white/10 dark:focus-visible:ring-offset-slate-950 ${
        isSelected
          ? "border-sky-500 bg-sky-50/70 shadow-md dark:border-sky-400 dark:bg-sky-500/10"
          : "border-slate-200 dark:border-slate-700 dark:hover:border-slate-600"
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">
            Tutor profile
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-slate-950 dark:text-white">
            {user.name}
          </h2>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            user.isActive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
          }`}
        >
          {user.isActive ? "Available" : "Offline"}
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
        {user.bio}
      </p>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {user.subjects?.map((subject) => (
          <span
            key={subject}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {subject}
          </span>
        ))}
      </div>

      <div className="mt-2.5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/70">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Role
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            Peer tutor
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Sessions
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
            View availability
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {isSelected ? "Currently selected" : "Select to filter sessions"}
        </p>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition ${
            isSelected
              ? "bg-sky-600 text-white dark:bg-sky-500"
              : "bg-slate-100 text-slate-700 group-hover:bg-sky-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:group-hover:bg-sky-500"
          }`}
        >
          {isSelected ? "Selected" : "View sessions"}
        </span>
      </div>
    </button>
  );
}
