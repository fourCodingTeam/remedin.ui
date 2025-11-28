import { CalendarIcon } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  MedicineCheckboxCard,
  StyledText,
} from "@/components/ui/Common";
import { Calendar } from "@/components/ui/Common/Calendar";
import { useDoseOccurrencesForDate } from "@/hooks/useDoseOccurrencesForDate";
import { useMemberContext } from "@/hooks/useMemberContext";
import { useMedicines } from "@/hooks/useMedicines";
import { getDateFromKey, getDateKey } from "@/utils/date/dateKey";
import { groupMedicinesByHour } from "@/utils/medicine/groupMedicinesByHour";
import {
  enrichCardsWithDoseStatus,
  mapMedicinesToCardsForDate,
} from "@/utils/medicine/medicineCardMapper";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import { ButtonsWrapper } from "../../styles";
import {
  MedicationTimeLineItem,
  MedicinesStack,
  ScrollableMedicationTimeLine,
} from "./CalendarModal.styles";
import type { CalendarModalProps } from "./CalendarModal.types";

function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function CalendarModal({ isVisible, onClose }: CalendarModalProps) {
  const { memberId } = useMemberContext();
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    normalizeDate(new Date())
  );
  const [currentDate, setCurrentDate] = useState<Date>(() =>
    normalizeDate(new Date())
  );
  const { medicines, isLoading, reloadMedicines } = useMedicines(memberId);
  
  // Fetch dose occurrences for selected date
  const { doseOccurrences, isLoading: isLoadingDoses } =
    useDoseOccurrencesForDate(selectedDate, memberId);

  useEffect(() => {
    if (isVisible) {
      reloadMedicines();
    }
  }, [isVisible, reloadMedicines]);

  const handleSelectDate = (date: Date) => {
    const normalized = normalizeDate(date);
    setSelectedDate(normalized);
    setCurrentDate(normalized);
  };

  const selectedDateKey = useMemo(
    () => getDateKey(selectedDate),
    [selectedDate]
  );

  const selectedDateObj = useMemo(
    () => getDateFromKey(selectedDateKey),
    [selectedDateKey]
  );

  const medicinesForSelectedDate = useMemo(() => {
    const cards = mapMedicinesToCardsForDate(
      medicines,
      selectedDateObj,
      selectedDateKey
    );
    
    // Enrich cards with dose occurrence status
    return enrichCardsWithDoseStatus(cards, doseOccurrences);
  }, [medicines, selectedDateObj, selectedDateKey, doseOccurrences]);

  const medicinesByHour = useMemo(
    () => groupMedicinesByHour(medicinesForSelectedDate),
    [medicinesForSelectedDate]
  );

  const renderMedicinesTimeline = () => {
    if (isLoading || isLoadingDoses) {
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 16 }}
          variant="mediumRegular"
        >
          Carregando medicações...
        </StyledText>
      );
    }

    if (medicinesByHour.length === 0) {
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 16 }}
          variant="mediumRegular"
        >
          Nenhuma medicação para esta data.
        </StyledText>
      );
    }

    return medicinesByHour.map(({ hour, medicines: medicinesList }) => (
      <MedicationTimeLineItem key={hour}>
        <StyledText color="muted" variant="mediumRegular">
          {hour}
        </StyledText>
        <MedicinesStack>
          {medicinesList.map((medicine) => (
            <MedicineCheckboxCard
              checked={medicine.card.checked}
              extraLines={medicine.card.extraLines}
              isCompleted={medicine.card.isCompleted}
              isForgotten={medicine.card.isForgotten}
              key={medicine.id}
              scheduleLabel={medicine.card.scheduleLabel}
              statusLabel={medicine.card.statusLabel}
              title={medicine.card.title}
              tone={medicine.card.tone}
              value={medicine.card.value}
            />
          ))}
        </MedicinesStack>
      </MedicationTimeLineItem>
    ));
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Calendário",
        description: "Selecione uma data",
        icon: <CalendarIcon size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <Calendar
        currentDate={currentDate}
        onSelectDate={handleSelectDate}
        selectedDate={selectedDate}
      />
      <StyledText variant="largeRegular">Medicações</StyledText>
      <ScrollableMedicationTimeLine>
        {renderMedicinesTimeline()}
      </ScrollableMedicationTimeLine>
      <ButtonsWrapper addPadding>
        <Button label="Cancelar" onPress={onClose} variant="outline" />
      </ButtonsWrapper>
    </ModalPageWrapper>
  );
}
