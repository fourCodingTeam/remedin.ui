import type { TouchableOpacityProps } from "react-native";
import styled, { css } from "styled-components/native";
import { theme } from "@/constants/theme";
import type { AvatarSize } from "./Avatar.types";

export const avatarSizes: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
};

export const statusSizes: Record<AvatarSize, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 16,
};

export const AvatarContainer = styled.View<{
  size: AvatarSize;
  hasImage: boolean;
  bordered?: boolean;
  fallbackBackgroundColor?: string;
  onPress?: TouchableOpacityProps["onPress"];
}>`
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  ${({ size }) => css`
    width: ${avatarSizes[size]}px;
    height: ${avatarSizes[size]}px;
    border-radius: ${avatarSizes[size] / 2}px;
  `}

  background-color: ${({ hasImage, fallbackBackgroundColor }) =>
    hasImage
      ? "transparent"
      : fallbackBackgroundColor || theme.colors.accent.primary};

  ${({ bordered }) =>
    bordered &&
    css`
      border-width: 2px;
      border-color: ${theme.colors.background.light};
    `}
`;

export const AvatarImage = styled.Image<{ size: AvatarSize }>`
  width: ${({ size }) => avatarSizes[size]}px;
  height: ${({ size }) => avatarSizes[size]}px;
`;

export const StatusBadge = styled.View<{
  size: AvatarSize;
  statusColor: string;
}>`
  position: absolute;
  bottom: 0;
  right: 0;
  border-width: 2px;
  border-color: ${theme.colors.background.light};

  ${({ size, statusColor }) => css`
    width: ${statusSizes[size]}px;
    height: ${statusSizes[size]}px;
    border-radius: ${statusSizes[size] / 2}px;
    background-color: ${statusColor};
  `}
`;
