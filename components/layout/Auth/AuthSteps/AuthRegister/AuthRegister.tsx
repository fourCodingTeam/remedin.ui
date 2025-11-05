import { useRef, useState } from "react";
import { View } from "react-native";
import { signUp } from "@/auth/signUp";
import { Button } from "@/components/ui/Common/Button";
import { Stepper } from "@/components/ui/Common/Stepper";
import { StyledText } from "@/components/ui/Common/StyledText";
import { theme } from "@/constants/theme";
import { useUserStore } from "@/stores";
import type {
  RegisterFirstStepFormData,
  RegisterSecondStepFormData,
  RegisterThirdStepFormData,
} from "@/validators";
import { BottomContainer, ModalContent } from "../AuthModal.styles";
import type { AuthRegisterProps } from "../AuthModal.types";
import AuthRegisterFirstStep, {
  type AuthRegisterFirstStepRef,
} from "./AuthRegisterFirstStep";
import AuthRegisterFourthStep, {
  type AuthRegisterFourthStepRef,
} from "./AuthRegisterFourthStep";
import AuthRegisterSecondStep, {
  type AuthRegisterSecondStepRef,
} from "./AuthRegisterSecondStep";
import AuthRegisterThirdStep, {
  type AuthRegisterThirdStepRef,
} from "./AuthRegisterThirdStep";

const TOTAL_STEPS = 4;

export function AuthRegister({
  onClose,
  onNavigateToLogin,
}: AuthRegisterProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    firstStep?: RegisterFirstStepFormData;
    secondStep?: RegisterSecondStepFormData;
    thirdStep?: RegisterThirdStepFormData;
    fourthStep?: { selectedBefore: number[]; selectedAfter: number[] };
  }>({});

  const firstStepRef = useRef<AuthRegisterFirstStepRef>(null);
  const secondStepRef = useRef<AuthRegisterSecondStepRef>(null);
  const thirdStepRef = useRef<AuthRegisterThirdStepRef>(null);
  const fourthStepRef = useRef<AuthRegisterFourthStepRef>(null);

  const { setIsLoggedIn, setEmail, setUsername } = useUserStore();

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    setError(null);
  };

  const validateAndStoreStep1 = async () => {
    const result = await firstStepRef.current?.validate();
    if (result) {
      const stepData = firstStepRef.current?.getData();
      if (stepData) {
        setFormData((prev) => ({ ...prev, firstStep: stepData }));
      }
    }
    return result ?? false;
  };

  const validateAndStoreStep2 = async () => {
    const result = await secondStepRef.current?.validate();
    if (result) {
      const stepData = secondStepRef.current?.getData();
      if (stepData) {
        setFormData((prev) => ({ ...prev, secondStep: stepData }));
      }
    }
    return result ?? false;
  };

  const validateAndStoreStep3 = async () => {
    const result = await thirdStepRef.current?.validate();
    if (result) {
      const stepData = thirdStepRef.current?.getData();
      if (stepData) {
        setFormData((prev) => ({ ...prev, thirdStep: stepData }));
      }
    }
    return result ?? false;
  };

  const validateAndStoreStep4 = async () => {
    const result = await fourthStepRef.current?.validate();
    if (result) {
      const stepData = fourthStepRef.current?.getData();
      if (stepData) {
        setFormData((prev) => ({
          ...prev,
          fourthStep: stepData,
        }));
      }
    }
    return result ?? false;
  };

  const validateAndStoreStep = async () => {
    switch (step) {
      case 1:
        return await validateAndStoreStep1();
      case 2:
        return await validateAndStoreStep2();
      case 3:
        return await validateAndStoreStep3();
      case 4:
        return await validateAndStoreStep4();
      default:
        return false;
    }
  };

  const handleAdvance = async () => {
    setError(null);

    if (step === TOTAL_STEPS) {
      await handleCompleteRegistration();
      return;
    }

    const isValid = await validateAndStoreStep();
    if (isValid) {
      nextStep();
    }
  };

  const getFormData = () => ({
    firstStep: formData.firstStep ?? firstStepRef.current?.getData(),
    secondStep: formData.secondStep ?? secondStepRef.current?.getData(),
    thirdStep: formData.thirdStep ?? thirdStepRef.current?.getData(),
  });

  const validateFormData = (
    firstStepData: RegisterFirstStepFormData | null | undefined,
    secondStepData: RegisterSecondStepFormData | null | undefined,
    thirdStepData: RegisterThirdStepFormData | null | undefined
  ): boolean => {
    if (!firstStepData) {
      setError("Por favor, preencha o e-mail.");
      return false;
    }

    if (!secondStepData) {
      setError("Por favor, preencha o usuário.");
      return false;
    }

    if (!thirdStepData) {
      setError("Por favor, preencha a senha.");
      return false;
    }

    return true;
  };

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      return err.message;
    }
    if (err && typeof err === "object" && "message" in err) {
      return String(err.message);
    }
    return "Erro ao criar conta. Tente novamente.";
  };

  const handleCompleteRegistration = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const formDataValues = getFormData();

      if (
        !validateFormData(
          formDataValues.firstStep,
          formDataValues.secondStep,
          formDataValues.thirdStep
        )
      ) {
        return;
      }

      // TypeScript narrowing: after validation, we know these are not null
      const firstStep = formDataValues.firstStep as RegisterFirstStepFormData;
      const secondStep =
        formDataValues.secondStep as RegisterSecondStepFormData;
      const thirdStep = formDataValues.thirdStep as RegisterThirdStepFormData;

      await signUp(firstStep.email, thirdStep.password);

      setEmail(firstStep.email);
      setUsername(secondStep.username);
      setIsLoggedIn(true);

      onClose();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AuthRegisterFirstStep ref={firstStepRef} />;
      case 2:
        return <AuthRegisterSecondStep ref={secondStepRef} />;
      case 3:
        return <AuthRegisterThirdStep ref={thirdStepRef} />;
      case 4:
        return <AuthRegisterFourthStep ref={fourthStepRef} />;
      default:
        return null;
    }
  };

  return (
    <>
      <ModalContent>
        <View style={{ gap: theme.sizes[4] }}>
          <Stepper currentStep={step} steps={TOTAL_STEPS} />
        </View>

        {renderStep()}

        {error && (
          <StyledText
            color="error"
            style={{ marginTop: theme.sizes[2] }}
            variant="mediumRegular"
          >
            {error}
          </StyledText>
        )}
      </ModalContent>

      <BottomContainer>
        <Button
          disabled={isSubmitting}
          fullWidth
          isLoading={isSubmitting}
          label={step === TOTAL_STEPS ? "Finalizar" : "Avançar"}
          onPress={handleAdvance}
          variant="black"
        />
        {step === TOTAL_STEPS && (
          <Button
            disabled={isSubmitting}
            fullWidth
            label="Pular"
            onPress={handleAdvance}
            textColor="dark"
            variant="empty"
          />
        )}
        {step === 1 && (
          <Button
            disabled={isSubmitting}
            fullWidth
            label="Já tem uma conta?"
            onPress={onNavigateToLogin}
            textColor="dark"
            variant="empty"
          />
        )}
      </BottomContainer>
    </>
  );
}
