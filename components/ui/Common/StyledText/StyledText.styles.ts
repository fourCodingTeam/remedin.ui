import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const StyledTextVariants = styled.Text<{
  variant: string;
  color: string;
}>`
  font-family: ${({ variant }) => {
    if (variant.includes("SemiBold")) {
      return theme.fonts.semiBold;
    }
    if (variant.includes("Bold")) {
      return theme.fonts.bold;
    }
    return theme.fonts.regular;
  }};

  font-size: ${({ variant }) => {
    if (variant.startsWith("small")) {
      return theme.sizes[3];
    }
    if (variant.startsWith("medium")) {
      return theme.sizes[4];
    }
    if (variant.startsWith("largest")) {
      return theme.sizes[8];
    }
    if (variant.startsWith("large")) {
      return theme.sizes[6];
    }
    return theme.sizes["4"];
  }};

  color: ${({ color }) => {
    switch (color) {
      case "muted":
        return theme.colors.text.muted;
      case "black":
        return theme.colors.common.black;
      case "light":
        return theme.colors.background.light;
      case "dark":
        return theme.colors.text.default;
      case "error":
        return theme.colors.warnings.danger;
      default:
        return theme.colors.text.default;
    }
  }};
`;
