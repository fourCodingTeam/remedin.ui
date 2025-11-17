import type { DosageUnit } from "../enums";

export type MedicineDtoResponse = {
  id: string;
  name: string;
  dosageValue: number;
  dosageUnit: DosageUnit;
  startDate: string; // DateOnly format: YYYY-MM-DD
  endDate: string | null; // DateOnly format: YYYY-MM-DD
  observations: string | null;
};

export type CreateMedicineRequest = {
  name: string;
  dosageValue: number;
  dosageUnit: DosageUnit;
  startDate: string; // DateOnly format: YYYY-MM-DD
  endDate: string | null; // DateOnly format: YYYY-MM-DD
  observations: string | null;
};

export type UpdateMedicineRequest = {
  id: string;
  name: string;
  dosageValue: number;
  dosageUnit: DosageUnit;
  startDate: string; // DateOnly format: YYYY-MM-DD
  endDate: string | null; // DateOnly format: YYYY-MM-DD
  observations: string | null;
};

