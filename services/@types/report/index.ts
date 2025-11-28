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

export type VitalSignRecordItem = {
  id: string;
  type: number; // VitalSignType enum
  value: number;
  unit: string | null;
  secondaryValue: number | null; // For blood pressure (diastolic)
  recordedAt: string; // ISO DateTime
  notes: string | null;
};

export type SymptomRecordItem = {
  id: string;
  symptoms: string;
  severity: number | null; // 1-10 scale
  recordedAt: string; // ISO DateTime
  notes: string | null;
};

export type VitalSignsReportData = {
  weightKg?: number;
  heightCm?: number;
  bloodPressure?: string; // Última pressão (mantido para compatibilidade)
  bloodSugar?: number; // Última glicose (mantido para compatibilidade)
  lastUpdated?: string;
  // Histórico de registros
  bloodPressureRecords?: VitalSignRecordItem[];
  bloodSugarRecords?: VitalSignRecordItem[];
  weightRecords?: VitalSignRecordItem[];
  heightRecords?: VitalSignRecordItem[];
};

export type SymptomsReportData = {
  symptoms: SymptomRecordItem[];
  totalSymptoms: number;
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
  symptoms?: SymptomsReportData;
  overallAdherenceRate: number;
};

export type ReportDtoResponse = {
  type: ReportType;
  startDate: string;
  endDate: string;
  medicinesData?: MedicinesReportData;
  vitalSignsData?: VitalSignsReportData;
  symptomsData?: SymptomsReportData;
  completeData?: CompleteReportData;
};
