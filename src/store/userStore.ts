import { create } from "zustand";

interface User {
  name: string;
  email: string;
}

interface UserState {
  user: { name: string; email: string } | null;
  setUser: (user: { name: string; email: string }) => void;
  logout: () => void;
}

export const userStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null })
}));
