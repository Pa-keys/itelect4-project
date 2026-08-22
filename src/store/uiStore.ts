import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "peer-tutoring-ui",
      partialize: ({ isDarkMode }) => ({ isDarkMode }),
    },
  ),
);

export default useUiStore;
