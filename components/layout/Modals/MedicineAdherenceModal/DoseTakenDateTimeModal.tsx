import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, StyledText } from "@/components/ui";
import { ModalBase } from "@/components/ui/ModalBase";
import { formatDateToDDMMYYYY, formatTimeToDisplay } from "@/utils/DateFormatters";
import type { DoseTakenDateTimeModalProps } from "./DoseTakenDateTimeModal.types";

export function DoseTakenDateTimeModal({
  isVisible,
  onClose,
  onConfirm,
  scheduledAt,
}: DoseTakenDateTimeModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    // Inicializar com o horário agendado ou agora, o que for mais recente
    // Mas nunca permitir data futura
    const scheduled = scheduledAt ? new Date(scheduledAt) : null;
    const now = new Date();
    
    if (scheduled && scheduled.getTime() < now.getTime()) {
      // Se o horário agendado já passou, usar o horário agendado como padrão
      return scheduled;
    }
    
    // Caso contrário, usar agora
    return now;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const handleDateConfirm = (date: Date) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setFullYear(date.getFullYear());
      newDate.setMonth(date.getMonth());
      newDate.setDate(date.getDate());
      return newDate;
    });
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (time: Date) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setHours(time.getHours());
      newDate.setMinutes(time.getMinutes());
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      return newDate;
    });
    setShowTimePicker(false);
  };

  return (
    <>
      <ModalBase
        description="Selecione quando a dose foi tomada"
        isVisible={isVisible}
        onClose={onClose}
        title="Data e hora da dose"
        button={[
          {
            label: "Confirmar",
            onPress: handleConfirm,
            variant: "primary",
          },
          {
            label: "Cancelar",
            onPress: onClose,
            variant: "outline",
          },
        ]}
      >
        <StyledText
          color="muted"
          style={{ marginBottom: 16, textAlign: "center" }}
          variant="mediumRegular"
        >
          Horário agendado:{" "}
          {scheduledAt
            ? formatTimeToDisplay(new Date(scheduledAt))
            : "Não disponível"}
        </StyledText>

        <Button
          label={`Data: ${formatDateToDDMMYYYY(selectedDate)}`}
          onPress={() => setShowDatePicker(true)}
          variant="outline"
          style={{ marginBottom: 8 }}
        />

        <Button
          label={`Hora: ${formatTimeToDisplay(selectedDate)}`}
          onPress={() => setShowTimePicker(true)}
          variant="outline"
        />
      </ModalBase>

      <DateTimePickerModal
        date={selectedDate}
        isVisible={showDatePicker}
        maximumDate={new Date()}
        mode="date"
        onCancel={() => setShowDatePicker(false)}
        onConfirm={handleDateConfirm}
      />

      <DateTimePickerModal
        date={selectedDate}
        isVisible={showTimePicker}
        maximumDate={new Date()}
        mode="time"
        onCancel={() => setShowTimePicker(false)}
        onConfirm={handleTimeConfirm}
      />
    </>
  );
}

