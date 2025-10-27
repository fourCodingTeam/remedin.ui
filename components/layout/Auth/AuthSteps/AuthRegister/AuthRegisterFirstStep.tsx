import React from "react";
import {
  GenericStepContainer,
  InputsWrapper,
  StepDescription,
  StepTitle,
  StyledTextInput,
  TextWrapper,
} from "../AuthModal.styles";

export default function AuthRegisterFirstStep() {
  return (
    <GenericStepContainer>
      <TextWrapper>
        <StepTitle>Adicione seu e-mail</StepTitle>
        <StepDescription>
          Seu e-mail vai servir pra criar sua conta e te mandar avisos e
          novidades do Remedim.
        </StepDescription>
      </TextWrapper>
      <InputsWrapper>
        <StyledTextInput
          placeholder="E-mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </InputsWrapper>
    </GenericStepContainer>
  );
}
