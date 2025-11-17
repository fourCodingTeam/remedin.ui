import type { FrequencyType, WeekDay } from "../enums";

export type ScheduleDtoResponse = {
  id: string;
  medicineId: string;
  scheduledTime: string; // TimeOnly format: HH:mm:ss
  frequencyType: FrequencyType;
  preAlarmMinutes: number;
  posAlarmMinutes: number;
  weekDays: WeekDay[];
};

export type CreateScheduleRequest = {
  medicineId: string;
  scheduledTime: string; // TimeOnly format: HH:mm:ss
  frequencyType: FrequencyType;
  preAlarmMinutes: number;
  posAlarmMinutes: number;
  weekDays: WeekDay[] | null;
};

export type UpdateScheduleRequest = {
  id: string;
  medicineId: string;
  scheduledTime: string; // TimeOnly format: HH:mm:ss
  frequencyType: FrequencyType;
  preAlarmMinutes: number;
  posAlarmMinutes: number;
  weekDays: WeekDay[] | null;
};

