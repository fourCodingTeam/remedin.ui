import { zodResolver } from "@hookform/resolvers/zod";
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

export default function AuthRegisterThirdStep() {
  const {
    control,
    formState: { errors },
  } = useForm<RegisterThirdStepFormData>({
    resolver: zodResolver(registerThirdStepSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
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
                compact
                onChangeText={onChange}
                placeholder="Sua senha"
                prefixIcon="lock"
                secureTextEntry
                value={value}
              />
              {errors.password && (
                <StyledText color="muted" variant="smallRegular">
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
                <StyledText color="muted" variant="smallRegular">
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
