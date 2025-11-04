import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ActivityIndicator } from "react-native";
import { StyledText } from "../StyledText";
import { ButtonWrapper } from "./Button.styles";
import type { ButtonProps, ButtonVariant } from "./Button.types";

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

  const renderIcon = (iconName: typeof icon) => {
    if (!iconName) {
      return null;
    }
    return <FontAwesome color="#fff" name={iconName} size={16} />;
  };

  return (
    <ButtonWrapper
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      onPress={onPress}
      size={size}
      variant={variant}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {renderIcon(icon)}
          <StyledText
            color={
              textColor || getTextColorByButtonVariant(variant || "primary")
            }
            variant={textSize}
          >
            {label}
          </StyledText>
        </>
      )}
    </ButtonWrapper>
  );
}
