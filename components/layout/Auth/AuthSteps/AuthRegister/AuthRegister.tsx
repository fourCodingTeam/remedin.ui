import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { signUp } from "@/auth/signUp";
import { InputBase } from "@/components/ui";
import { Button } from "@/components/ui/Common/Button";
import { StyledText } from "@/components/ui/Common/StyledText";
import { useToast } from "@/components/ui/Toast";
import { theme } from "@/constants/theme";
import { useUserStore } from "@/stores";
import { type RegisterFormData, registerSchema } from "@/validators";
import {
  BottomContainer,
  GenericStepContainer,
  InputsWrapper,
  ModalContent,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";
import type { AuthRegisterProps } from "../AuthModal.types";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Erro ao criar conta. Tente novamente.";
};

export function AuthRegister({
  onClose,
  onNavigateToLogin,
}: AuthRegisterProps) {
  const { setIsLoggedIn, setEmail, setUsername } = useUserStore();
  const { showToast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleRegisterPress = handleSubmit(async (data) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);

      await signUp(data.email, data.password);

      setEmail(data.email);
      setUsername(data.username);
      setIsLoggedIn(true);
      showToast("Conta criada com sucesso!", "success");
      onClose();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <ModalContent>
        <GenericStepContainer>
          <TextWrapper>
            <StepTitle>Crie sua conta</StepTitle>
            <StepDescription>
              Preencha seus dados de acesso e personalize seus lembretes.
            </StepDescription>
          </TextWrapper>

          <InputsWrapper>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    autoCapitalize="none"
                    compact
                    keyboardType="email-address"
                    onChangeText={onChange}
                    placeholder="E-mail"
                    prefixIcon="envelope"
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
              name="username"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    autoCapitalize="none"
                    compact
                    onChangeText={onChange}
                    placeholder="Usuário"
                    prefixIcon="user"
                    value={value}
                  />
                  {errors.username && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.username.message}
                    </StyledText>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    compact
                    onChangeText={onChange}
                    placeholder="Senha"
                    prefixIcon="lock"
                    secureTextEntry
                    value={value}
                  />
                  {errors.password && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.password.message}
                    </StyledText>
                  )}
                </>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    compact
                    onChangeText={onChange}
                    placeholder="Confirme a senha"
                    prefixIcon="lock"
                    secureTextEntry
                    value={value}
                  />
                  {errors.confirmPassword && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.confirmPassword.message}
                    </StyledText>
                  )}
                </>
              )}
            />
          </InputsWrapper>

          {authError && (
            <StyledText
              color="error"
              style={{ marginTop: theme.sizes[3] }}
              variant="mediumRegular"
            >
              {authError}
            </StyledText>
          )}
        </GenericStepContainer>
      </ModalContent>

      <BottomContainer>
        <Button
          disabled={isSubmitting}
          fullWidth
          isLoading={isSubmitting}
          label="Criar conta"
          onPress={handleRegisterPress}
          variant="black"
        />
        <Button
          disabled={isSubmitting}
          fullWidth
          label="Já tem uma conta?"
          onPress={onNavigateToLogin}
          textColor="dark"
          variant="empty"
        />
      </BottomContainer>
    </>
  );
}
