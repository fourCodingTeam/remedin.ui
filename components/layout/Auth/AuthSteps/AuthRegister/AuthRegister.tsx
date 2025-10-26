import { Button } from "@/components/ui/Common/Button"; //
import { Stepper } from "@/components/ui/Common/Stepper";
import React, { useState } from "react";
import { BottomContainer, ModalContent } from "../AuthModal.styles";
import { AuthRegisterProps } from "../AuthModal.types";

import { theme } from "@/constants/theme";
import { View } from "react-native";
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
          <Stepper steps={TOTAL_STEPS} currentStep={step} />
        </View>

        {renderStep()}
      </ModalContent>

      <BottomContainer>
        <Button
          label="Avançar"
          variant="black"
          fullWidth
          onPress={handleAdvance}
        />
        {step === TOTAL_STEPS && (
          <Button
            label="Pular"
            variant="empty"
            textColor="dark"
            fullWidth
            onPress={onClose}
          />
        )}
        {step === 1 && (
          <Button
            label="Já tem uma conta?"
            variant="empty"
            textColor="dark"
            fullWidth
            onPress={onNavigateToLogin}
          />
        )}
      </BottomContainer>
    </>
  );
}
