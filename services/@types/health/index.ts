export interface VitalSignRecordDto {
  id: string;
  type: number; // VitalSignType enum
  value: number;
  unit: string | null;
  secondaryValue: number | null; // For blood pressure (diastolic)
  recordedAt: string; // ISO DateTime
  notes: string | null;
}

export interface SymptomRecordDto {
  id: string;
  symptoms: string;
  severity: number | null; // 1-10 scale
  recordedAt: string; // ISO DateTime
  notes: string | null;
}

export interface RegisterBloodPressureRequest {
  systolicValue: number;
  diastolicValue: number;
  recordedAt: string; // ISO DateTime
  notes?: string | null;
}

export interface RegisterBloodSugarRequest {
  value: number;
  recordedAt: string; // ISO DateTime
  unit?: string | null;
  notes?: string | null;
}

export interface RegisterWeightRequest {
  weightKg: number;
  recordedAt: string; // ISO DateTime
  notes?: string | null;
}

export interface RegisterHeightRequest {
  heightCm: number;
  recordedAt: string; // ISO DateTime
  notes?: string | null;
}

export interface RegisterSymptomRequest {
  symptoms: string;
  recordedAt: string; // ISO DateTime
  severity?: number | null;
  notes?: string | null;
}

