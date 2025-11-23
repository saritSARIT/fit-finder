import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const userStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null })
}));