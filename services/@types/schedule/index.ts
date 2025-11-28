import type { MedicineScheduleType } from "../enums";
import type { DoseOccurrenceDto } from "@/services/api/medicineAdherence";

export type ScheduleDtoResponse = {
  id: string;
  medicineId: string;
  scheduleType: MedicineScheduleType;
  timeOfDay: string | null; // TimeOnly format: HH:mm:ss
  timesOfDay: string[] | null; // Array of TimeOnly format: HH:mm:ss
  intervalInHours: number | null;
  firstDoseAt: string | null; // ISO 8601 with timezone: "2025-11-16T19:00:00Z"
  weekDays: number[] | null; // 1 = Monday ... 7 = Sunday
  preAlarmMinutes: number | null;
  posAlarmMinutes: number | null;
  doseOccurrences?: DoseOccurrenceDto[] | null; // Included when date parameter is provided
};

export type CreateScheduleRequest = {
  medicineId: string;
  scheduleType: MedicineScheduleType;
  timeOfDay?: string | null; // TimeOnly format: HH:mm:ss
  timesOfDay?: string[] | null; // Array of TimeOnly format: HH:mm:ss
  intervalInHours?: number | null;
  firstDoseAt?: string | null; // ISO 8601 with timezone: "2025-11-16T19:00:00Z"
  weekDays?: number[] | null; // 1 = Monday ... 7 = Sunday
  preAlarmMinutes?: number | null;
  posAlarmMinutes?: number | null;
};

export type UpdateScheduleRequest = {
  id: string;
  medicineId: string;
  scheduleType: MedicineScheduleType;
  timeOfDay?: string | null;
  timesOfDay?: string[] | null;
  intervalInHours?: number | null;
  firstDoseAt?: string | null;
  weekDays?: number[] | null;
  preAlarmMinutes?: number | null;
  posAlarmMinutes?: number | null;
};
