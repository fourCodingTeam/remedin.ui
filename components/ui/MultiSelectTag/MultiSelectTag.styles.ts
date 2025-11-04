import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const TagWrapper = styled.TouchableOpacity<{
  isSelected?: boolean;
  disabled?: boolean;
}>`
  background-color: ${({ isSelected, disabled }) =>
    (disabled && theme.colors.border.muted) ||
    (isSelected && theme.colors.accent.primary) ||
    theme.colors.background.default};

  border: 1px solid
    ${({ isSelected, disabled }) =>
      (disabled && theme.colors.border.muted) ||
      (isSelected && theme.colors.accent.primary) ||
      theme.colors.border.default};

  border-radius: ${theme.sizes[5]};
  padding: ${theme.sizes[3]};
`;
