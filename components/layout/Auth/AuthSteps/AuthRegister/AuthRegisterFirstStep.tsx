import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputBase } from "@/components/ui";
import { StyledText } from "@/components/ui/Common/StyledText";
import {
  type RegisterFirstStepFormData,
  registerFirstStepSchema,
} from "@/validators";
import {
  GenericStepContainer,
  InputsWrapper,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";

export type AuthRegisterFirstStepRef = {
  validate: () => Promise<boolean>;
  getData: () => RegisterFirstStepFormData | null;
};

// biome-ignore lint: forwardRef is required for imperative handle pattern
const AuthRegisterFirstStep = forwardRef<AuthRegisterFirstStepRef>((_, ref) => {
  const {
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<RegisterFirstStepFormData>({
    resolver: zodResolver(registerFirstStepSchema),
    defaultValues: {
      email: "",
    },
  });

  useImperativeHandle(ref, () => ({
    validate: async () => {
      const isValid = await trigger();
      return isValid;
    },
    getData: () => {
      const isValid = Object.keys(errors).length === 0;
      return isValid ? getValues() : null;
    },
  }));

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
      </InputsWrapper>
    </GenericStepContainer>
  );
});

AuthRegisterFirstStep.displayName = "AuthRegisterFirstStep";

export default AuthRegisterFirstStep;
