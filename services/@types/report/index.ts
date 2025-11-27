export type ReportType = "medicines" | "vitalSigns" | "complete";

export type GenerateReportRequest = {
  reportTypes: ReportType[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
};

export type MedicineReportItem = {
  id: string;
  name: string;
  dosageValue: number;
  dosageUnit: string;
  startDate: string;
  endDate?: string;
  observations?: string;
  schedules: ScheduleReportItem[];
};

export type ScheduleReportItem = {
  scheduledTime: string;
  frequencyType: string;
  weekDays: string[];
};

export type VitalSignsReportData = {
  weightKg?: number;
  heightCm?: number;
  bloodPressure?: string;
  bloodSugar?: number;
  lastUpdated?: string;
};

export type MedicinesReportData = {
  medicines: MedicineReportItem[];
  totalMedicines: number;
  activeMedicines: number;
  adherenceRate: number;
};

export type CompleteReportData = {
  medicines: MedicinesReportData;
  vitalSigns: VitalSignsReportData;
  overallAdherenceRate: number;
};

export type ReportDtoResponse = {
  type: ReportType;
  startDate: string;
  endDate: string;
  medicinesData?: MedicinesReportData;
  vitalSignsData?: VitalSignsReportData;
  completeData?: CompleteReportData;
};
