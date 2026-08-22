import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  token: string | null;
  userName: string | null;
  login: (userName: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      login: (userName) =>
        set({
          token: `peer-tutoring-token-${userName.trim().toLowerCase().replace(/\s+/g, "-")}`,
          userName: userName.trim(),
        }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "peer-tutoring-auth",
      partialize: ({ token, userName }) => ({ token, userName }),
    },
  ),
);

export default useAuthStore;
