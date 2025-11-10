import { CalendarIcon } from "lucide-react-native";
import { useState } from "react";
import {
  Button,
  MedicineCheckboxCard,
  StyledText,
} from "@/components/ui/Common";
import { Calendar } from "@/components/ui/Common/Calendar";
import { medicinesPerHourMock } from "@/services/mock/medicinesPerHour";
import { ModalPageWrapper } from "../Common/ModalPageWrapper";
import { ButtonsWrapper } from "../styles";
import {
  MedicationTimeLineItem,
  MedicinesStack,
  ScrollableMedicationTimeLine,
} from "./CalendarModal.styles";
import type { CalendarModalProps } from "./CalendarModal.types";

export function CalendarModal({ isVisible, onClose }: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
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
        {medicinesPerHourMock.map(({ hour, medicines }, index) => (
          <MedicationTimeLineItem key={hour + index}>
            <StyledText color="muted" variant="mediumRegular">
              {hour}
            </StyledText>
            <MedicinesStack>
              {medicines.map((medicine, index) => (
                <MedicineCheckboxCard
                  checked={medicine.checked}
                  defaultChecked={medicine.defaultChecked}
                  disabled={medicine.disabled}
                  extraLines={medicine.extraLines}
                  isCompleted={medicine.isCompleted}
                  isForgotten={medicine.isForgotten}
                  key={index}
                  onChange={medicine.onChange}
                  onPress={medicine.onPress}
                  scheduleLabel={medicine.scheduleLabel}
                  title={medicine.title}
                  tone={medicine.tone}
                  value={medicine.value}
                />
              ))}
            </MedicinesStack>
          </MedicationTimeLineItem>
        ))}
      </ScrollableMedicationTimeLine>
      <ButtonsWrapper addPadding>
        <Button label="Cancelar" onPress={onClose} variant="outline" />
      </ButtonsWrapper>
    </ModalPageWrapper>
  );
}
