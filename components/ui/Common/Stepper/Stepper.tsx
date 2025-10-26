import React from "react";
import { StepperContainer, StepSegment } from "./Stepper.styles";
import { StepperProps } from "./Stepper.types";

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  const totalSteps = Math.max(1, steps);

  const clampedCurrentStep = Math.max(0, Math.min(currentStep, totalSteps));

  const stepSegments = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <StepperContainer>
      {stepSegments.map((index) => {
        const isActive = index + 1 <= clampedCurrentStep;

        return <StepSegment key={index} isActive={isActive} />;
      })}
    </StepperContainer>
  );
};
