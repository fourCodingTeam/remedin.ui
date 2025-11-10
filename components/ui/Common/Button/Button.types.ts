import type { LucideIcon } from "lucide-react-native";
import type { TouchableOpacityProps } from "react-native";
import type {
  StyledTextColor,
  StyledTextVariant,
} from "../StyledText/StyledText.types";

export type ButtonVariant =
  | "black"
  | "primary"
  | "secondary"
  | "danger"
  | "neutral"
  | "outline"
  | "empty";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  label: string;
  textSize?: StyledTextVariant;
  icon?: LucideIcon;
  textColor?: StyledTextColor;
  onPress?: () => void;
}
