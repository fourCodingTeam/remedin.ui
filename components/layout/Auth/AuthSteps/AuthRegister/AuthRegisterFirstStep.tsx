import { zodResolver } from "@hookform/resolvers/zod";
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

export default function AuthRegisterFirstStep() {
  const {
    control,
    formState: { errors },
  } = useForm<RegisterFirstStepFormData>({
    resolver: zodResolver(registerFirstStepSchema),
    defaultValues: {
      email: "",
    },
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
                autoCapitalize="none"
                compact
                keyboardType="email-address"
                onChangeText={onChange}
                placeholder="E-mail"
                prefixIcon="envelope"
                value={value}
              />
              {errors.email && (
                <StyledText color="muted" variant="smallRegular">
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
