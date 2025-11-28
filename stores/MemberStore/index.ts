import { create } from "zustand";
import type { MemberState, MemberData } from "./@types";

export const useMemberStore = create<MemberState>((set, get) => ({
  member: {
    id: "",
    name: "",
    phoneNumber: "",
    avatar: "",
  },
  setMember: (member: MemberState["member"]) => set({ member }),
  members: [],
  setMembers: (members: MemberData[]) => set({ members }),
  getMemberById: (id: string) => {
    const { members } = get();
    return members.find((m) => m.id === id);
  },
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
