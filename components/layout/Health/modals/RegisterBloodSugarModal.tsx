import { zodResolver } from "@hookform/resolvers/zod";
import { Droplet } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputBase, InputDate, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { registerBloodSugar } from "@/services/api/health";
import { getAuthToken } from "@/services/utils/getAuthToken";
import {
  bloodSugarSchema,
  type BloodSugarFormData,
} from "@/validators";
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
  const { showToast } = useToast();
  const { memberId } = useMemberContext();
  const { reload: reloadHealthData } = useHealthData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BloodSugarFormData>({
    resolver: zodResolver(bloodSugarSchema),
    defaultValues: {
      value: 0,
      recordedAt: undefined,
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

      const response = await registerBloodSugar(
        {
          value: data.value,
          recordedAt: data.recordedAt.toISOString(),
          unit: "mg/dL",
          notes: data.notes?.trim() || null,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast("Glicose registrada com sucesso!", "success");
        reloadHealthData();
        reset();
        onClose();
      } else {
        showToast(response.message || "Erro ao registrar glicose", "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao registrar glicose",
        "error"
      );
    }
  });

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
          <Controller
            control={control}
            name="value"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const num = Number.parseFloat(text.replace(",", "."));
                    onChange(Number.isNaN(num) ? 0 : num);
                  }}
                  placeholder="Valor da medição"
                  value={value > 0 ? value.toString() : ""}
                />
                {errors.value && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.value.message}
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
                  placeholder="Horário da medição"
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
                placeholder="Observações"
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
