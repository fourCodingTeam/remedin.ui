import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputBase, InputDate, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { registerSymptom } from "@/services/api/health";
import { getAuthToken } from "@/services/utils/getAuthToken";
import {
  symptomsSchema,
  type SymptomsFormData,
} from "@/validators";
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
  const { showToast } = useToast();
  const { memberId } = useMemberContext();
  const { reload: reloadHealthData } = useHealthData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SymptomsFormData>({
    resolver: zodResolver(symptomsSchema),
    defaultValues: {
      symptoms: "",
      recordedAt: undefined,
      severity: null,
      notes: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isVisible) {
      reset();
    }
  }, [isVisible, reset]);

  const handleCancel = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        return;
      }

      const response = await registerSymptom(
        {
          symptoms: data.symptoms.trim(),
          recordedAt: data.recordedAt.toISOString(),
          severity: data.severity || null,
          notes: data.notes?.trim() || null,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast("Sintomas registrados com sucesso!", "success");
        reloadHealthData();
        reset();
        onClose();
      } else {
        showToast(
          response.message || "Erro ao registrar sintomas",
          "error"
        );
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao registrar sintomas",
        "error"
      );
    }
  });

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
          <Controller
            control={control}
            name="symptoms"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  multiline
                  numberOfLines={3}
                  onChangeText={onChange}
                  placeholder="Quais sintomas?"
                  value={value}
                />
                {errors.symptoms && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.symptoms.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="recordedAt"
            render={({ field: { onChange, value } }) => (
              <>
                <InputDate
                  mode="datetime"
                  onChange={onChange}
                  placeholder="Quando começou?"
                  value={value}
                />
                {errors.recordedAt && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.recordedAt.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, value } }) => (
              <InputBase
                onChangeText={(text) => onChange(text.trim() || null)}
                placeholder="Observações adicionais"
                value={value || ""}
              />
            )}
          />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button
            isLoading={isSubmitting}
            label="Confirmar"
            onPress={onSubmit}
            variant="primary"
          />
          <Button label="Cancelar" onPress={handleCancel} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
