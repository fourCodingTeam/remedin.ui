import React from "react";
import {
  GenericStepContainer,
  StepDescription,
  StepTitle,
  StyledTextInput,
  TextWrapper,
} from "../AuthModal.styles";

export default function AuthRegisterSecondStep() {
  return (
    <GenericStepContainer>
      <TextWrapper>
        <StepTitle>Crie seu usuário</StepTitle>
        <StepDescription>
          Seu usuário vai ser sua identificação daqui pra frente. Escolha um
          usuário divertido e fácil de lembrar!
        </StepDescription>
      </TextWrapper>
      <StyledTextInput placeholder="Seu novo usuário" autoCapitalize="none" />
    </GenericStepContainer>
  );
}
