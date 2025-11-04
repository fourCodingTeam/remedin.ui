import type { User } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthUser = User;

type AuthState = {
  user: AuthUser | null;
  isLoadingAuth: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsLoadingAuth: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoadingAuth: true,
  setUser: (user) => set({ user }),
  setIsLoadingAuth: (loading) => set({ isLoadingAuth: loading }),
}));
