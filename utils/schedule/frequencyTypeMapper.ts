import { FrequencyType, frequencyTypeLabels } from "@/services/@types/enums";

export function getFrequencyTypeOptions() {
  return Object.entries(FrequencyType)
    .filter(([, value]) => typeof value === "number")
    .map(([, value]) => ({
      label: frequencyTypeLabels[value as FrequencyType],
      value: value.toString(),
    }));
}

export function stringToFrequencyType(value: string | number): FrequencyType {
  const numValue =
    typeof value === "string" ? Number.parseInt(value, 10) : value;
  return numValue as FrequencyType;
}
