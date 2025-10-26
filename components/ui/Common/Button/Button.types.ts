import FontAwesome from "@expo/vector-icons/FontAwesome";
import { TouchableOpacityProps } from "react-native";
import { StyledTextVariant } from "../StyledText/StyledText.types";

export type ButtonVariant =
  | "black"
  | "primary"
  | "secondary"
  | "danger"
  | "neutral"
  | "outline"
  | "empty";

export type ButtonSize = "sm" | "md" | "lg";

export type IconName = keyof typeof FontAwesome.glyphMap;

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  label: string;
  textSize?: StyledTextVariant;
  icon?: IconName;
}
