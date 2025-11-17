import { WeekDay, weekDayLabels } from "@/services/@types/enums";

export function getWeekDayOptions() {
  return Object.entries(WeekDay)
    .filter(([, value]) => typeof value === "number")
    .map(([, value]) => ({
      label: weekDayLabels[value as WeekDay],
      value: value.toString(),
    }));
}

export function stringToWeekDay(value: string | number): WeekDay {
  const numValue =
    typeof value === "string" ? Number.parseInt(value, 10) : value;
  return numValue as WeekDay;
}
