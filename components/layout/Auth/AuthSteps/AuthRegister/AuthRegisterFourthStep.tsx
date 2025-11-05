import { forwardRef, useImperativeHandle, useState } from "react";
import { StyledText } from "@/components/ui/Common/StyledText";
import { MultiSelectTag } from "@/components/ui/MultiSelectTag";
import { theme } from "@/constants/theme";
import {
  GenericStepContainer,
  StepDescription,
  StepTitle,
  TagRow,
  TextWrapper,
} from "../AuthModal.styles";

const beforeOptions = [
  { id: 1, label: "5 min" },
  { id: 2, label: "10 min" },
  { id: 3, label: "15 min" },
  { id: 4, label: "30 min" },
  { id: 5, label: "1 hora" },
];

const afterOptions = [
  { id: 6, label: "5 min" },
  { id: 7, label: "10 min" },
  { id: 8, label: "15 min" },
  { id: 9, label: "30 min" },
  { id: 10, label: "1 hora" },
];

export type AuthRegisterFourthStepRef = {
  validate: () => Promise<boolean>;
  getData: () => { selectedBefore: number[]; selectedAfter: number[] } | null;
};

// biome-ignore lint: forwardRef is required for imperative handle pattern
const AuthRegisterFourthStep = forwardRef<AuthRegisterFourthStepRef>(
  (_, ref) => {
    const [selectedBefore, setSelectedBefore] = useState<number[]>([]);
    const [selectedAfter, setSelectedAfter] = useState<number[]>([]);

    useImperativeHandle(ref, () => ({
      validate: () => {
        // Fourth step is optional, always valid
        return Promise.resolve(true);
      },
      getData: () => ({
        selectedBefore,
        selectedAfter,
      }),
    }));

    const handleToggleBefore = (id: number) => {
      setSelectedBefore((prev) => {
        if (prev.includes(id)) {
          return prev.filter((currentId) => currentId !== id);
        }
        return [...prev, id];
      });
    };

    const handleToggleAfter = (id: number) => {
      setSelectedAfter((prev) => {
        if (prev.includes(id)) {
          return prev.filter((currentId) => currentId !== id);
        }
        return [...prev, id];
      });
    };

    return (
      <GenericStepContainer>
        <TextWrapper>
          <StepTitle>Defina seus lembretes</StepTitle>
          <StepDescription>
            Escolha aqui o intervalo em que seus lembretes vão soar!
          </StepDescription>
        </TextWrapper>

        <StyledText
          color="black"
          style={{ marginBottom: theme.sizes[4] }}
          variant="mediumSemiBold"
        >
          Antes de tomar o remédio, desde quando quer ser avisado?
        </StyledText>
        <TagRow>
          {beforeOptions.map((opt) => (
            <MultiSelectTag
              id={opt.id}
              isSelected={selectedBefore.includes(opt.id)}
              key={opt.id}
              label={opt.label}
              onPress={() => handleToggleBefore(opt.id)}
            />
          ))}
        </TagRow>

        <StyledText
          color="black"
          style={{ marginBottom: theme.sizes[4] }}
          variant="mediumSemiBold"
        >
          Se esquecer, quando gostaria de ser lembrado?
        </StyledText>
        <TagRow>
          {afterOptions.map((opt) => (
            <MultiSelectTag
              id={opt.id}
              isSelected={selectedAfter.includes(opt.id)}
              key={opt.id}
              label={opt.label}
              onPress={() => handleToggleAfter(opt.id)}
            />
          ))}
        </TagRow>
      </GenericStepContainer>
    );
  }
);

AuthRegisterFourthStep.displayName = "AuthRegisterFourthStep";

export default AuthRegisterFourthStep;
