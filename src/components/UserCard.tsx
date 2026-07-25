import type { User } from "../types";
export interface UserCardProps { user: User; onSelectTutor: (id: User["id"]) => void; }
export function UserCard({user,onSelectTutor}:UserCardProps) { return <article className="card"><p>{user.role}</p><h2>{user.name}</h2><p>{user.email}</p>{user.role === "tutor" && <button onClick={() => onSelectTutor(user.id)}>Select tutor</button>}</article>; }
