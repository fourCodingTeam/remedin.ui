import { theme } from "@/constants/theme";
import styled from "styled-components/native";

export const TagWrapper = styled.TouchableOpacity<{
  isSelected?: boolean;
  disabled?: boolean;
}>`
  background-color: ${({ isSelected, disabled }) =>
    disabled
      ? theme.colors.border.muted
      : isSelected
      ? theme.colors.accent.primary
      : theme.colors.background.default};
  border: ${({ isSelected, disabled }) =>
    disabled
      ? `1px solid ${theme.colors.border.muted}`
      : isSelected
      ? `1px solid ${theme.colors.accent.primary}`
      : `1px solid ${theme.colors.border.default}`};
  border-radius: ${theme.sizes[5]};

  padding: ${theme.sizes[3]};

`;
