import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { createBooking, getBookings, getSessions, getTutors } from "../api/client";
import { useForm } from "react-hook-form";
import { BookingBadge } from "../components/BookingBadge";
import { TutoringSessionCard } from "../components/TutoringSessionCard";
import { UserCard } from "../components/UserCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import usePrevious from "../hooks/usePrevious";
import useToggle from "../hooks/useToggle";
import useAuthStore from "../store/authStore";
import { bookingSchema, type BookingFormValues } from "../schemas/bookingSchema";
import {
  BookingStatus,
  type Booking,
  type NewBooking,
} from "../types";
import {
  Search,
  Sparkles,
  Calendar,
  Clock,
  User,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  X,
  Filter,
  GraduationCap,
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

function DashboardPage() {
  const [search, setSearch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [showSearchTip, toggleSearchTip] = useToggle(true);
  const previousSearch = usePrevious<string>(search);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const userName = useAuthStore((state) => state.user?.name ?? null);

  const bookingForm = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: "onBlur",
    defaultValues: { sessionId: "", note: "" },
  });

  const selectedSessionId = bookingForm.watch("sessionId");
  const noteValue = bookingForm.watch("note") ?? "";

  const tutorsQuery = useQuery({ queryKey: ["tutors"], queryFn: getTutors });
  const sessionsQuery = useQuery({ queryKey: ["sessions"], queryFn: () => getSessions() });
  const bookingsQuery = useQuery({
    queryKey: ["bookings", userId],
    queryFn: getBookings,
    enabled: userId !== null,
  });

  const tutors = tutorsQuery.data ?? [];
  const sessions = sessionsQuery.data ?? [];
  const isLoading = tutorsQuery.isPending || sessionsQuery.isPending;
  const isError = tutorsQuery.isError || sessionsQuery.isError;

  const bookingMutation = useMutation({
    mutationFn: (payload: NewBooking) => createBooking(payload),
    onSuccess: () => {
      bookingForm.reset();
      void queryClient.invalidateQueries({ queryKey: ["bookings", userId], exact: true });
    },
  });

  const reloadTutorData = (): void => {
    void tutorsQuery.refetch();
    void sessionsQuery.refetch();
  };

  useEffect(() => {
    if (!isLoading && !isError) searchInputRef.current?.focus();
  }, [isError, isLoading]);

  // Unique subjects across all tutors for clickable filter pills
  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    tutors.forEach((tutor) => tutor.subjects?.forEach((subj) => set.add(subj)));
    return Array.from(set);
  }, [tutors]);

  const filteredTutors = useMemo(
    () =>
      tutors.filter((tutor) => {
        const matchesSearch = `${tutor.name} ${tutor.subjects?.join(" ")}`
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesSubject = !selectedSubject || tutor.subjects?.includes(selectedSubject);
        return matchesSearch && matchesSubject;
      }),
    [search, selectedSubject, tutors],
  );

  const visibleSessions = sessions.filter(
    (session) => !selectedTutorId || session.tutorId === selectedTutorId,
  );

  const selectedTutor = selectedTutorId
    ? tutors.find((tutor) => tutor.id === selectedTutorId)
    : undefined;

  const currentlyChosenSession = selectedSessionId
    ? sessions.find((session) => session.id === selectedSessionId)
    : undefined;

  const currentlyChosenTutor = currentlyChosenSession
    ? tutors.find((tutor) => tutor.id === currentlyChosenSession.tutorId)
    : undefined;

  const booking = useMemo(() => {
    const activeBookings = (bookingsQuery.data ?? []).filter(
      (item) => item.status !== BookingStatus.Cancelled && item.status !== BookingStatus.Completed,
    );
    const bookingsWithSessions = activeBookings
      .map((item) => ({ item, session: sessions.find((session) => session.id === item.sessionId) }))
      .filter((entry): entry is { item: Booking; session: NonNullable<typeof entry.session> } => Boolean(entry.session));
    const upcoming = bookingsWithSessions
      .filter(({ session }) => session.scheduledAt.getTime() >= Date.now())
      .sort((a, b) => a.session.scheduledAt.getTime() - b.session.scheduledAt.getTime());

    return upcoming[0]?.item ?? activeBookings.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0] ?? null;
  }, [bookingsQuery.data, sessions]);

  const bookedSession = booking
    ? sessions.find((session) => session.id === booking.sessionId)
    : undefined;
  const bookedTutor = bookedSession
    ? tutors.find((tutor) => tutor.id === bookedSession.tutorId)
    : undefined;
  const bookingStatusLabel = booking
    ? `${booking.status.charAt(0).toUpperCase()}${booking.status.slice(1)}`
    : null;
  const activeTutorCount = tutors.filter((tutor) => tutor.isActive).length;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const handleSelectSession = (sessionId: string): void => {
    bookingForm.setValue("sessionId", sessionId, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleBook = (values: BookingFormValues): void => {
    if (userId === null) {
      navigate("/login");
      return;
    }

    bookingMutation.mutate({
      sessionId: values.sessionId,
      status: BookingStatus.Confirmed,
      note: values.note.trim() || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner & High-Level Statistics */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-400/5 pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 mb-3">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Campus Peer Tutoring Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Master your coursework with vetted peer mentors.
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Find top student tutors, select upcoming session slots, and generate personalized Gemini-powered study roadmaps before every session.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="flex-1 sm:w-36 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Active Tutors
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {activeTutorCount}
              </p>
            </div>
            <div className="flex-1 sm:w-36 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Open Sessions
                </span>
              </div>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {visibleSessions.length}
              </p>
            </div>
          </div>
        </div>

        {/* Live Search & Clickable Subject Filter Chips */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
            <input
              ref={searchInputRef}
              id="tutor-search"
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search by tutor name, subject (e.g. React, Python, Algorithms)..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Subject Pills Filter */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter:</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSubject(null)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                selectedSubject === null
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-600"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              All Subjects
            </button>
            {allSubjects.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(selectedSubject === subj ? null : subj)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  selectedSubject === subj
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20 dark:bg-blue-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {subj}
              </button>
            ))}

            {showSearchTip && (
              <button
                type="button"
                onClick={toggleSearchTip}
                className="ml-auto text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline"
              >
                Dismiss tip
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main 2-Column Discovery & Sticky Checkout Architecture */}
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-4">
            <div className="h-44 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
            <div className="h-44 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
          </div>
          <div className="h-80 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 shadow-sm">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span>Unable to retrieve peer tutors</span>
          </div>
          <p className="mt-2 text-sm text-rose-800 dark:text-rose-300">
            The tutoring API did not return data. Please ensure the backend is active.
          </p>
          <button
            type="button"
            onClick={reloadTutorData}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] xl:grid-cols-[minmax(0,1.4fr)_24rem] items-start">
          {/* PRIMARY COLUMN: Tutors & Available Sessions */}
          <div className="space-y-6">
            {/* Tutors Section */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Peer Tutors Directory
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a tutor to filter their specific available slots below.
                  </p>
                </div>
                {selectedTutor && (
                  <button
                    type="button"
                    onClick={() => setSelectedTutorId(null)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Clear Filter ({selectedTutor.name})</span>
                  </button>
                )}
              </div>

              {filteredTutors.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                  No tutors found matching your search. Try clearing filters or searching for "React" or "Python".
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredTutors.map((tutor) => (
                    <UserCard
                      key={tutor.id}
                      user={tutor}
                      isSelected={selectedTutorId === tutor.id}
                      onSelectTutor={(id) => setSelectedTutorId(selectedTutorId === id ? null : id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Sessions Section */}
            <section
              role="group"
              aria-labelledby="session-selection-heading"
              className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2
                    id="session-selection-heading"
                    className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
                  >
                    {selectedTutor
                      ? `Available Slots with ${selectedTutor.name}`
                      : "Upcoming Available Sessions"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose a session to populate the checkout drawer on the right.
                  </p>
                </div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {visibleSessions.length} session{visibleSessions.length === 1 ? "" : "s"} open
                </span>
              </div>

              {visibleSessions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                  No sessions currently scheduled for this tutor. Select another tutor or view all sessions.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {visibleSessions.map((session) => {
                    const tutor = tutors.find((item) => item.id === session.tutorId);
                    return tutor ? (
                      <TutoringSessionCard
                        key={session.id}
                        session={session}
                        tutorName={tutor.name}
                        isSelected={selectedSessionId === session.id}
                        isBookingPending={bookingMutation.isPending}
                        onBookSession={handleSelectSession}
                        variant="default"
                      />
                    ) : null;
                  })}
                </div>
              )}
              {bookingForm.formState.errors.sessionId && (
                <p role="alert" className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {bookingForm.formState.errors.sessionId.message}
                </p>
              )}
            </section>
          </div>

          {/* SECONDARY COLUMN: Sticky Booking Checkout & Active Status */}
          <div className="lg:sticky lg:top-20 space-y-4">
            {/* Active Booking Card (with AI Session Prep Deep-Link) */}
            {booking && bookedSession && (
              <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-800/50 dark:bg-emerald-950/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      Active Booking
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {bookedSession.subject}
                    </h3>
                  </div>
                  <BookingBadge booking={booking} />
                </div>

                <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">Tutor:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {bookedTutor?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 dark:text-slate-500">When:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {dayFormatter.format(bookedSession.scheduledAt)} at {timeFormatter.format(bookedSession.scheduledAt)}
                    </span>
                  </div>
                  {booking.note && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Note:</span>
                      <p className="italic text-slate-700 dark:text-slate-300 text-[11px] mt-0.5">
                        "{booking.note}"
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Prep Call to Action */}
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/session-prep?subject=${encodeURIComponent(
                        bookedSession.subject,
                      )}&tutor=${encodeURIComponent(
                        bookedTutor?.name ?? "",
                      )}&note=${encodeURIComponent(booking.note ?? "")}`,
                    )
                  }
                  className="mt-3.5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-2.5 px-3 text-xs font-bold text-white shadow-sm shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Prepare with Gemini AI</span>
                </button>
              </section>
            )}

            {/* Session Checkout Widget */}
            <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Session Checkout
                </h3>
                {currentlyChosenSession && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    Slot Ready
                  </span>
                )}
              </div>

              {currentlyChosenSession ? (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-950 dark:bg-blue-950/30">
                    <p className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
                      Selected Topic
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {currentlyChosenSession.subject}
                    </p>
                    <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                      <p>
                        Mentor: <span className="font-semibold text-slate-900 dark:text-white">{currentlyChosenTutor?.name}</span>
                      </p>
                      <p>
                        Schedule: <span className="font-semibold text-slate-900 dark:text-white">{dayFormatter.format(currentlyChosenSession.scheduledAt)} at {timeFormatter.format(currentlyChosenSession.scheduledAt)}</span>
                      </p>
                      <p>
                        Duration: <span className="font-semibold text-slate-900 dark:text-white">{currentlyChosenSession.durationMinutes} mins</span>
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                  No session chosen yet. Click <span className="font-semibold text-slate-700 dark:text-slate-300">"Select this Session"</span> on any slot to begin.
                </div>
              )}

              {/* Booking Form (Learning Note + Confirm Action) */}
              <form onSubmit={bookingForm.handleSubmit(handleBook)} className="mt-4 space-y-3" noValidate>
                <input type="hidden" {...bookingForm.register("sessionId")} />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label htmlFor="booking-note" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Learning Note (Optional)
                    </Label>
                    <span className="text-[10px] text-slate-400">
                      {noteValue.length}/160
                    </span>
                  </div>
                  <Input
                    id="booking-note"
                    {...bookingForm.register("note")}
                    placeholder="E.g., I'm stuck on React useEffect dependency arrays..."
                    className="rounded-xl border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                  {bookingForm.formState.errors.note ? (
                    <p role="alert" className="mt-1 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                      {bookingForm.formState.errors.note.message}
                    </p>
                  ) : (
                    <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                      If adding a note, write at least 10 characters.
                    </p>
                  )}
                </div>

                {bookingMutation.isError && (
                  <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                    Could not confirm session. Please check connection and try again.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={bookingMutation.isPending || !selectedSessionId}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50"
                >
                  {bookingMutation.isPending ? (
                    "Confirming Booking..."
                  ) : userId === null ? (
                    "Log In to Confirm Booking"
                  ) : (
                    <>
                      <span>Confirm Session Booking</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </section>

            {/* Quick Controls Card */}
            <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 flex items-center justify-between">
              <span>Directory synced with backend</span>
              <button
                type="button"
                onClick={reloadTutorData}
                title="Refresh tutor and session data"
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 font-semibold"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
