import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
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

export type AuthRegisterSecondStepRef = {
  validate: () => Promise<boolean>;
  getData: () => RegisterSecondStepFormData | null;
};

// biome-ignore lint: forwardRef is required for imperative handle pattern
const AuthRegisterSecondStep = forwardRef<AuthRegisterSecondStepRef>(
  (_, ref) => {
    const {
      control,
      formState: { errors },
      trigger,
      getValues,
    } = useForm<RegisterSecondStepFormData>({
      resolver: zodResolver(registerSecondStepSchema),
      defaultValues: {
        username: "",
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
                  <StyledText color="error" variant="mediumRegular">
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
);

AuthRegisterSecondStep.displayName = "AuthRegisterSecondStep";

export default AuthRegisterSecondStep;
