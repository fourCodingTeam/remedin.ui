import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InputBase } from "@/components/ui";
import { StyledText } from "@/components/ui/Common/StyledText";
import {
  type RegisterSecondStepFormData,
  registerSecondStepSchema,
} from "@/validators";
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
    formState: { errors },
  } = useForm<RegisterSecondStepFormData>({
    resolver: zodResolver(registerSecondStepSchema),
    defaultValues: {
      username: "",
    },
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
                autoCapitalize="none"
                compact
                onChangeText={onChange}
                placeholder="Seu novo usuário"
                prefixIcon="user"
                value={value}
              />
              {errors.username && (
                <StyledText color="muted" variant="smallRegular">
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
