import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { BookingBadge } from "./components/BookingBadge";
import { TutoringSessionCard } from "./components/TutoringSessionCard";
import { UserCard } from "./components/UserCard";
import usePrevious from "./hooks/usePrevious";
import useToggle from "./hooks/useToggle";
import {
  BookingStatus,
  type Booking,
  type TutoringSession,
  type User,
} from "./types";

const mockTutors: User[] = [
  {
    id: "tutor-1",
    name: "Maria Santos",
    email: "maria@example.com",
    role: "tutor",
    isActive: true,
    bio: "Patient programming tutor who loves practical examples.",
    subjects: ["TypeScript", "React", "JavaScript"],
  },
  {
    id: "tutor-2",
    name: "Alex Rivera",
    email: "alex@example.com",
    role: "tutor",
    isActive: true,
    bio: "Computer science tutor focused on clear fundamentals.",
    subjects: ["Python", "Data Structures", "Algorithms"],
  },
];

const tutee: User = {
  id: "tutee-1",
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "tutee",
  isActive: true,
};

const mockSessions: TutoringSession[] = [
  {
    id: "session-1",
    tutorId: "tutor-1",
    subject: "TypeScript Fundamentals",
    scheduledAt: new Date("2026-08-01T10:00:00+08:00"),
    durationMinutes: 60,
  },
  {
    id: "session-2",
    tutorId: "tutor-1",
    subject: "React Components",
    scheduledAt: new Date("2026-08-02T14:00:00+08:00"),
    durationMinutes: 60,
  },
  {
    id: "session-3",
    tutorId: "tutor-2",
    subject: "Data Structures",
    scheduledAt: new Date("2026-08-03T09:00:00+08:00"),
    durationMinutes: 90,
  },
  {
    id: "session-4",
    tutorId: "tutor-2",
    subject: "Algorithm Problem Solving",
    scheduledAt: new Date("2026-08-04T15:30:00+08:00"),
    durationMinutes: 60,
  },
];

const dayFormatter = new Intl.DateTimeFormat("en-PH", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-PH", {
  hour: "numeric",
  minute: "2-digit",
});

function App() {
  const [search, setSearch] = useState<string>("");
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [note, setNote] = useState<string>("");
  const [tutors, setTutors] = useState<User[]>([]);
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [showSearchTip, toggleSearchTip] = useToggle(true);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const previousSearch = usePrevious<string>(search);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const loadTimeoutRef = useRef<number | null>(null);

  const loadMockData = (shouldFail: boolean = false): void => {
    setIsLoading(true);
    setIsError(false);

    if (loadTimeoutRef.current !== null) {
      window.clearTimeout(loadTimeoutRef.current);
    }

    loadTimeoutRef.current = window.setTimeout(() => {
      if (shouldFail) {
        setIsLoading(false);
        setIsError(true);
        return;
      }

      setTutors(mockTutors);
      setSessions(mockSessions);
      setIsLoading(false);
      searchInputRef.current?.focus();
    }, 300);
  };

  useEffect(() => {
    loadMockData();

    return () => {
      if (loadTimeoutRef.current !== null) {
        window.clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  const filteredTutors = useMemo(
    () =>
      tutors.filter((tutor) =>
        `${tutor.name} ${tutor.subjects?.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, tutors],
  );

  const visibleSessions = sessions.filter(
    (session) => !selectedTutorId || session.tutorId === selectedTutorId,
  );
  const selectedTutor = selectedTutorId
    ? tutors.find((tutor) => tutor.id === selectedTutorId)
    : undefined;
  const bookedSession = booking
    ? sessions.find((session) => session.id === booking.sessionId)
    : undefined;
  const bookedTutor = bookedSession
    ? tutors.find((tutor) => tutor.id === bookedSession.tutorId)
    : undefined;
  const activeTutorCount = tutors.filter((tutor) => tutor.isActive).length;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const handleNoteChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setNote(event.target.value);
  };

  const handleBook = (sessionId: string): void => {
    setBooking({
      id: `booking-${Date.now()}`,
      sessionId,
      tuteeId: tutee.id,
      status: BookingStatus.Confirmed,
      note,
      createdAt: new Date(),
    });
  };

  const statusContent = isLoading ? (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10">
      <div className="grid gap-4 p-4 md:p-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_22rem]">
        <div className="animate-pulse rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-6 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="h-52 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800" />
            <div className="h-52 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
        <div className="animate-pulse rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-6 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            <div className="h-48 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800" />
            <div className="h-48 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
        <div className="animate-pulse rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-8 w-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="mt-4 h-24 rounded-[1.25rem] bg-slate-100 dark:bg-slate-800" />
          <div className="mt-3 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
      <p className="px-4 pb-4 text-sm text-slate-500 dark:text-slate-400 md:px-5 md:pb-5">
        Loading tutors and session availability...
      </p>
    </div>
  ) : isError ? (
    <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50/90 p-5 text-rose-900 shadow-sm ring-1 ring-rose-950/5 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100 dark:ring-white/10 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700 dark:text-rose-200">
        Loading issue
      </p>
      <h2 className="mt-2 text-xl font-semibold">Could not load tutor data.</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-800/90 dark:text-rose-100/80">
        The mock session list did not finish loading. Use the retry action to
        restore the tutor directory and booking workflow.
      </p>
      <button
        type="button"
        onClick={() => loadMockData()}
        className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
      >
        Retry loading
      </button>
    </div>
  ) : (
    <div className="grid items-start gap-3 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)_20rem] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_21rem]">
      <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
              Tutor directory
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              {search ? `Tutors matching "${search}"` : "Choose a peer tutor"}
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 dark:text-slate-300">
              Review teaching strengths, subjects, and availability before
              narrowing the sessions beside this list.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:min-w-64">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Active tutors
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                {activeTutorCount}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/80">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Open sessions
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
                {visibleSessions.length}
              </p>
            </div>
          </div>
        </div>

        {filteredTutors.length === 0 ? (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
            No tutors match your search. Try React, TypeScript, or Algorithms.
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2.5 lg:grid-cols-2">
            {filteredTutors.map((tutor) => (
              <UserCard
                key={tutor.id}
                user={tutor}
                isSelected={selectedTutorId === tutor.id}
                onSelectTutor={setSelectedTutorId}
              />
            ))}
          </div>
        )}
      </section>

      <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
              Session availability
            </p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
              {selectedTutor
                ? `Sessions with ${selectedTutor.name}`
                : "All available sessions"}
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-600 dark:text-slate-300">
              Compare schedule, duration, and subject focus, then book directly.
            </p>
          </div>
          {selectedTutor && (
            <button
              type="button"
              onClick={() => setSelectedTutorId(null)}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
            >
              Clear tutor filter
            </button>
          )}
        </div>

        {visibleSessions.length === 0 ? (
          <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
            No sessions are available for this tutor right now.
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-2.5 lg:grid-cols-2">
            {visibleSessions.map((session) => {
              const tutor = tutors.find((item) => item.id === session.tutorId);

              return tutor ? (
                <TutoringSessionCard
                  key={session.id}
                  session={session}
                  tutorName={tutor.name}
                  isBooked={booking?.sessionId === session.id}
                  onBookSession={handleBook}
                  variant={selectedTutorId ? "compact" : "default"}
                />
              ) : null;
            })}
          </div>
        )}
      </section>

      <aside className="min-w-0 space-y-2">
        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 sm:p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
                Booking summary
              </p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                Your booking
              </h2>
            </div>
            {booking && <BookingBadge booking={booking} />}
          </div>

          {booking && bookedSession ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-[1.25rem] border border-emerald-200 bg-emerald-50/80 p-3.5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Session confirmed
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-800 dark:text-emerald-100/80">
                  You are booked for {bookedSession.subject} with {bookedTutor?.name}.
                </p>
              </div>
              <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                <p className="text-base font-semibold text-slate-950 dark:text-white">
                  {bookedSession.subject}
                </p>
                <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <span>Tutor</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {bookedTutor?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Date</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {dayFormatter.format(bookedSession.scheduledAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Time</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {timeFormatter.format(bookedSession.scheduledAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Duration</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {bookedSession.durationMinutes} minutes
                    </span>
                  </div>
                </div>
              </div>
              {booking.note && (
                <div className="rounded-[1.25rem] border border-slate-200 bg-white p-3.5 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  <p className="font-medium text-slate-900 dark:text-white">Learning note</p>
                  <p className="mt-1.5">{booking.note}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-[1.25rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm leading-6 text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
              No session booked yet. Add an optional note, then choose a session
              from the availability list.
            </div>
          )}

          <label
            htmlFor="booking-note"
            className="mt-3 block text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            Booking note
            <input
              id="booking-note"
              value={note}
              onChange={handleNoteChange}
              placeholder="What would you like to focus on during the session?"
              className="mt-1.5 min-h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-sky-500/20"
            />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 sm:p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">
            Demo controls
          </p>
          <h2 className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
            Status controls
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Use this control to verify the styled loading and error states required
            by GT2 Part 3.
          </p>
          <button
            type="button"
            onClick={() => loadMockData(true)}
            className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15 dark:focus-visible:ring-offset-slate-950"
          >
            Simulate load error
          </button>
        </section>
      </aside>
    </div>
  );

  return (
    <div className={`min-h-dvh ${isDarkMode ? "dark" : ""}`}>
      <main className="min-h-dvh overflow-x-hidden bg-[linear-gradient(180deg,#f3f6fb_0%,#eef3f9_100%)] text-slate-900 transition-colors dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)] dark:text-slate-100">
        <div className="mx-auto w-full max-w-[1800px] px-3 py-3 sm:px-4 xl:px-6">
          <section className="rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-sm ring-1 ring-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95 dark:ring-white/10 sm:p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 dark:text-sky-300">
                  Peer Tutoring Booking Platform
                </p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-[1.7rem]">
                  Book trusted academic support with clarity and confidence.
                </h1>
                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 dark:text-slate-300">
                  Browse peer tutors, compare upcoming sessions, and confirm your
                  learning plan without leaving the page.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus-visible:ring-offset-slate-950"
                >
                  {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                </button>
                <button
                  type="button"
                  onClick={toggleSearchTip}
                  className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"
                >
                  {showSearchTip ? "Hide search tip" : "Show search tip"}
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(28rem,0.55fr)] lg:items-start">
              <div className="min-w-0 space-y-2">
                <label
                  htmlFor="tutor-search"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-200"
                >
                  Search tutors or subjects
                  <input
                    ref={searchInputRef}
                    id="tutor-search"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Try React, TypeScript, or Maria"
                    className="mt-1.5 min-h-10 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-sky-500/20"
                  />
                </label>
                <div className="flex flex-wrap gap-2" aria-live="polite">
                  {showSearchTip && (
                    <p className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
                      Search by tutor name or subject to narrow the directory.
                    </p>
                  )}
                  {previousSearch !== undefined && previousSearch !== search && (
                    <p className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      Previous search: "{previousSearch || "empty"}"
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Student
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                    {tutee.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Ready to book
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                    Current status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                    {booking ? "Session confirmed" : "Awaiting selection"}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {booking ? "Saved in summary" : "Choose a tutor or session"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-3">{statusContent}</section>
        </div>
      </main>
    </div>
  );
}

export default App;
