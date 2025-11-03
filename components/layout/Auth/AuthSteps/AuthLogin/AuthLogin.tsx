import { InputBase } from "@/components/ui";
import { Button } from "@/components/ui/Common/Button"; //
import { StyledText } from "@/components/ui/Common/StyledText";
import { useUserStore } from "@/stores";
import { LoginFormData, loginSchema } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  BottomContainer,
  GenericStepContainer,
  InputsWrapper,
  ModalContent,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";
import { AuthLoginProps } from "../AuthModal.types";

export function AuthLogin({ onClose, onNavigateToRegister }: AuthLoginProps) {
  const { setIsLoggedIn } = useUserStore(); //
  
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLoginPress = handleSubmit((data) => {
    // ... lógica de login aqui ...
    console.log("Login data:", data);
    // Se der certo:
    setIsLoggedIn(true); //
    onClose();
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
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    prefixIcon="envelope"
                    compact
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.email && (
                    <StyledText variant="smallRegular" color="error">
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
                    placeholder="Senha"
                    secureTextEntry
                    prefixIcon="lock"
                    compact
                    value={value}
                    onChangeText={onChange}
                  />
                  {errors.password && (
                    <StyledText variant="smallRegular" color="muted" style={{ marginTop: 4 }}>
                      {errors.password.message}
                    </StyledText>
                  )}
                </>
              )}
            />
          </InputsWrapper>
        </GenericStepContainer>
      </ModalContent>

      <BottomContainer>
        <Button
          label="Entrar"
          variant="black"
          fullWidth
          onPress={handleLoginPress}
        />
        <Button
          label="Não tem uma conta?"
          variant="empty"
          textColor="dark"
          fullWidth
          onPress={onNavigateToRegister}
        />
      </BottomContainer>
    </>
  );
}
