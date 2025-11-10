import { Droplet } from "lucide-react-native";
import { useState } from "react";
import { Button, InputBase, InputDate } from "@/components/ui";
import { useMemberStore } from "@/stores/MemberStore";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import type { HealthFormModalProps } from "./HealthFormModal.types";

export function RegisterBloodSugarModal({
  isVisible,
  onClose,
}: HealthFormModalProps) {
  const { setBloodSugar } = useMemberStore();
  const [value, setValue] = useState("");
  const [measuredAt, setMeasuredAt] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    const parsedValue = Number.parseFloat(value.replace(",", "."));

    if (!Number.isNaN(parsedValue)) {
      setBloodSugar(parsedValue);
    }

    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Registrar glicose",
        description: "Registre seus níveis de glicose",
        icon: <Droplet color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase
            onChangeText={setValue}
            placeholder="Valor da medição*"
            value={value}
          />
          <InputDate
            onChange={setMeasuredAt}
            placeholder="Horário da medição"
            value={measuredAt}
          />
          <InputBase
            onChangeText={setNotes}
            placeholder="Observações"
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
