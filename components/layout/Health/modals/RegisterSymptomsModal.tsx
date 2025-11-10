import { ClipboardList } from "lucide-react-native";
import { useState } from "react";
import { Button, InputBase, InputDate } from "@/components/ui";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import type { HealthFormModalProps } from "./HealthFormModal.types";

export function RegisterSymptomsModal({
  isVisible,
  onClose,
}: HealthFormModalProps) {
  const [symptom, setSymptom] = useState("");
  const [startedAt, setStartedAt] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    // TODO: Integrate with backend
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Registrar sintomas",
        description: "Descreva os sintomas que está sentindo no momento",
        icon: <ClipboardList color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase
            onChangeText={setSymptom}
            placeholder="Quais sintomas?"
            value={symptom}
          />
          <InputDate
            onChange={setStartedAt}
            placeholder="Quando começou?"
            value={startedAt}
          />
          <InputBase
            onChangeText={setNotes}
            placeholder="Observações adicionais"
            value={notes}
          />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button label="Confirmar" onPress={handleConfirm} variant="primary" />
          <Button label="Cancelar" onPress={handleCancel} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
