import type { User } from "../types";

export interface UserCardProps {
  user: User;
  onSelectTutor: (id: User["id"]) => void;
}

export function UserCard({ user, onSelectTutor }: UserCardProps) {
  return (
    <article
      className="card tutor-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelectTutor(user.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelectTutor(user.id);
      }}
    >
      <p className="eyebrow">Tutor</p>
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <p className="subjects">{user.subjects?.join(" · ")}</p>
      <p className="muted">Select this tutor to view sessions</p>
    </article>
  );
}
