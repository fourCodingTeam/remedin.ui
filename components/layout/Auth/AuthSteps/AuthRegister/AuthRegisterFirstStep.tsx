import { InputBase } from "@/components/ui";
import { StyledText } from "@/components/ui/Common/StyledText";
import { RegisterFirstStepFormData, registerFirstStepSchema } from "@/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  GenericStepContainer,
  InputsWrapper,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";

export default function AuthRegisterFirstStep() {
  const {
    control,
    formState: { errors }
  } = useForm<RegisterFirstStepFormData>({
    resolver: zodResolver(registerFirstStepSchema),
    defaultValues: {
      email: ""
    }
  });

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
                <StyledText variant="smallRegular" color="muted">
                  {errors.email.message}
                </StyledText>
              )}
            </>
          )}
        />
      </InputsWrapper>
    </GenericStepContainer>
  );
}
