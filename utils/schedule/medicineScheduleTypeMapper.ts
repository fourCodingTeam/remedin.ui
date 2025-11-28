import {
  MedicineScheduleType,
  medicineScheduleTypeLabels,
} from "@/services/@types/enums";

export function getMedicineScheduleTypeOptions() {
  return Object.entries(MedicineScheduleType)
    .filter(([, value]) => typeof value === "number")
    .filter(([, value]) => {
      // Remove "Quando necessário" (AsNeeded) e "Várias vezes ao dia" (MultipleFixedTimesPerDay)
      return (
        value !== MedicineScheduleType.AsNeeded &&
        value !== MedicineScheduleType.MultipleFixedTimesPerDay
      );
    })
    .map(([, value]) => ({
      label: medicineScheduleTypeLabels[value as MedicineScheduleType],
      value: value.toString(),
    }));
}
