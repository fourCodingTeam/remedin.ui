import styled, { css } from "styled-components/native";
import { theme } from "@/constants/theme";
import type { ButtonVariant } from "./Button.types";

export const sizeStyles = {
  sm: css`
    padding: ${theme.sizes[2]} ${theme.sizes[3]};
  `,
  md: css`
    padding: ${theme.sizes[3]} ${theme.sizes[4]};
  `,
  lg: css`
    padding: ${theme.sizes[4]} ${theme.sizes[5]};
  `,
};

export const ButtonWrapper = styled.TouchableOpacity<{
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: ButtonVariant;
}>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  ${({ fullWidth }) => fullWidth && "width: 100%;"}
  ${({ size = "md" }) => sizeStyles[size]}

  ${({ variant = "primary" }) => {
    const colors = theme.colors;

    const variants = {
      black: css`
        background-color: ${colors.common.black};
      `,
      primary: css`
        background-color: ${colors.accent.primary};
      `,
      secondary: css`
        background-color: ${colors.accent.secondary};
      `,
      danger: css`
        background-color: ${colors.warnings.danger};
      `,
      neutral: css`
        background-color: ${colors.border.muted};
        border-width: 1px;
        border-color: ${colors.border.default};
      `,
      outline: css`
        background-color: transparent;
        border-width: 1px;
        border-color: ${colors.border.default};
      `,
      empty: css`
        background-color: transparent;
      `,
    };

    return variants[variant];
  }}

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.6;
    `}
`;
