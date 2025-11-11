export type PersonRequest = {
  token: string;
  email: string;
  name: string;
  userName: string;
  phone: string;
  birthDate: string;
  weightKg?: string | null;
  heightCm?: string | null;
};
