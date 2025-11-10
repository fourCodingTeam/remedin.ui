import { Plus } from "lucide-react-native";
import { Button, InputBase, InputDate, InputSelect } from "@/components/ui";
import { ModalPageWrapper } from "../Common/ModalPageWrapper";
import { ButtonsWrapper, FormContentWrapper, InputsWrapper } from "../styles";
import { SideBySideInputsWrapper } from "./MedicineFormModal.styles";
import type { MedicineFormModalProps } from "./MedicineFormMotal.types";

export function MedicineFormModal({
  isVisible,
  onClose,
}: MedicineFormModalProps) {
  const handleCancel = () => {
    onClose();
  };

  const handleAdd = () => {
    // implementar lógica para adicionar a medicação
    try {
      // implementar
    } catch {
      // implementar
    } finally {
      onClose();
    }
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Adicionar medicação",
        description:
          "Preencha os campos abaixo para adicionar uma nova medicação",
        icon: <Plus color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase placeholder="Nome da medicação" />
          <SideBySideInputsWrapper>
            <InputBase compact enableFlexOne placeholder="Dosagem" />
            <InputSelect
              compact
              enableFlexOne
              options={[
                { label: "Miligramas", value: "mg" },
                { label: "Gramas", value: "g" },
                { label: "Mililitros", value: "ml" },
                { label: "Litros", value: "l" },
              ]}
              placeholder="Medida"
            />
          </SideBySideInputsWrapper>
          <InputDate placeholder="Data de início" />
          <InputDate placeholder="Data de fim" />
          <InputBase placeholder="Frequência por dia" />
          <InputBase placeholder="Observações" />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button label="Adicionar" onPress={handleAdd} variant="primary" />
          <Button label="Cancelar" onPress={handleCancel} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
