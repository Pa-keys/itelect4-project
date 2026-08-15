import { create } from "zustand";

export interface AuthState {
  token: string | null;
  userName: string | null;
  login: (userName: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userName: null,
  login: (userName) =>
    set({
      token: `peer-tutoring-token-${userName.trim().toLowerCase().replace(/\s+/g, "-")}`,
      userName: userName.trim(),
    }),
  logout: () => set({ token: null, userName: null }),
}));

export default useAuthStore;
