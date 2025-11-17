import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { signUp } from "@/auth/signUp";
import { InputBase, InputDate, Stepper } from "@/components/ui";
import { Button } from "@/components/ui/Common/Button";
import { StyledText } from "@/components/ui/Common/StyledText";
import { useToast } from "@/components/ui/Toast";
import { theme } from "@/constants/theme";
import { GetCurrentPerson } from "@/services/api/person";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useUserStore } from "@/stores";
import { type RegisterFormData, registerSchema } from "@/validators";
import {
  BottomContainer,
  GenericStepContainer,
  InputsWrapper,
  ModalContent,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";
import type { AuthRegisterProps } from "../AuthModal.types";

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) {
    return err.message;
  }
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Erro ao criar conta. Tente novamente.";
};

export function AuthRegister({ onClose }: AuthRegisterProps) {
  const { setIsLoggedIn, setEmail, setUsername, setToken, setPersonData } =
    useUserStore();
  const { showToast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step, setStep] = useState(1);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      userName: "",
      phone: "",
      birthDate: undefined,
      weightKg: undefined,
      heightCm: undefined,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleNextStep = async () => {
    const isValid = await trigger([
      "email",
      "userName",
      "password",
      "confirmPassword",
    ]);
    if (isValid) {
      setStep(2);
    } else {
      showToast("Por favor, preencha todos os campos corretamente", "error");
    }
  };

  const handleBackStep = () => {
    setStep(1);
  };

  const handleRegisterPress = handleSubmit(
    async (data) => {
      try {
        setAuthError(null);
        setIsSubmitting(true);

        await signUp(
          data.email,
          data.password,
          data.name,
          data.userName,
          data.birthDate,
          data.phone,
          data.weightKg,
          data.heightCm
        );

        // Get token and fetch person data
        const token = await getAuthToken();
        if (token) {
          setToken(token);
          setEmail(data.email);

          // Get person data from backend
          const personResponse = await GetCurrentPerson(token);
          if (personResponse.success && personResponse.data) {
            setPersonData({
              id: personResponse.data.id,
              name: personResponse.data.name,
              email: personResponse.data.email,
              username: personResponse.data.username,
              phone: personResponse.data.phone,
              birthDate: personResponse.data.birthDate,
              weightKg: personResponse.data.weightKg,
              heightCm: personResponse.data.heightCm,
            });
          } else {
            // Fallback to form data if backend call fails
            setUsername(data.userName);
          }
        } else {
          // Fallback if token is not available
          setEmail(data.email);
          setUsername(data.userName);
        }

        setIsLoggedIn(true);
        showToast("Conta criada com sucesso!", "success");
        onClose();
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setAuthError(errorMessage);
        showToast(errorMessage, "error");
      } finally {
        setIsSubmitting(false);
      }
    },
    (validationErrors) => {
      const firstError = Object.values(validationErrors)[0];
      if (firstError?.message) {
        showToast(firstError.message, "error");
      } else {
        showToast("Por favor, preencha todos os campos corretamente", "error");
      }
    }
  );

  return (
    <>
      <ModalContent>
        {step === 1 && (
          <GenericStepContainer>
            <TextWrapper>
              <Stepper currentStep={step} steps={2} />
              <StepTitle>Crie sua conta</StepTitle>
              <StepDescription>
                Preencha seus dados de acesso e personalize seus lembretes.
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

              <Controller
                control={control}
                name="userName"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      autoCapitalize="none"
                      compact
                      onChangeText={onChange}
                      placeholder="Apelido"
                      prefixIcon="user"
                      value={value}
                    />
                    {errors.userName && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.userName.message}
                      </StyledText>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      onChangeText={onChange}
                      placeholder="Senha"
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
                      placeholder="Confirme a senha"
                      prefixIcon="lock"
                      secureTextEntry
                      value={value}
                    />
                    {errors.confirmPassword && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.confirmPassword.message}
                      </StyledText>
                    )}
                  </>
                )}
              />
            </InputsWrapper>

            {authError && (
              <StyledText
                color="error"
                style={{ marginTop: theme.sizes[3] }}
                variant="mediumRegular"
              >
                {authError}
              </StyledText>
            )}
          </GenericStepContainer>
        )}

        {step === 2 && (
          <GenericStepContainer>
            <TextWrapper>
              <Stepper currentStep={step} steps={2} />
              <StepTitle>Informações pessoais</StepTitle>
              <StepDescription>
                Preencha seus dados pessoais para começar a usar o aplicativo.
              </StepDescription>
            </TextWrapper>

            <InputsWrapper>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      onChangeText={onChange}
                      placeholder="Informe seu nome"
                      prefixIcon="user"
                      value={value}
                    />
                    {errors.name && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.name.message}
                      </StyledText>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      keyboardType="phone-pad"
                      onChangeText={onChange}
                      placeholder="Informe seu telefone"
                      prefixIcon="phone"
                      value={value}
                    />
                    {errors.phone && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.phone.message}
                      </StyledText>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputDate
                      onChange={onChange}
                      placeholder="Data de Nascimento"
                      value={value}
                    />
                    {errors.birthDate && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.birthDate.message}
                      </StyledText>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="weightKg"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      keyboardType="decimal-pad"
                      onChangeText={(text) => {
                        const numValue =
                          text.trim() === ""
                            ? undefined
                            : Number.parseFloat(text);
                        onChange(Number.isNaN(numValue) ? undefined : numValue);
                      }}
                      placeholder="Informe seu peso em kg (opcional)"
                      prefixIcon="balance-scale"
                      value={value ? String(value) : ""}
                    />
                    {errors.weightKg && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.weightKg.message}
                      </StyledText>
                    )}
                  </>
                )}
              />

              <Controller
                control={control}
                name="heightCm"
                render={({ field: { onChange, value } }) => (
                  <>
                    <InputBase
                      compact
                      keyboardType="number-pad"
                      onChangeText={(text) => {
                        const numValue =
                          text.trim() === ""
                            ? undefined
                            : Number.parseFloat(text);
                        onChange(Number.isNaN(numValue) ? undefined : numValue);
                      }}
                      placeholder="Informe sua altura em cm (opcional)"
                      prefixIcon="arrows-alt"
                      value={value ? String(value) : ""}
                    />
                    {errors.heightCm && (
                      <StyledText color="error" variant="mediumRegular">
                        {errors.heightCm.message}
                      </StyledText>
                    )}
                  </>
                )}
              />
            </InputsWrapper>

            {authError && (
              <StyledText
                color="error"
                style={{ marginTop: theme.sizes[3] }}
                variant="mediumRegular"
              >
                {authError}
              </StyledText>
            )}
          </GenericStepContainer>
        )}
      </ModalContent>

      <BottomContainer>
        {step === 1 ? (
          <Button
            disabled={isSubmitting}
            fullWidth
            label="Próximo"
            onPress={handleNextStep}
            variant="black"
          />
        ) : (
          <>
            <Button
              disabled={isSubmitting}
              fullWidth
              isLoading={isSubmitting}
              label="Criar conta"
              onPress={handleRegisterPress}
              variant="black"
            />
            <Button
              disabled={isSubmitting}
              fullWidth
              label="Voltar"
              onPress={handleBackStep}
              textColor="dark"
              variant="empty"
            />
          </>
        )}
      </BottomContainer>
    </>
  );
}
