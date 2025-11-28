import type { PersonResponse } from "@/services/@types/person";

export type MemberData = PersonResponse & {
  phoneNumber?: string;
  avatar?: string;
};

export type MemberState = {
  member: {
    id: string;
    name: string;
    phoneNumber: string;
    avatar: string;
  };
  setMember: (member: {
    id: string;
    name: string;
    phoneNumber: string;
    avatar: string;
  }) => void;
  members: MemberData[];
  setMembers: (members: MemberData[]) => void;
  getMemberById: (id: string) => MemberData | undefined;
  weight: number;
  height: number;
  bloodPressure: string;
  bloodSugar: number;
  amountOfMedicine: number;
  setWeight: (weight: number) => void;
  setHeight: (height: number) => void;
  setBloodPressure: (bloodPressure: string) => void;
  setBloodSugar: (bloodSugar: number) => void;
  setAmountOfMedicine: (amountOfMedicine: number) => void;
};
