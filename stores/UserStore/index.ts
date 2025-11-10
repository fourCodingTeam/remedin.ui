import { create } from "zustand";
import type { UserState } from "./@types";

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (userId: number | null) => set({ userId }),
  username: null,
  setUsername: (username: string | null) => set({ username }),
  role: null,
  setRole: (role: string | null) => set({ role }),
  token: null,
  setToken: (token: string | null) => set({ token }),
  email: null,
  setEmail: (email: string | null) => set({ email }),
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  isLoggingIn: false,
  setIsLoggingIn: (isLoggingIn: boolean) => set({ isLoggingIn }),
  signOut: () =>
    set(() => ({
      userId: null,
      username: null,
      role: null,
      token: null,
      email: null,
      isLoggedIn: false,
      isLoggingIn: false,
    })),
}));
