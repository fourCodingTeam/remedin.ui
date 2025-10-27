import { Button } from "@/components/ui/Common/Button"; //
import { useUserStore } from "@/stores"; //
import React from "react";
import {
  BottomContainer,
  GenericStepContainer,
  InputsWrapper,
  ModalContent,
  StepDescription,
  StepTitle,
  StyledTextInput,
  TextWrapper,
} from "../AuthModal.styles";
import { AuthLoginProps } from "../AuthModal.types";

export function AuthLogin({ onClose, onNavigateToRegister }: AuthLoginProps) {
  const { setIsLoggedIn } = useUserStore(); //

  const handleLoginPress = () => {
    // ... lógica de login aqui ...
    // Se der certo:
    setIsLoggedIn(true); //
    onClose();
  };

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
            <StyledTextInput
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <StyledTextInput placeholder="Senha" secureTextEntry />
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
