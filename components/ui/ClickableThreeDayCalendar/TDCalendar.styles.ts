import styled, { css } from "styled-components/native";
import { theme } from "@/constants/theme";

export const TDCalendarWrapper = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: ${theme.sizes[2]};
`;

export const TDCalendarDay = styled.TouchableOpacity<{ isSelected?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${theme.sizes[4]} 0;
  border-width: 1px;
  border-color: ${theme.colors.border.default};
  border-radius: ${theme.sizes[2]};
  ${({ isSelected }) =>
    isSelected &&
    css`
    background-color: ${theme.colors.accent.primary};
    border-color: ${theme.colors.accent.primary};
  `}
`;
