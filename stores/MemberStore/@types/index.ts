export type MemberState = {
  member: {
    id: number;
    name: string;
    phoneNumber: string;
    avatar: string;
  };
  setMember: (member: {
    id: number;
    name: string;
    phoneNumber: string;
    avatar: string;
  }) => void;
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
