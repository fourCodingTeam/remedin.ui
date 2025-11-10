import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { Button, InputBase } from "@/components/ui";
import { useMemberStore } from "@/stores/MemberStore";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import type { HealthFormModalProps } from "./HealthFormModal.types";

export function EditPersonalInformationModal({
  isVisible,
  onClose,
}: HealthFormModalProps) {
  const { member, setMember, weight, height, setWeight, setHeight } =
    useMemberStore();

  const [name, setName] = useState(member.name);
  const [age, setAge] = useState("");
  const [weightValue, setWeightValue] = useState(weight ? `${weight}` : "");
  const [heightValue, setHeightValue] = useState(height ? `${height}` : "");

  const handleConfirm = () => {
    setMember({
      ...member,
      name,
    });

    const parsedWeight = Number.parseFloat(weightValue.replace(",", "."));
    if (!Number.isNaN(parsedWeight)) {
      setWeight(parsedWeight);
    }

    const parsedHeight = Number.parseFloat(heightValue.replace(",", "."));
    if (!Number.isNaN(parsedHeight)) {
      setHeight(parsedHeight);
    }

    onClose();
  };

  const handleCancel = () => onClose();

  return (
    <ModalPageWrapper
      header={{
        title: "Alterar informações pessoais",
        description: "Atualize suas informações cadastrais",
        icon: <Pencil color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase onChangeText={setName} placeholder="Nome" value={name} />
          <InputBase onChangeText={setAge} placeholder="Idade" value={age} />
          <InputBase
            onChangeText={setWeightValue}
            placeholder="Peso (kg)"
            value={weightValue}
          />
          <InputBase
            onChangeText={setHeightValue}
            placeholder="Altura (cm)"
            value={heightValue}
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
