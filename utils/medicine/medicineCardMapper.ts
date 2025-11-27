import { dosageUnitLabels } from "@/services/@types/enums";
import type { DoseOccurrenceDto } from "@/services/api/medicineAdherence";
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
  const today = new Date();
  const todayKey = getDateKey(today);
  const isToday = dateKey === todayKey;

  // Determinar o horário baseado no tipo de schedule
  let timeDisplay = "";

  if (schedule.timeOfDay) {
    timeDisplay = formatTimeOnlyToDisplay(schedule.timeOfDay);
  } else if (schedule.timesOfDay && schedule.timesOfDay.length > 0) {
    // Para múltiplos horários, mostra o primeiro
    timeDisplay = formatTimeOnlyToDisplay(schedule.timesOfDay[0]);
  } else if (schedule.firstDoseAt) {
    const firstDose = new Date(schedule.firstDoseAt);
    timeDisplay = `${firstDose.getHours().toString().padStart(2, "0")}:${firstDose.getMinutes().toString().padStart(2, "0")}`;
  }

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
  
  // Use "|" as separator instead of "-" to avoid conflicts with GUID format
  const separator = "|";

  return {
    id: `${medicine.id}-${schedule.id}-${dateKey}`,
    date: dateKey,
    card: {
      value: `${medicine.id}${separator}${schedule.id}`,
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
      // Para MultipleFixedTimesPerDay, criar um card para cada horário
      if (
        schedule.scheduleType === 2 && // MultipleFixedTimesPerDay
        schedule.timesOfDay &&
        schedule.timesOfDay.length > 0
      ) {
        for (const timeOfDay of schedule.timesOfDay) {
          const scheduleWithSingleTime = {
            ...schedule,
            timeOfDay,
          };
          const cardData = createCardData(
            medicine,
            scheduleWithSingleTime,
            dateKey,
            title
          );
          result.push(cardData);
        }
      } else {
        const cardData = createCardData(medicine, schedule, dateKey, title);
        result.push(cardData);
      }
    }
  }

  return result;
}

function sortCardsByTime(cards: MedicineCardData[]): MedicineCardData[] {
  return [...cards].sort((a, b) => {
    // Safely extract time from scheduleLabel
    const scheduleLabelA = a?.card?.scheduleLabel || "";
    const scheduleLabelB = b?.card?.scheduleLabel || "";
    
    const timeA = typeof scheduleLabelA === "string" 
      ? scheduleLabelA.split(" - ")[0] || ""
      : "";
    const timeB = typeof scheduleLabelB === "string"
      ? scheduleLabelB.split(" - ")[0] || ""
      : "";
    
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

/**
 * Enriches cards with dose occurrence status
 * Maps status: Taken → checked=true, isCompleted=true; Skipped → isForgotten=true
 */
export function enrichCardsWithDoseStatus(
  cards: MedicineCardData[],
  doseOccurrences: DoseOccurrenceDto[]
): MedicineCardData[] {
  // Create a map for quick lookup: key = `${medicineId}|${scheduleId}|${dateKey}`
  const occurrenceMap = new Map<string, DoseOccurrenceDto>();

  for (const occurrence of doseOccurrences) {
    const scheduledDate = new Date(occurrence.scheduledAt);
    const dateKey = getDateKey(scheduledDate);
    const key = `${occurrence.medicineId}|${occurrence.scheduleId}|${dateKey}`;
    occurrenceMap.set(key, occurrence);
  }

  return cards.map((card, index) => {
    // Validate card structure
    if (!card || !card.card || !card.date) {
      console.warn(`[enrichCardsWithDoseStatus] Invalid card structure at index ${index}:`, card);
      return card;
    }

    // Extract medicineId and scheduleId from card.value (format: "medicineId|scheduleId")
    const cardValue = card.card.value;
    
    // Ensure cardValue is a string before splitting
    if (!cardValue || typeof cardValue !== "string") {
      console.warn(`[enrichCardsWithDoseStatus] Missing or invalid card.value at index ${index}:`, {
        cardValue,
        cardStructure: card.card,
      });
      return card;
    }
    
    const separator = "|";
    let parts: string[];
    
    try {
      parts = cardValue.split(separator);
    } catch (error) {
      // If split fails, return card unchanged
      return card;
    }
    
    if (parts.length !== 2) {
      return card;
    }

    const [medicineId, scheduleId] = parts;
    const dateKey = card.date;

    // Find matching dose occurrence by medicineId, scheduleId, and date
    const key = `${medicineId}|${scheduleId}|${dateKey}`;
    const matchingOccurrence = occurrenceMap.get(key);

    if (!matchingOccurrence) {
      return card;
    }

    const enrichedCard = { ...card };
    const status = matchingOccurrence.status;

    // Ensure we preserve all card properties when enriching
    const baseCard = card.card || {};
    
    if (status === "Taken") {
      enrichedCard.card = {
        ...baseCard,
        value: baseCard.value, // Preserve value
        title: baseCard.title,
        scheduleLabel: baseCard.scheduleLabel,
        extraLines: baseCard.extraLines,
        checked: true,
        isCompleted: true,
        isForgotten: false,
        statusLabel: "Tomada",
      };
    } else if (status === "Skipped") {
      enrichedCard.card = {
        ...baseCard,
        value: baseCard.value, // Preserve value
        title: baseCard.title,
        scheduleLabel: baseCard.scheduleLabel,
        extraLines: baseCard.extraLines,
        checked: false,
        isCompleted: false,
        isForgotten: true,
        statusLabel: "Pulada",
      };
    } else if (status === "Pending") {
      enrichedCard.card = {
        ...baseCard,
        value: baseCard.value, // Preserve value
        title: baseCard.title,
        scheduleLabel: baseCard.scheduleLabel,
        extraLines: baseCard.extraLines,
        checked: false,
        isCompleted: false,
        isForgotten: false,
        statusLabel: "Pendente",
      };
    }

    return enrichedCard;
  });
}
