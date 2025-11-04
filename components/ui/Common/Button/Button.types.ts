import type FontAwesome from "@expo/vector-icons/FontAwesome";
import type { TouchableOpacityProps } from "react-native";
import type { StyledTextVariant } from "../StyledText/StyledText.types";

export type ButtonVariant =
  | "black"
  | "primary"
  | "secondary"
  | "danger"
  | "neutral"
  | "outline"
  | "empty";

export type ButtonSize = "sm" | "md" | "lg";

export type StyledTextColor = "default" | "muted" | "black" | "light" | "dark";

export type IconName = keyof typeof FontAwesome.glyphMap;

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  label: string;
  textSize?: StyledTextVariant;
  icon?: IconName;
  textColor?: StyledTextColor;
  onPress?: () => void;
}
