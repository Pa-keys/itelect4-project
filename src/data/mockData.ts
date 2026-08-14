import type { TutoringSession, User } from "../types";

export const mockTutors: User[] = [
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

export const tutee: User = {
  id: "tutee-1",
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "tutee",
  isActive: true,
};

export const mockSessions: TutoringSession[] = [
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
