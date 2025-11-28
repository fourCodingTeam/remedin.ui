import { dosageUnitLabels, DoseStatus, parseDoseStatus } from "@/services/@types/enums";
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
  title: string,
  doseOccurrences?: DoseOccurrenceDto[]
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
      } else if (
        schedule.scheduleType === 3 && // EveryXHours
        doseOccurrences
      ) {
        // Para EveryXHours, criar um card para cada dose do dia
        const dosesForSchedule = doseOccurrences.filter(
          (dose) =>
            dose.medicineId === medicine.id &&
            dose.scheduleId === schedule.id
        );

        if (dosesForSchedule.length > 0) {
          // Criar um card para cada dose
          for (const dose of dosesForSchedule) {
            const scheduledDate = new Date(dose.scheduledAt);
            const hours = scheduledDate.getHours().toString().padStart(2, "0");
            const minutes = scheduledDate.getMinutes().toString().padStart(2, "0");
            const timeDisplay = `${hours}:${minutes}`;
            
            const scheduleWithTime = {
              ...schedule,
              timeOfDay: `${hours}:${minutes}:00`,
            };
            
            const cardData = createCardData(
              medicine,
              scheduleWithTime,
              dateKey,
              title
            );
            // Usar o ID da dose no card para identificação única
            cardData.id = `${medicine.id}-${schedule.id}-${dateKey}-${dose.id}`;
            result.push(cardData);
          }
        } else {
          // Se não há doses ainda, criar um card padrão (será criado quando buscar)
          const cardData = createCardData(medicine, schedule, dateKey, title);
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
  dateKey: string,
  doseOccurrences?: DoseOccurrenceDto[]
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
      title,
      doseOccurrences
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
    let matchingOccurrence: DoseOccurrenceDto | undefined;
    
    // Tentar encontrar com a chave completa primeiro
    const key = `${medicineId}|${scheduleId}|${dateKey}`;
    matchingOccurrence = occurrenceMap.get(key);
    
    // Se não encontrou, tentar buscar por medicineId e scheduleId apenas (caso a data não bata exatamente)
    if (!matchingOccurrence) {
      for (const [mapKey, occurrence] of occurrenceMap.entries()) {
        if (mapKey.startsWith(`${medicineId}|${scheduleId}|`)) {
          matchingOccurrence = occurrence;
          break;
        }
      }
    }

    const enrichedCard = { ...card };
    const baseCard = card.card || {};
    
    if (!matchingOccurrence) {
      // Se não há ocorrência, definir como pendente e GARANTIR que não está marcado
      enrichedCard.card = {
        ...baseCard,
        checked: false, // FORÇAR false
        isCompleted: false, // FORÇAR false
        isForgotten: false,
        statusLabel: "Pendente",
        tone: "secondary",
      };
      return enrichedCard;
    }

    // Parse status usando o enum e helper function
    // O backend retorna status como string via Status.ToString():
    // - "Taken" (enum value = 2)
    // - "Skipped" (enum value = 3)  
    // - "Pending" (enum value = 1)
    // - "Expired" (enum value = 4)
    const status = parseDoseStatus(matchingOccurrence.status);
    
    // Aplicar estilos baseado no status do enum
    switch (status) {
      case DoseStatus.Taken:
        enrichedCard.card = {
          ...baseCard,
          value: baseCard.value, // Preserve value
          title: baseCard.title,
          scheduleLabel: baseCard.scheduleLabel,
          extraLines: baseCard.extraLines,
          checked: true, // Marcado como tomada
          isCompleted: true, // Completada
          isForgotten: false,
          statusLabel: "Tomada",
          tone: "primary", // Estilo primary (verde/azul)
        };
        return enrichedCard;
        
      case DoseStatus.Skipped:
        enrichedCard.card = {
          ...baseCard,
          value: baseCard.value, // Preserve value
          title: baseCard.title,
          scheduleLabel: baseCard.scheduleLabel,
          extraLines: baseCard.extraLines,
          checked: false,
          isCompleted: false,
          isForgotten: true, // Marcada como pulada
          statusLabel: "Pulada",
          tone: "danger", // Estilo danger (vermelho)
        };
        return enrichedCard;
        
      case DoseStatus.Expired:
        enrichedCard.card = {
          ...baseCard,
          value: baseCard.value, // Preserve value
          title: baseCard.title,
          scheduleLabel: baseCard.scheduleLabel,
          extraLines: baseCard.extraLines,
          checked: false,
          isCompleted: false,
          isForgotten: true, // Expirou (tratado como esquecida)
          statusLabel: "Expirada",
          tone: "danger", // Estilo danger (vermelho)
        };
        return enrichedCard;
        
      case DoseStatus.Pending:
      default:
        // Default para Pending
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
          tone: "secondary", // Estilo secondary (cinza)
        };
        return enrichedCard;
    }

  });
}
