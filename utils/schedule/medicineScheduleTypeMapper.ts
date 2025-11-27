import {
  MedicineScheduleType,
  medicineScheduleTypeLabels,
} from "@/services/@types/enums";

export function getMedicineScheduleTypeOptions() {
  return Object.entries(MedicineScheduleType)
    .filter(([, value]) => typeof value === "number")
    .map(([, value]) => ({
      label: medicineScheduleTypeLabels[value as MedicineScheduleType],
      value: value.toString(),
    }));
}
