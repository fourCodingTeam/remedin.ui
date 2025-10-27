import { StyledText } from "@/components/ui/Common/StyledText";
import { MultiSelectTag } from "@/components/ui/MultiSelectTag";
import { theme } from "@/constants/theme";
import React, { useState } from "react";
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

export default function AuthRegisterFourthStep() {
  // CORREÇÃO: Alterado o estado para 'number[]' (array) para multiselect
  const [selectedBefore, setSelectedBefore] = useState<number[]>([]);
  const [selectedAfter, setSelectedAfter] = useState<number[]>([]);

  // CORREÇÃO: Handler para "Antes"
  const handleToggleBefore = (id: number) => {
    setSelectedBefore((prev) => {
      // Se o ID já está no array, remove
      if (prev.includes(id)) {
        return prev.filter((currentId) => currentId !== id);
      }
      // Se não, adiciona
      else {
        return [...prev, id];
      }
    });
  };

  // CORREÇÃO: Handler para "Depois"
  const handleToggleAfter = (id: number) => {
    setSelectedAfter((prev) => {
      // Se o ID já está no array, remove
      if (prev.includes(id)) {
        return prev.filter((currentId) => currentId !== id);
      }
      // Se não, adiciona
      else {
        return [...prev, id];
      }
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
        variant="mediumSemiBold"
        color="black"
        style={{ marginBottom: theme.sizes[4] }}
      >
        Antes de tomar o remédio, desde quando quer ser avisado?
      </StyledText>
      <TagRow>
        {beforeOptions.map((opt) => (
          <MultiSelectTag
            key={opt.id}
            id={opt.id}
            label={opt.label}
            isSelected={selectedBefore.includes(opt.id)}
            onPress={() => handleToggleBefore(opt.id)}
          />
        ))}
      </TagRow>

      <StyledText
        variant="mediumSemiBold"
        color="black"
        style={{ marginBottom: theme.sizes[4] }}
      >
        Se esquecer, quando gostaria de ser lembrado?
      </StyledText>
      <TagRow>
        {afterOptions.map((opt) => (
          <MultiSelectTag
            key={opt.id}
            id={opt.id}
            label={opt.label}
            isSelected={selectedAfter.includes(opt.id)}
            onPress={() => handleToggleAfter(opt.id)}
          />
        ))}
      </TagRow>
    </GenericStepContainer>
  );
}