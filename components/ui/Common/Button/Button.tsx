import { ActivityIndicator } from "react-native";
import { theme } from "@/constants/theme";
import { StyledText } from "../StyledText";
import type { StyledTextColor } from "../StyledText/StyledText.types";
import { ButtonWrapper } from "./Button.styles";
import type { ButtonProps, ButtonSize, ButtonVariant } from "./Button.types";

const iconSizes: Record<ButtonSize, number> = {
  sm: 16,
  md: 18,
  lg: 20,
};

const getColorValueByStyledTextColor = (color: StyledTextColor) => {
  switch (color) {
    case "muted":
      return theme.colors.text.muted;
    case "black":
      return theme.colors.common.black;
    case "light":
      return theme.colors.background.light;
    case "dark":
    case "default":
      return theme.colors.text.default;
    case "error":
      return theme.colors.warnings.danger;
    default:
      return theme.colors.text.default;
  }
};

export function Button({
  label,
  isLoading,
  disabled,
  variant,
  size,
  fullWidth,
  textSize,
  textColor,
  icon,
  onPress,
  ...rest
}: ButtonProps) {
  const getTextColorByButtonVariant = (variant: ButtonVariant) => {
    switch (variant) {
      case "empty":
      case "black":
      case "danger":
      case "secondary":
        return "light";
      case "outline":
      case "primary":
        return "dark";
      case "neutral":
        return "muted";
      default:
        return "dark";
    }
  };

  const resolvedVariant = variant || "primary";
  const resolvedButtonSize = size || "md";
  const resolvedTextColor =
    textColor || getTextColorByButtonVariant(resolvedVariant);
  const iconColor = getColorValueByStyledTextColor(resolvedTextColor);
  const IconComponent = icon;

  return (
    <ButtonWrapper
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      onPress={onPress}
      size={size}
      variant={variant}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {IconComponent ? (
            <IconComponent
              color={iconColor}
              size={iconSizes[resolvedButtonSize]}
            />
          ) : null}
          <StyledText color={resolvedTextColor} variant={textSize}>
            {label}
          </StyledText>
        </>
      )}
    </ButtonWrapper>
  );
}
