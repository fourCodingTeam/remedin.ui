import React from "react";
import { StyledTextVariants } from "./StyledText.styles";
import { StyledTextProps } from "./StyledText.types";

export function StyledText({
  variant = "mediumRegular",
  color = "default",
  children,
  style,
}: StyledTextProps) {
  return (
    <StyledTextVariants variant={variant} color={color} style={style}>
      {children}
    </StyledTextVariants>
  );
}