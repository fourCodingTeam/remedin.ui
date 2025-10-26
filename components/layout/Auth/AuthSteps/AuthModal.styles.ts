import { StyledText } from "@/components/ui";
import { theme } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import styled from "styled-components/native";

export const ModalView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background.light};
`;

export const ModalContent = styled.View`
  flex: 1;
  padding: ${theme.sizes[4]};
`;

export const BottomContainer = styled.View`
  padding: ${theme.sizes[4]};
  gap: ${theme.sizes[3]};
`;

export const GenericStepContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[4]};
  padding-top: ${theme.sizes[4]};
`;

export const TextWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[1]};
`;

export const StepTitle = styled(StyledText).attrs({
  variant: "largestBold",
  color: "black",
})``;

export const StepDescription = styled(StyledText).attrs({
  variant: "mediumRegular",
  color: "muted",
})``;

export const InputsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
`

export const StyledTextInput = styled.TextInput`
  border: 1px solid ${theme.colors.border.default};
  background-color: ${theme.colors.background.light};
  border-radius: ${theme.sizes[2]};
  padding: ${theme.sizes[4]};
  font-size: ${theme.sizes[4]};
  font-family: ${theme.fonts.regular};
  color: ${theme.colors.text.default};
`;

export const TagRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.sizes[3]};
  margin-bottom: ${theme.sizes[6]};
`;
