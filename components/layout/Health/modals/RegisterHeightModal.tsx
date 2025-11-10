import { Ruler } from "lucide-react-native";
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

export function RegisterHeightModal({
  isVisible,
  onClose,
}: HealthFormModalProps) {
  const { height, setHeight } = useMemberStore();
  const [value, setValue] = useState(height ? height.toString() : "");
  const [measuredAt, setMeasuredAt] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    const parsedValue = Number.parseFloat(value.replace(",", "."));
    if (!Number.isNaN(parsedValue)) {
      setHeight(parsedValue);
    }
    onClose();
  };

  const handleCancel = () => onClose();

  return (
    <ModalPageWrapper
      header={{
        title: "Registrar altura",
        description: "Atualize a sua altura",
        icon: <Ruler color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase
            onChangeText={setValue}
            placeholder="Altura em cm"
            value={value}
          />
          <InputDate
            onChange={setMeasuredAt}
            placeholder="Data da medição"
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
