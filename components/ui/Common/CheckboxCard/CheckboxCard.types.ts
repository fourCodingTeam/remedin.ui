import type { StyleProp, ViewStyle } from "react-native";
import type { StyledTextColor } from "../StyledText/StyledText.types";

export type CheckboxCardTone = "neutral" | "primary" | "secondary" | "danger";

export type CheckboxCardRenderProps = {
  checked: boolean;
  textColor: StyledTextColor;
  secondaryTextColor: StyledTextColor;
};

export type CheckboxCardProps = {
  value: string;
  tone?: CheckboxCardTone;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string, checked: boolean) => void;
  onPress?: (value: string, checked: boolean) => void;
  renderRightAccessory?: (context: CheckboxCardRenderProps) => React.ReactNode;
  children: (context: CheckboxCardRenderProps) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
};
