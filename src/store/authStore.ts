import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthenticatedUser } from "../types";

export interface AuthState {
  token: string | null;
  user: AuthenticatedUser | null;
  setSession: (token: string, user: AuthenticatedUser) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "peer-tutoring-auth",
      version: 2,
      partialize: ({ token, user }) => ({ token, user }),
    },
  ),
);

export default useAuthStore;
