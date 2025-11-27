import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react-native";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, InputBase, InputDate, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { registerMember } from "@/services/api/person";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { type MemberFormData, memberSchema } from "@/validators";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";

type NewMemberFormModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onMemberCreated?: () => void;
};

export function NewMemberFormModal({
  isVisible,
  onClose,
  onMemberCreated,
}: NewMemberFormModalProps) {
  const { showToast } = useToast();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      email: "",
      name: "",
      userName: "",
      phone: "",
      birthDate: null,
      weightKg: null,
      heightCm: null,
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

  const onSubmit = async (data: MemberFormData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Erro de autenticação. Faça login novamente.", "error");
        return;
      }

      const response = await registerMember(
        {
          email: data.email.trim(),
          name: data.name.trim(),
          userName: data.userName.trim(),
          phone: data.phone.trim(),
          birthDate: data.birthDate || null,
          weightKg: data.weightKg || null,
          heightCm: data.heightCm || null,
        },
        token
      );

      if (!response.success) {
        showToast(response.message || "Erro ao criar membro", "error");
        return;
      }

      showToast("Membro criado com sucesso!", "success");
      reset();
      onClose();
      onMemberCreated?.();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao criar membro",
        "error"
      );
    }
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Adicionar membro",
        description: "Adicione um membro que fará parte do seu círculo",
        icon: <UserPlus color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={onChange}
                  placeholder="Email*"
                  value={value}
                />
                {errors.email && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.email.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  onChangeText={onChange}
                  placeholder="Nome*"
                  value={value}
                />
                {errors.name && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.name.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="userName"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  autoCapitalize="none"
                  onChangeText={onChange}
                  placeholder="Apelido*"
                  value={value}
                />
                {errors.userName && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.userName.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  keyboardType="phone-pad"
                  onChangeText={onChange}
                  placeholder="Telefone*"
                  value={value}
                />
                {errors.phone && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.phone.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="birthDate"
            render={({ field: { onChange, value } }) => (
              <>
                <InputDate
                  onChange={onChange}
                  placeholder="Data de nascimento"
                  value={value}
                />
                {errors.birthDate && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.birthDate.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="weightKg"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const num = Number.parseFloat(text);
                    onChange(Number.isNaN(num) ? null : num);
                  }}
                  placeholder="Peso (kg)"
                  value={value?.toString() || ""}
                />
                {errors.weightKg && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.weightKg.message}
                  </StyledText>
                )}
              </>
            )}
          />
          <Controller
            control={control}
            name="heightCm"
            render={({ field: { onChange, value } }) => (
              <>
                <InputBase
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    const num = Number.parseInt(text, 10);
                    onChange(Number.isNaN(num) ? null : num);
                  }}
                  placeholder="Altura (cm)"
                  value={value?.toString() || ""}
                />
                {errors.heightCm && (
                  <StyledText color="error" variant="mediumRegular">
                    {errors.heightCm.message}
                  </StyledText>
                )}
              </>
            )}
          />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button
            disabled={isSubmitting}
            label="Confirmar"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
          />
          <Button
            disabled={isSubmitting}
            label="Cancelar"
            onPress={handleCancel}
            variant="outline"
          />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
