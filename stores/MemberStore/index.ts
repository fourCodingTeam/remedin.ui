import { create } from "zustand";
import type { MemberState } from "./@types";

export const useMemberStore = create<MemberState>((set) => ({
  member: {
    id: 0,
    name: "",
    phoneNumber: "",
    avatar: "",
  },
  setMember: (member: MemberState["member"]) => set({ member }),
  weight: 0,
  setWeight: (weight: number) => set({ weight }),
  height: 0,
  setHeight: (height: number) => set({ height }),
  bloodPressure: "",
  setBloodPressure: (bloodPressure: string) => set({ bloodPressure }),
  bloodSugar: 0,
  setBloodSugar: (bloodSugar: number) => set({ bloodSugar }),
  amountOfMedicine: 0,
  setAmountOfMedicine: (amountOfMedicine: number) => set({ amountOfMedicine }),
}));
