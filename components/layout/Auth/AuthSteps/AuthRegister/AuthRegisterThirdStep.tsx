import { InputBase } from "@/components/ui";
import { StyledText } from "@/components/ui/Common/StyledText";
import { RegisterThirdStepFormData, registerThirdStepSchema } from "@/validators";
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

export default function AuthRegisterThirdStep() {
  const {
    control,
    formState: { errors }
  } = useForm<RegisterThirdStepFormData>({
    resolver: zodResolver(registerThirdStepSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

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
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <>
              <InputBase
                placeholder="Sua senha"
                secureTextEntry
                prefixIcon="lock"
                compact
                value={value}
                onChangeText={onChange}
              />
              {errors.password && (
                <StyledText variant="smallRegular" color="muted">
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
                placeholder="Confirme sua senha"
                secureTextEntry
                prefixIcon="lock"
                compact
                value={value}
                onChangeText={onChange}
              />
              {errors.confirmPassword && (
                <StyledText variant="smallRegular" color="muted">
                  {errors.confirmPassword.message}
                </StyledText>
              )}
            </>
          )}
        />
      </InputsWrapper>
    </GenericStepContainer>
  );
}
