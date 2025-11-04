import { StyledTextVariants } from "./StyledText.styles";
import type { StyledTextProps } from "./StyledText.types";

export function StyledText({
  variant = "mediumRegular",
  color = "default",
  children,
  style,
}: StyledTextProps) {
  return (
    <StyledTextVariants color={color} style={style} variant={variant}>
      {children}
    </StyledTextVariants>
  );
}
