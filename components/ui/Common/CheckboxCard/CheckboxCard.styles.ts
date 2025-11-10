import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const CheckboxCardWrapper = styled.TouchableOpacity<{
  backgroundColor: string;
  borderColor: string;
  disabled?: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: ${theme.borderRadius[3]};
  padding: ${theme.sizes[4]};
  gap: ${theme.sizes[3]};
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const TextsWrapper = styled.View`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${theme.sizes[2]};
`;

export const Checkbox = styled.View<{
  backgroundColor: string;
  borderColor: string;
  checked?: boolean;
}>`
  width: ${theme.sizes[5]};
  height: ${theme.sizes[5]};
  border-radius: ${theme.borderRadius[1]};
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

export const MetaGroup = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
`;

export const MetaRow = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[1]};
  align-items: start;
`;

export const Badge = styled.View<{ backgroundColor?: string }>`
  padding: 2px ${theme.sizes[2]};
  border-radius: ${theme.borderRadius[1]};
  background-color: ${({ backgroundColor }) =>
    backgroundColor ?? theme.colors.accent.primary};
`;

export const BadgeWrapper = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.sizes[1]};
`;
