import { InputBase } from "@/components/ui";
import { StyledText } from "@/components/ui/Common/StyledText";
import { RegisterSecondStepFormData, registerSecondStepSchema } from "@/validators";
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

export default function AuthRegisterSecondStep() {
  const {
    control,
    formState: { errors }
  } = useForm<RegisterSecondStepFormData>({
    resolver: zodResolver(registerSecondStepSchema),
    defaultValues: {
      username: ""
    }
  });

  return (
    <GenericStepContainer>
      <TextWrapper>
        <StepTitle>Crie seu usuário</StepTitle>
        <StepDescription>
          Seu usuário vai ser sua identificação daqui pra frente. Escolha um
          usuário divertido e fácil de lembrar!
        </StepDescription>
      </TextWrapper>
      <InputsWrapper>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <>
              <InputBase
                placeholder="Seu novo usuário"
                autoCapitalize="none"
                prefixIcon="user"
                compact
                value={value}
                onChangeText={onChange}
              />
              {errors.username && (
                <StyledText variant="smallRegular" color="muted">
                  {errors.username.message}
                </StyledText>
              )}
            </>
          )}
        />
      </InputsWrapper>
    </GenericStepContainer>
  );
}
