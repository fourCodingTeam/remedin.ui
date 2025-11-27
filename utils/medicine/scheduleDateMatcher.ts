import { MedicineScheduleType } from "@/services/@types/enums";
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

  // Check schedule type
  switch (schedule.scheduleType) {
    case MedicineScheduleType.OncePerDay:
    case MedicineScheduleType.MultipleFixedTimesPerDay:
      // Aplica todos os dias dentro do período do remédio
      return true;

    case MedicineScheduleType.SpecificWeekDays: {
      if (!schedule.weekDays || schedule.weekDays.length === 0) {
        return false;
      }
      // Backend uses: Monday = 1, Tuesday = 2, ..., Sunday = 7
      // JS uses: Sunday = 0, Monday = 1, ..., Saturday = 6
      const dayOfWeek = targetDate.getDay(); // JS: 0=Sunday, 1=Monday, ..., 6=Saturday
      // Convert JS day to backend format: Monday=1, Tuesday=2, ..., Sunday=7
      const backendDay = dayOfWeek === 0 ? 7 : dayOfWeek;
      return schedule.weekDays.includes(backendDay);
    }

    case MedicineScheduleType.EveryXHours: {
      // Para intervalos, verifica se a data está dentro do período
      // O cálculo exato de horários é feito pelo backend
      if (schedule.firstDoseAt) {
        const firstDose = new Date(schedule.firstDoseAt);
        const firstDoseDate = new Date(firstDose);
        firstDoseDate.setHours(0, 0, 0, 0);
        return normalizedTarget >= firstDoseDate;
      }
      return true;
    }

    case MedicineScheduleType.AsNeeded:
      // "Quando necessário" não aparece no calendário automático
      return false;

    default:
      return false;
  }
}
