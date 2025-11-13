import { Pencil } from "lucide-react-native";
import { useState } from "react";
import { medicineMeasurementsEnum } from "@/@types";
import {
  Button,
  InputBase,
  InputDate,
  InputSelect,
  StyledText,
} from "@/components/ui";
import { ModalBase } from "@/components/ui/ModalBase/ModalBase";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import { SideBySideInputsWrapper } from "../MedicineFormModal/MedicineFormModal.styles";
import type { MedicineEditModalProps } from "./MedicineEditModal.types";

export function MedicineEditModal({
  isVisible,
  onClose,
  medicine,
}: MedicineEditModalProps) {
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: medicine?.name || "",
    dosage: medicine?.dosage?.split(" ")[0] || "",
    measurement: medicine?.dosage?.split(" ")[1] || "g",
    startDate: medicine?.periodStart || "",
    endDate: medicine?.periodEnd || "",
    frequency: medicine?.times?.length?.toString() || "",
    note: medicine?.note || "",
  });

  if (!medicine) {
    return null;
  }

  const handleConfirm = () => {
    setIsConfirmModalVisible(true);
  };

  const handleSave = () => {
    setIsConfirmModalVisible(false);
    onClose();
  };

  return (
    <>
      <ModalPageWrapper
        header={{
          title: "Editar medicação",
          description:
            "Altere as informações de uma medicação que cadastrou anteriormente",
          icon: <Pencil color="black" size={18} />,
        }}
        isVisible={isVisible}
        onClose={onClose}
      >
        <FormContentWrapper>
          <InputsWrapper>
            <StyledText variant="mediumSemiBold">
              Informações da medicação
            </StyledText>
            <InputBase
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Nome da medicação"
              value={formData.name}
            />
            <SideBySideInputsWrapper>
              <InputBase
                compact
                enableFlexOne
                onChangeText={(text) =>
                  setFormData({ ...formData, dosage: text })
                }
                placeholder="Dosagem"
                value={formData.dosage}
              />
              <InputSelect
                compact
                enableFlexOne
                onChange={(value) =>
                  setFormData({ ...formData, measurement: value as string })
                }
                options={medicineMeasurementsEnum}
                placeholder="Medida"
                value={formData.measurement}
              />
            </SideBySideInputsWrapper>
            <InputDate
              onChange={(date) =>
                setFormData({
                  ...formData,
                  startDate: date as string,
                })
              }
              placeholder="Data de início"
              value={formData.startDate}
            />
            <InputDate
              onChange={(date) =>
                setFormData({
                  ...formData,
                  endDate: date as string,
                })
              }
              placeholder="Data de fim"
              value={formData.endDate}
            />
            <InputBase
              onChangeText={(text) =>
                setFormData({ ...formData, frequency: text })
              }
              placeholder="Frequência por dia"
              value={formData.frequency}
            />
            <InputBase
              onChangeText={(text) => setFormData({ ...formData, note: text })}
              placeholder="Observações"
              value={formData.note}
            />
          </InputsWrapper>
          <ButtonsWrapper addPadding>
            <Button
              label="Confirmar"
              onPress={handleConfirm}
              variant="primary"
            />
            <Button label="Cancelar" onPress={onClose} variant="outline" />
          </ButtonsWrapper>
        </FormContentWrapper>
      </ModalPageWrapper>

      <ModalBase
        button={[
          {
            label: "Sim, quero editar",
            onPress: handleSave,
            variant: "primary",
          },
          {
            label: "Cancelar",
            onPress: () => setIsConfirmModalVisible(false),
            variant: "outline",
          },
        ]}
        description="Após confirmar, a medicação será alterada para sempre, sem chances de voltar atrás."
        isVisible={isConfirmModalVisible}
        onClose={() => setIsConfirmModalVisible(false)}
        title="Confirmar alterações?"
      />
    </>
  );
}
