import React from "react";
import { ActivityIndicator } from "react-native";
import { StyledText } from "../StyledText";
import { ButtonWrapper } from "./Button.styles";
import { ButtonProps, ButtonVariant } from "./Button.types";

export function Button({
  label,
  isLoading,
  disabled,
  variant,
  size,
  fullWidth,
  textSize,
  icon,
}: ButtonProps) {
  const getTextColorByButtonVariant = (variant: ButtonVariant) => {
    switch (variant) {
      case "black":
      case "danger":
      case "secondary":
        return "light";
      case "empty":
      case "outline":
      case "primary":
        return "dark";
      case "neutral":
        return "muted";
    }
  };

  const renderIcon = (iconName: typeof icon) => {
    if (!iconName) return null;
    const IconComponent = require("@expo/vector-icons/FontAwesome").default;
    return <IconComponent name={iconName} size={16} color="#fff" />;
  };

  return (
    <ButtonWrapper
      disabled={disabled || isLoading}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          {renderIcon(icon)}
          <StyledText
            color={getTextColorByButtonVariant(variant || "primary")}
            variant={textSize}
          >
            {label}
          </StyledText>
        </>
      )}
    </ButtonWrapper>
  );
}
