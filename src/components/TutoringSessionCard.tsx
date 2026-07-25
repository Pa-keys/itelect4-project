import type { TutoringSession } from "../types";
export interface TutoringSessionCardProps { session: TutoringSession; onBookSession: (id: TutoringSession["id"]) => void; }
export function TutoringSessionCard({session,onBookSession}:TutoringSessionCardProps) { return <article className="card"><p>Tutoring session</p><h2>{session.subject}</h2><p>{session.scheduledAt.toLocaleString()}</p><p>{session.durationMinutes} minutes</p><button onClick={() => onBookSession(session.id)}>Book this session</button></article>; }
