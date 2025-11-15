export type PersonRequest = {
  token: string;
  email: string;
  name: string;
  userName: string;
  phone: string;
  birthDate: Date;
  weightKg?: string | null;
  heightCm?: string | null;
};
