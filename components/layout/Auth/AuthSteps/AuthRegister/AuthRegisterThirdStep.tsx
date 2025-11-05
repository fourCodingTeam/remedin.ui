import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputBase } from "@/components/ui";
import { StyledText } from "@/components/ui/Common/StyledText";
import {
  type RegisterThirdStepFormData,
  registerThirdStepSchema,
} from "@/validators";
import {
  GenericStepContainer,
  InputsWrapper,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";

export type AuthRegisterThirdStepRef = {
  validate: () => Promise<boolean>;
  getData: () => RegisterThirdStepFormData | null;
};

// biome-ignore lint: forwardRef is required for imperative handle pattern
const AuthRegisterThirdStep = forwardRef<AuthRegisterThirdStepRef>((_, ref) => {
  const {
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<RegisterThirdStepFormData>({
    resolver: zodResolver(registerThirdStepSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
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
                compact
                onChangeText={onChange}
                placeholder="Sua senha"
                prefixIcon="lock"
                secureTextEntry
                value={value}
              />
              {errors.password && (
                <StyledText color="error" variant="mediumRegular">
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
                compact
                onChangeText={onChange}
                placeholder="Confirme sua senha"
                prefixIcon="lock"
                secureTextEntry
                value={value}
              />
              {errors.confirmPassword && (
                <StyledText color="muted" variant="mediumRegular">
                  {errors.confirmPassword.message}
                </StyledText>
              )}
            </>
          )}
        />
      </InputsWrapper>
    </GenericStepContainer>
  );
});

AuthRegisterThirdStep.displayName = "AuthRegisterThirdStep";

export default AuthRegisterThirdStep;
