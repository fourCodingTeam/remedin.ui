import type {
  DosageUnit,
  FrequencyType,
  MedicineScheduleType,
  WeekDay,
} from "@/services/@types/enums";
import {
  DosageUnit as DosageUnitEnum,
  FrequencyType as FrequencyTypeEnum,
  MedicineScheduleType as MedicineScheduleTypeEnum,
  WeekDay as WeekDayEnum,
} from "@/services/@types/enums";

/**
 * Converte string de enum do backend para número do enum do frontend
 * O backend retorna strings como "Mg", "Ml", etc devido ao JsonStringEnumConverter
 */
export function convertDosageUnitFromBackend(
  value: string | number | DosageUnit
): DosageUnit {
  // Se já é um número, retorna direto
  if (typeof value === "number") {
    return value as DosageUnit;
  }

  // Se é string, converte para número baseado no enum do backend
  const stringToNumber: Record<string, DosageUnit> = {
    Mg: DosageUnitEnum.Mg,
    Ml: DosageUnitEnum.Ml,
    G: DosageUnitEnum.G,
    Mcg: DosageUnitEnum.Mcg,
    Gota: DosageUnitEnum.Gota,
    Comprimido: DosageUnitEnum.Comprimido,
    Capsula: DosageUnitEnum.Capsula,
    Unidade: DosageUnitEnum.Unidade,
  };

  return stringToNumber[value] ?? DosageUnitEnum.Mg;
}

export function convertFrequencyTypeFromBackend(
  value: string | number | FrequencyType
): FrequencyType {
  if (typeof value === "number") {
    return value as FrequencyType;
  }

  const stringToNumber: Record<string, FrequencyType> = {
    Daily: FrequencyTypeEnum.Daily,
    Weekly: FrequencyTypeEnum.Weekly,
    Monthly: FrequencyTypeEnum.Monthly,
  };

  return stringToNumber[value] ?? FrequencyTypeEnum.Daily;
}

export function convertWeekDayFromBackend(
  value: string | number | WeekDay
): WeekDay {
  if (typeof value === "number") {
    return value as WeekDay;
  }

  const stringToNumber: Record<string, WeekDay> = {
    Monday: WeekDayEnum.Monday,
    Tuesday: WeekDayEnum.Tuesday,
    Wednesday: WeekDayEnum.Wednesday,
    Thursday: WeekDayEnum.Thursday,
    Friday: WeekDayEnum.Friday,
    Saturday: WeekDayEnum.Saturday,
    Sunday: WeekDayEnum.Sunday,
  };

  return stringToNumber[value] ?? WeekDayEnum.Monday;
}

export function convertMedicineScheduleTypeFromBackend(
  value: string | number | MedicineScheduleType
): MedicineScheduleType {
  if (typeof value === "number") {
    return value as MedicineScheduleType;
  }

  const stringToNumber: Record<string, MedicineScheduleType> = {
    OncePerDay: MedicineScheduleTypeEnum.OncePerDay,
    MultipleFixedTimesPerDay: MedicineScheduleTypeEnum.MultipleFixedTimesPerDay,
    EveryXHours: MedicineScheduleTypeEnum.EveryXHours,
    SpecificWeekDays: MedicineScheduleTypeEnum.SpecificWeekDays,
    AsNeeded: MedicineScheduleTypeEnum.AsNeeded,
  };

  return stringToNumber[value] ?? MedicineScheduleTypeEnum.OncePerDay;
}
