import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getBookings, getSessions, getTutors } from "../api/client";
import { BookingBadge } from "../components/BookingBadge";
import useAuthStore from "../store/authStore";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Inbox,
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

function BookingsPage() {
  const userName = useAuthStore((state) => state.user?.name ?? null);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const navigate = useNavigate();

  const {
    data: bookings = [],
    isPending: isBookingsPending,
    isError: isBookingsError,
    refetch,
  } = useQuery({
    queryKey: ["bookings", userId],
    queryFn: getBookings,
    enabled: userId !== null,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => getSessions(),
  });

  const { data: tutors = [] } = useQuery({
    queryKey: ["tutors"],
    queryFn: getTutors,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300 mb-2">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Student Reservations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {userName ? `${userName}'s Study Sessions` : "My Booked Sessions"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Manage your confirmed peer tutoring appointments and prepare with Gemini AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <span>Book New Session</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bookings List */}
      {isBookingsPending ? (
        <div className="space-y-4">
          <div className="h-36 rounded-2xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
          <div className="h-36 rounded-2xl border border-slate-200 bg-white p-6 animate-pulse dark:border-slate-800 dark:bg-slate-900" />
        </div>
      ) : isBookingsError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-200 shadow-sm">
          <h2 className="text-base font-bold">Could not load your bookings.</h2>
          <p className="mt-1 text-xs text-rose-800 dark:text-rose-300">
            Check that the tutoring API backend is online, then try again.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
            <Inbox className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">
            No session bookings yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            You don't have any tutoring sessions scheduled. Browse peer tutors and choose an upcoming slot to get started.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <span>Explore Peer Tutors</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const session = sessions.find((s) => s.id === booking.sessionId);
            const tutor = session ? tutors.find((t) => t.id === session.tutorId) : undefined;

            return (
              <article
                key={booking.id}
                className="group rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                        {session ? session.subject : `Session #${booking.sessionId}`}
                      </h2>
                      <BookingBadge booking={booking} />
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                      {tutor && (
                        <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                          <User className="h-3.5 w-3.5 text-blue-500" />
                          <span>Mentor: {tutor.name}</span>
                        </span>
                      )}
                      {session && (
                        <>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                            <span>{dayFormatter.format(session.scheduledAt)}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-indigo-500" />
                            <span>{timeFormatter.format(session.scheduledAt)} ({session.durationMinutes} mins)</span>
                          </span>
                        </>
                      )}
                    </div>

                    {booking.note && (
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 mr-1">
                          Student Note:
                        </span>
                        <span>"{booking.note}"</span>
                      </div>
                    )}
                  </div>

                  {/* AI Prep Action */}
                  <div className="sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/session-prep?subject=${encodeURIComponent(
                            session?.subject ?? "Tutoring Session",
                          )}&tutor=${encodeURIComponent(
                            tutor?.name ?? "",
                          )}&note=${encodeURIComponent(booking.note ?? "")}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-purple-600/20 hover:from-purple-700 hover:to-indigo-700 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Prepare with AI</span>
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Booking Reference: {booking.id}</span>
                  <span>Booked on {booking.createdAt.toLocaleDateString("en-PH")}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
