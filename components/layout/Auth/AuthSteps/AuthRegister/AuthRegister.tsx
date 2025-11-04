import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Common/Button"; //
import { Stepper } from "@/components/ui/Common/Stepper";
import { theme } from "@/constants/theme";
import { BottomContainer, ModalContent } from "../AuthModal.styles";
import type { AuthRegisterProps } from "../AuthModal.types";
import AuthRegisterFirstStep from "./AuthRegisterFirstStep";
import AuthRegisterFourthStep from "./AuthRegisterFourthStep";
import AuthRegisterSecondStep from "./AuthRegisterSecondStep";
import AuthRegisterThirdStep from "./AuthRegisterThirdStep";

const TOTAL_STEPS = 4;

export function AuthRegister({
  onClose,
  onNavigateToLogin,
}: AuthRegisterProps) {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const handleAdvance = () => {
    if (step === TOTAL_STEPS) {
      // ... lógica de finalizar cadastro ...
      onClose();
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AuthRegisterFirstStep />;
      case 2:
        return <AuthRegisterSecondStep />;
      case 3:
        return <AuthRegisterThirdStep />;
      case 4:
        return <AuthRegisterFourthStep />;
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
      </ModalContent>

      <BottomContainer>
        <Button
          fullWidth
          label="Avançar"
          onPress={handleAdvance}
          variant="black"
        />
        {step === TOTAL_STEPS && (
          <Button
            fullWidth
            label="Pular"
            onPress={onClose}
            textColor="dark"
            variant="empty"
          />
        )}
        {step === 1 && (
          <Button
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
