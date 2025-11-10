import { Activity } from "lucide-react-native";
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
import { SideBySideInputs } from "./ModalShared.styles";

export function RegisterBloodPressureModal({
  isVisible,
  onClose,
}: HealthFormModalProps) {
  const { setBloodPressure } = useMemberStore();
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [measuredAt, setMeasuredAt] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirm = () => {
    if (systolic && diastolic) {
      setBloodPressure(`${systolic}/${diastolic}`);
    }
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Registrar pressão arterial",
        description: "Informe sua pressão arterial mais recente",
        icon: <Activity color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <SideBySideInputs>
            <InputBase
              compact
              enableFlexOne
              onChangeText={setSystolic}
              placeholder="Sistólica"
              value={systolic}
            />
            <InputBase
              compact
              enableFlexOne
              onChangeText={setDiastolic}
              placeholder="Diastólica"
              value={diastolic}
            />
          </SideBySideInputs>
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
