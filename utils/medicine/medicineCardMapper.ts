import { dosageUnitLabels } from "@/services/@types/enums";
import type { MedicineDtoResponse } from "@/services/@types/medicine";
import type { ScheduleDtoResponse } from "@/services/@types/schedule";
import { formatDateOnlyToDisplay } from "@/utils/DateFormatters/dateOnly";
import { formatTimeOnlyToDisplay } from "@/utils/DateFormatters/timeOnly";
import { getDateKey } from "@/utils/date/dateKey";
import { scheduleAppliesToDate } from "./scheduleDateMatcher";

export type MedicineCardData = {
  id: string;
  date: string;
  card: {
    value: string;
    title: string;
    scheduleLabel: string;
    statusLabel?: string;
    extraLines?: string[];
    tone?: "primary" | "secondary" | "danger" | "neutral";
    isForgotten?: boolean;
    isCompleted?: boolean;
    checked?: boolean;
    disabled?: boolean;
  };
};

type MedicineWithSchedules = MedicineDtoResponse & {
  schedules: ScheduleDtoResponse[];
};

function createMedicineTitle(medicine: MedicineDtoResponse): string {
  const dosageLabel = dosageUnitLabels[medicine.dosageUnit];
  const dosageDisplay = `${medicine.dosageValue} ${dosageLabel}`;
  return `${medicine.name} - ${dosageDisplay}`;
}

function createScheduleLabel(
  schedule: ScheduleDtoResponse,
  dateKey: string
): string {
  const timeDisplay = formatTimeOnlyToDisplay(schedule.scheduledTime);
  const today = new Date();
  const todayKey = getDateKey(today);
  const isToday = dateKey === todayKey;

  if (isToday) {
    return `${timeDisplay} - Hoje às ${timeDisplay}`;
  }
  return `${timeDisplay} - ${formatDateOnlyToDisplay(dateKey)}`;
}

function createCardData(
  medicine: MedicineDtoResponse,
  schedule: ScheduleDtoResponse,
  dateKey: string,
  title: string
): MedicineCardData {
  const scheduleLabel = createScheduleLabel(schedule, dateKey);

  return {
    id: `${medicine.id}-${schedule.id}-${dateKey}`,
    date: dateKey,
    card: {
      value: `${medicine.id}-${schedule.id}`,
      title,
      scheduleLabel,
      extraLines: medicine.observations ? [medicine.observations] : undefined,
    },
  };
}

function processMedicineSchedules(
  medicine: MedicineWithSchedules,
  targetDate: Date,
  dateKey: string,
  title: string
): MedicineCardData[] {
  const result: MedicineCardData[] = [];

  for (const schedule of medicine.schedules) {
    if (scheduleAppliesToDate(schedule, medicine, targetDate)) {
      const cardData = createCardData(medicine, schedule, dateKey, title);
      result.push(cardData);
    }
  }

  return result;
}

function sortCardsByTime(cards: MedicineCardData[]): MedicineCardData[] {
  return [...cards].sort((a, b) => {
    const timeA = a.card.scheduleLabel.split(" - ")[0];
    const timeB = b.card.scheduleLabel.split(" - ")[0];
    return timeA.localeCompare(timeB);
  });
}

/**
 * Maps medicines with schedules to card data format for a specific date
 */
export function mapMedicinesToCardsForDate(
  medicines: MedicineWithSchedules[],
  targetDate: Date,
  dateKey: string
): MedicineCardData[] {
  const result: MedicineCardData[] = [];

  for (const medicine of medicines) {
    if (medicine.schedules.length === 0) {
      continue;
    }

    const title = createMedicineTitle(medicine);
    const cards = processMedicineSchedules(
      medicine,
      targetDate,
      dateKey,
      title
    );
    result.push(...cards);
  }

  return sortCardsByTime(result);
}
