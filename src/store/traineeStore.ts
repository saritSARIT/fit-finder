import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Trainee {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface TraineeState {
  trainee: Trainee | null;
  setTrainee: (trainee: Trainee) => void;
  logout: () => void;
}

export const traineeStore = create<TraineeState>()(
  persist(
    (set) => ({
      trainee: null,
      setTrainee: (trainee) => set({ trainee }),
      logout: () => set({ trainee: null })
    }),
    {
      name: "trainee-storage", 
    }
  )
);