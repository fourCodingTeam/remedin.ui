import type { ImageSourcePropType, TouchableOpacityProps } from "react-native";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarStatus = "online" | "offline" | "busy" | "away" | "none";

export interface AvatarProps extends TouchableOpacityProps {
  name?: string;
  source?: ImageSourcePropType;
  size?: AvatarSize;
  bordered?: boolean;
  fallbackBackgroundColor?: string;
  status?: AvatarStatus;
  statusColor?: string;
  onPress?: TouchableOpacityProps["onPress"];
}
