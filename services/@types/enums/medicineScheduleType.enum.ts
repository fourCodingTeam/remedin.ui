export const MedicineScheduleType = {
  OncePerDay: 1,
  MultipleFixedTimesPerDay: 2,
  EveryXHours: 3,
  SpecificWeekDays: 4,
  AsNeeded: 5,
} as const;

export type MedicineScheduleType =
  (typeof MedicineScheduleType)[keyof typeof MedicineScheduleType];

export const medicineScheduleTypeLabels: Record<MedicineScheduleType, string> =
  {
    [MedicineScheduleType.OncePerDay]: "1x por dia",
    [MedicineScheduleType.MultipleFixedTimesPerDay]: "Várias vezes ao dia",
    [MedicineScheduleType.EveryXHours]: "A cada X horas",
    [MedicineScheduleType.SpecificWeekDays]: "Dias específicos da semana",
    [MedicineScheduleType.AsNeeded]: "Quando necessário",
  };
