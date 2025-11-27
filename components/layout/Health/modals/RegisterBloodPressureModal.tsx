import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputBase, InputDate, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { registerBloodPressure } from "@/services/api/health";
import { getAuthToken } from "@/services/utils/getAuthToken";
import {
  bloodPressureSchema,
  type BloodPressureFormData,
} from "@/validators";
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
  const { showToast } = useToast();
  const { memberId } = useMemberContext();
  const { reload: reloadHealthData } = useHealthData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BloodPressureFormData>({
    resolver: zodResolver(bloodPressureSchema),
    defaultValues: {
      systolicValue: 0,
      diastolicValue: 0,
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

      const response = await registerBloodPressure(
        {
          systolicValue: data.systolicValue,
          diastolicValue: data.diastolicValue,
          recordedAt: data.recordedAt.toISOString(),
          notes: data.notes?.trim() || null,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast("Pressão arterial registrada com sucesso!", "success");
        reloadHealthData();
        reset();
        onClose();
      } else {
        showToast(
          response.message || "Erro ao registrar pressão arterial",
          "error"
        );
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Erro ao registrar pressão arterial",
        "error"
      );
    }
  });

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
            <Controller
              control={control}
              name="systolicValue"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    compact
                    enableFlexOne
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const num = Number.parseFloat(text.replace(",", "."));
                      onChange(Number.isNaN(num) ? 0 : num);
                    }}
                    placeholder="Sistólica"
                    value={value > 0 ? value.toString() : ""}
                  />
                </>
              )}
            />
            <Controller
              control={control}
              name="diastolicValue"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    compact
                    enableFlexOne
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      const num = Number.parseFloat(text.replace(",", "."));
                      onChange(Number.isNaN(num) ? 0 : num);
                    }}
                    placeholder="Diastólica"
                    value={value > 0 ? value.toString() : ""}
                  />
                </>
              )}
            />
          </SideBySideInputs>
          {(errors.systolicValue || errors.diastolicValue) && (
            <StyledText color="error" variant="mediumRegular">
              {errors.systolicValue?.message || errors.diastolicValue?.message}
            </StyledText>
          )}
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
