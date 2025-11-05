import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const IconWrapper = styled.View<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${theme.sizes[1]};

  border-radius: ${theme.borderRadius[4]};
  background-color: ${({ isActive }) => (isActive ? theme.colors.accent.primary : "transparent")};

  width: 100%;
  height: 120%;
`;

export const StyledTabBarLabel = styled.Text<{ isActive: boolean }>`
  color: ${({ isActive }) =>
    isActive ? theme.colors.common.black : theme.colors.text.muted};
  font-family: ${theme.fonts.regular};
  width: 100%;
  font-size: 12px;
  text-align: center;
`;
