import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const IconWrapper = styled.View<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${theme.sizes[1]};

  background-color: ${theme.colors.common.black};
  border: ${({ isActive }) => (isActive ? `1px solid ${theme.colors.accent.primary}` : "none")};
  border-radius: ${theme.sizes[4]};

  width: 100%;
  height: 150%;
`;

export const StyledTabBarLabel = styled.Text<{ isActive: boolean }>`
  color: ${({ isActive }) =>
    isActive ? theme.colors.accent.primary : theme.colors.background.light};
  font-family: ${theme.fonts.regular};
  width: 100%;
  font-size: 12px;
  text-align: center;
`;
