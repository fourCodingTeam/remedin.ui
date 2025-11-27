import { zodResolver } from "@hookform/resolvers/zod";
import { Ruler } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputBase, InputDate, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { registerHeight } from "@/services/api/health";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { heightSchema, type HeightFormData } from "@/validators";
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
  const { showToast } = useToast();
  const { memberId } = useMemberContext();
  const { reload: reloadHealthData } = useHealthData();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeightFormData>({
    resolver: zodResolver(heightSchema),
    defaultValues: {
      heightCm: 0,
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

      const response = await registerHeight(
        {
          heightCm: data.heightCm,
          recordedAt: data.recordedAt.toISOString(),
          notes: data.notes?.trim() || null,
        },
        token,
        memberId || undefined
      );

      if (response.success) {
        showToast("Altura registrada com sucesso!", "success");
        reloadHealthData();
        reset();
        onClose();
      } else {
        showToast(response.message || "Erro ao registrar altura", "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao registrar altura",
        "error"
      );
    }
  });

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
          <Controller
            control={control}
            name="heightCm"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const num = Number.parseInt(text.replace(",", "."), 10);
                    onChange(Number.isNaN(num) ? 0 : num);
                  }}
                  placeholder="Altura em cm"
                  value={value > 0 ? value.toString() : ""}
                />
                {errors.heightCm && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.heightCm.message}
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
                  placeholder="Data da medição"
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
