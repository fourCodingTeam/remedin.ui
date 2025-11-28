import { create } from "zustand";
import type { UserState } from "./@types";

export const useUserStore = create<UserState>((set) => ({
  phoneNumber: null,
  setPhoneNumber: (phoneNumber: string | null) => set({ phoneNumber }),
  userId: null,
  setUserId: (userId: string | null) => set({ userId }),
  username: null,
  setUsername: (username: string | null) => set({ username }),
  role: null,
  setRole: (role: string | null) => set({ role }),
  token: null,
  setToken: (token: string | null) => set({ token }),
  email: null,
  setEmail: (email: string | null) => set({ email }),
  birthDate: null,
  setBirthDate: (birthDate: string | null) => set({ birthDate }),
  weightKg: null,
  setWeightKg: (weightKg: number | null) => set({ weightKg }),
  heightCm: null,
  setHeightCm: (heightCm: number | null) => set({ heightCm }),
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
  isLoggingIn: false,
  setIsLoggingIn: (isLoggingIn: boolean) => set({ isLoggingIn }),
  needsRegistration: false,
  setNeedsRegistration: (needsRegistration: boolean) => set({ needsRegistration }),
  signOut: () =>
    set(() => ({
      userId: null,
      username: null,
      role: null,
      token: null,
      email: null,
      phoneNumber: null,
      birthDate: null,
      weightKg: null,
      heightCm: null,
      isLoggedIn: false,
      isLoggingIn: false,
      needsRegistration: false,
    })),
  setPersonData: (person: {
    id: string;
    name: string;
    email: string;
    username: string;
    phone: string | null;
    birthDate: string | null;
    weightKg: number | null;
    heightCm: number | null;
  }) => {
    set({
      userId: person.id,
      username: person.username,
      email: person.email,
      phoneNumber: person.phone,
      birthDate: person.birthDate,
      weightKg: person.weightKg,
      heightCm: person.heightCm,
    });
  },
}));
