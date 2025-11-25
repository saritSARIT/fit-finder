import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Trainer {
  id: string;
  name: string;
  email: string;
}

interface TrainerState {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
  logout: () => void;
}

export const trainerStore = create<TrainerState>()(
  persist(
    (set) => ({
      trainer: null,
      setTrainer: (trainer) => set({ trainer }),
      logout: () => set({ trainer: null })
    }),
    {
      name: "trainer-storage", // שם ה-key ב-localStorage
    }
  )
);