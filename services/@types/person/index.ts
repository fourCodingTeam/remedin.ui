export type PersonRequest = {
  token: string;
  email: string;
  name: string;
  userName: string;
  phone: string;
  birthDate: Date;
  weightKg?: number | null;
  heightCm?: number | null;
};

export type PersonResponse = {
  id: string;
  email: string;
  name: string;
  username: string;
  birthDate: string | null;
  phone: string | null;
  weightKg: number | null;
  heightCm: number | null;
  createdAt: string;
  updatedAt: string;
  supabaseUserId: string;
};
