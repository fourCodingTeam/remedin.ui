import React from "react";
import {
  GenericStepContainer,
  InputsWrapper,
  StepDescription,
  StepTitle,
  StyledTextInput,
  TextWrapper,
} from "../AuthModal.styles";

export default function AuthRegisterThirdStep() {
  return (
    <GenericStepContainer>
      <TextWrapper>
        <StepTitle>Defina sua senha</StepTitle>
        <StepDescription>
          Sua senha é a chave do aplicativo, com ela, você e apenas você
          conseguirá acessar todos os seus lembretes e dados!
        </StepDescription>
      </TextWrapper>
      <InputsWrapper>
        <StyledTextInput placeholder="Sua senha" secureTextEntry />
        <StyledTextInput placeholder="Confirme sua senha" secureTextEntry />
      </InputsWrapper>
    </GenericStepContainer>
  );
}
