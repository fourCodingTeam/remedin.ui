import { FrequencyType, type WeekDay } from "@/services/@types/enums";
import type { MedicineDtoResponse } from "@/services/@types/medicine";
import type { ScheduleDtoResponse } from "@/services/@types/schedule";
import { dateOnlyToDate } from "@/utils/DateFormatters/dateOnly";

export function scheduleAppliesToDate(
  schedule: ScheduleDtoResponse,
  medicine: MedicineDtoResponse,
  targetDate: Date
): boolean {
  const startDate = dateOnlyToDate(medicine.startDate);
  const endDate = dateOnlyToDate(medicine.endDate);

  if (!startDate) {
    return false;
  }

  // Normalize dates for comparison (set to midnight)
  const normalizedTarget = new Date(targetDate);
  normalizedTarget.setHours(0, 0, 0, 0);
  const normalizedStart = new Date(startDate);
  normalizedStart.setHours(0, 0, 0, 0);

  // Check if date is within medicine's date range
  if (normalizedTarget < normalizedStart) {
    return false;
  }
  if (endDate) {
    const normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(0, 0, 0, 0);
    if (normalizedTarget > normalizedEnd) {
      return false;
    }
  }

  // Check frequency type
  if (schedule.frequencyType === FrequencyType.Daily) {
    return true;
  }

  if (schedule.frequencyType === FrequencyType.Weekly) {
    if (!schedule.weekDays || schedule.weekDays.length === 0) {
      return false;
    }
    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Backend uses: Monday = 1, Tuesday = 2, ..., Sunday = 7
    const dayOfWeek = targetDate.getDay(); // JS: 0=Sunday, 1=Monday, ..., 6=Saturday
    // Convert JS day to backend format: Monday=1, Tuesday=2, ..., Sunday=7
    const backendDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    return schedule.weekDays.includes(backendDay as WeekDay);
  }

  if (schedule.frequencyType === FrequencyType.Monthly) {
    // Monthly: apply on the same day of month
    const startDay = startDate.getDate();
    return targetDate.getDate() === startDay;
  }

  return false;
}
