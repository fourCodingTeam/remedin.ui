import { theme } from "@/constants/theme";
import styled, { css } from "styled-components/native";
import { ButtonVariant } from "./Button.types";

export const sizeStyles = {
  sm: css`
    padding-vertical: 8px;
    padding-horizontal: 12px;
  `,
  md: css`
    padding-vertical: 12px;
    padding-horizontal: 16px;
  `,
  lg: css`
    padding-vertical: 16px;
    padding-horizontal: 20px;
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
