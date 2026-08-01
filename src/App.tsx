import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { BookingBadge } from "./components/BookingBadge";
import { TutoringSessionCard } from "./components/TutoringSessionCard";
import { UserCard } from "./components/UserCard";
import usePrevious from "./hooks/usePrevious";
import useToggle from "./hooks/useToggle";
import { BookingStatus, type Booking, type TutoringSession, type User } from "./types";
const mockTutors: User[] = [
 { id: "tutor-1", name: "Maria Santos", email: "maria@example.com", role: "tutor", isActive: true, bio: "Patient programming tutor who loves practical examples.", subjects: ["TypeScript", "React", "JavaScript"] },
 { id: "tutor-2", name: "Alex Rivera", email: "alex@example.com", role: "tutor", isActive: true, bio: "Computer science tutor focused on clear fundamentals.", subjects: ["Python", "Data Structures", "Algorithms"] },
];
const tutee: User = { id: "tutee-1", name: "Juan dela Cruz", email: "juan@example.com", role: "tutee", isActive: true };
const mockSessions: TutoringSession[] = [
 { id: "session-1", tutorId: "tutor-1", subject: "TypeScript Fundamentals", scheduledAt: new Date("2026-08-01T10:00:00+08:00"), durationMinutes: 60 },
 { id: "session-2", tutorId: "tutor-1", subject: "React Components", scheduledAt: new Date("2026-08-02T14:00:00+08:00"), durationMinutes: 60 },
 { id: "session-3", tutorId: "tutor-2", subject: "Data Structures", scheduledAt: new Date("2026-08-03T09:00:00+08:00"), durationMinutes: 90 },
];
function App() {
 const [search, setSearch] = useState<string>(""); const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null); const [booking, setBooking] = useState<Booking | null>(null); const [note, setNote] = useState("");
 const [tutors, setTutors] = useState<User[]>([]); const [sessions, setSessions] = useState<TutoringSession[]>([]); const [isLoading, setIsLoading] = useState<boolean>(true);
 const [showSearchTip, toggleSearchTip] = useToggle(true); const previousSearch = usePrevious<string>(search); const searchInputRef = useRef<HTMLInputElement>(null);

 useEffect(() => {
  const timeoutId = window.setTimeout(() => {
   setTutors(mockTutors);
   setSessions(mockSessions);
   setIsLoading(false);
   searchInputRef.current?.focus();
  }, 300);

  return () => window.clearTimeout(timeoutId);
 }, []);
 const filteredTutors = useMemo(() => tutors.filter((tutor) => `${tutor.name} ${tutor.subjects?.join(" ")}`.toLowerCase().includes(search.toLowerCase())), [search, tutors]);
 const visibleSessions = sessions.filter((session) => !selectedTutorId || session.tutorId === selectedTutorId);
 const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => setSearch(event.target.value);
 const handleBook = (sessionId: string): void => setBooking({ id: `booking-${Date.now()}`, sessionId, tuteeId: tutee.id, status: BookingStatus.Confirmed, note, createdAt: new Date() });
 const bookedSession = booking ? sessions.find((session) => session.id === booking.sessionId) : undefined;
 return <main className="app-shell"><header><p className="eyebrow">Peer Tutoring Booking Platform</p><h1>Find the right tutor for you</h1><p>Search by tutor name or subject, view a session, and book it in one click.</p><label htmlFor="tutor-search">Search tutors<input ref={searchInputRef} id="tutor-search" value={search} onChange={handleSearch} placeholder="Try React or Maria" /></label>{showSearchTip && <p className="muted">Try searching by a tutor name or one of their subjects.</p>}<button type="button" onClick={toggleSearchTip}>{showSearchTip ? "Hide" : "Show"} search tip</button>{previousSearch !== undefined && previousSearch !== search && <p className="muted">Previous search: "{previousSearch}"</p>}</header>{isLoading ? <p>Loading tutors and sessions...</p> : <section className="layout"><div><h2>Tutors {search && `matching "${search}"`}</h2>{filteredTutors.length === 0 && <p>No tutors match your search.</p>}{filteredTutors.map((tutor) => <UserCard key={tutor.id} user={tutor} onSelectTutor={setSelectedTutorId} />)}</div><div><h2>{selectedTutorId ? "Sessions with this tutor" : "All available sessions"}</h2>{visibleSessions.map((session) => { const tutor = tutors.find((item) => item.id === session.tutorId); return tutor ? <TutoringSessionCard key={session.id} session={session} tutorName={tutor.name} isBooked={booking?.sessionId === session.id} onBookSession={handleBook} /> : null; })}</div></section>}<section className="booking-panel"><h2>Your booking</h2>{booking && bookedSession ? <><BookingBadge booking={booking}> confirmed</BookingBadge><p><strong>{bookedSession.subject}</strong> with {tutors.find((tutor) => tutor.id === bookedSession.tutorId)?.name}</p></> : <p>No session booked yet. Add an optional note, then choose a session above.</p>}<label htmlFor="booking-note">Booking note<input id="booking-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="What would you like to learn?" /></label></section></main>;
}
export default App;
