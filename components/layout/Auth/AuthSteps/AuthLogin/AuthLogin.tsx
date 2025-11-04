import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { signInWithEmail } from "@/auth/signIn";
import { InputBase } from "@/components/ui";
import { Button } from "@/components/ui/Common/Button"; //
import { StyledText } from "@/components/ui/Common/StyledText";
import { useUserStore } from "@/stores";
import { type LoginFormData, loginSchema } from "@/validators";
import {
  BottomContainer,
  GenericStepContainer,
  InputsWrapper,
  ModalContent,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";
import type { AuthLoginProps } from "../AuthModal.types";

export function AuthLogin({ onClose, onNavigateToRegister }: AuthLoginProps) {
  const { setIsLoggedIn } = useUserStore();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginPress = handleSubmit(async (data) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);

      await signInWithEmail(data.email, data.password);

      setIsLoggedIn(true);
      onClose();
    } catch {
      setAuthError("Não foi possível fazer login. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <ModalContent>
        <GenericStepContainer>
          <TextWrapper>
            <StepTitle>Digite suas credenciais</StepTitle>
            <StepDescription>
              Digite suas credenciais para fazer login no aplicativo
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
                    <StyledText color="error" variant="smallRegular">
                      {errors.email.message}
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
                    <StyledText
                      color="muted"
                      style={{ marginTop: 4 }}
                      variant="smallRegular"
                    >
                      {errors.password.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            {authError && (
              <StyledText
                color="error"
                style={{ marginTop: 8 }}
                variant="smallRegular"
              >
                {authError}
              </StyledText>
            )}
          </InputsWrapper>
        </GenericStepContainer>
      </ModalContent>

      <BottomContainer>
        <Button
          fullWidth
          label="Entrar"
          onPress={handleLoginPress}
          variant="black"
        />
        <Button
          disabled={isSubmitting}
          fullWidth
          label="Não tem uma conta?"
          onPress={onNavigateToRegister}
          textColor="dark"
          variant="empty"
        />
      </BottomContainer>
    </>
  );
}
