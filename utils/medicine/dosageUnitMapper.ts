import { DosageUnit, dosageUnitLabels } from "@/services/@types/enums";

/**
 * Maps DosageUnit enum to the format expected by InputSelect
 */
export function getDosageUnitOptions() {
  return Object.entries(DosageUnit)
    .filter(([, value]) => typeof value === "number") // Filter out numeric values (keep enum entries)
    .map(([, value]) => ({
      label: dosageUnitLabels[value as DosageUnit],
      value: value.toString(),
    }));
}

/**
 * Converts DosageUnit enum value to string for form inputs
 */
export function dosageUnitToString(unit: DosageUnit): string {
  return unit.toString();
}

/**
 * Converts string to DosageUnit enum
 */
export function stringToDosageUnit(value: string | number): DosageUnit {
  const numValue =
    typeof value === "string" ? Number.parseInt(value, 10) : value;
  return numValue as DosageUnit;
}
