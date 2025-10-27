import { create } from "zustand";
import { UserState } from "./@types";

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  setUserId: (userId: number | null) => set({ userId: userId }),
  username: null,
  setUsername: (username: string | null) => set({ username: username }),
  role: null,
  setRole: (role: string | null) => set({ role: role }),
  token: null,
  setToken: (token: string | null) => set({ token: token }),
  email: null,
  setEmail: (email: string | null) => set({ email: email }),
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn: isLoggedIn }),
  isLoggingIn: false,
  setIsLoggingIn: (isLoggingIn: boolean) => set({ isLoggingIn: isLoggingIn }),
}));
