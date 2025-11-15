import { theme } from "@/constants/theme";
import { StyledText } from "../Common/StyledText";
import type { StyledTextColor } from "../Common/StyledText/StyledText.types";
import {
  CardHeader,
  CardWrapper,
  IconContainer,
  ValueContainer,
} from "./HealthInfoCard.styles";
import type {
  HealthInfoCardColor,
  HealthInfoCardProps,
} from "./HealthInfoCard.types";

const palette: Record<HealthInfoCardColor, string> = {
  primary: theme.colors.accent.primary,
  secondary: theme.colors.accent.secondary,
  danger: theme.colors.warnings.danger,
  warning: theme.colors.warnings.warning,
  info: theme.colors.warnings.info,
  light: theme.colors.background.light,
  dark: theme.colors.text.default,
};

const styledTextPalette: Record<StyledTextColor, string> = {
  default: theme.colors.text.default,
  muted: theme.colors.text.muted,
  black: theme.colors.common.black,
  light: theme.colors.background.light,
  dark: theme.colors.text.default,
  error: theme.colors.warnings.danger,
};

const getColorFromPalette = (color?: HealthInfoCardColor) =>
  color ? palette[color] : undefined;

const resolvePaletteColor = (
  color: HealthInfoCardColor | undefined,
  fallback: string
) => getColorFromPalette(color) ?? fallback;

const resolveOptionalPaletteColor = (color?: HealthInfoCardColor) =>
  getColorFromPalette(color);

const resolveTextColorToken = (
  token: StyledTextColor | undefined,
  fallback: StyledTextColor
): StyledTextColor => token ?? fallback;

const typeStyleDefaults: Record<
  HealthInfoCardProps["type"],
  Partial<
    Pick<
      HealthInfoCardProps,
      | "backgroundColor"
      | "textColor"
      | "secondaryTextColor"
      | "valueTextColor"
      | "color"
      | "borderColor"
    >
  >
> = {
  weight: {
    backgroundColor: "secondary",
    textColor: "light",
    secondaryTextColor: "light",
    valueTextColor: "light",
    color: "secondary",
  },
  height: {
    backgroundColor: "primary",
    textColor: "dark",
    secondaryTextColor: "dark",
    valueTextColor: "dark",
    color: "dark",
  },
  bloodPressure: {
    backgroundColor: "light",
    textColor: "dark",
    secondaryTextColor: "muted",
    valueTextColor: "dark",
    color: "info",
    borderColor: "info",
  },
  amountOfMedicine: {
    backgroundColor: "dark",
    textColor: "light",
    secondaryTextColor: "light",
    valueTextColor: "light",
    color: "warning",
  },
  bloodSugar: {
    backgroundColor: "light",
    textColor: "dark",
    secondaryTextColor: "muted",
    valueTextColor: "dark",
    color: "warning",
    borderColor: "info",
  },
  arterialPressure: {
    backgroundColor: "light",
    textColor: "dark",
    secondaryTextColor: "muted",
    valueTextColor: "dark",
    color: "info",
    borderColor: "info",
  },
};

export function HealthInfoCard({
  title,
  value,
  icon,
  color,
  unit,
  backgroundColor,
  textColor,
  secondaryTextColor,
  valueTextColor,
  borderColor,
  type,
}: HealthInfoCardProps) {
  const defaults = typeStyleDefaults[type];

  const resolvedBackground = resolvePaletteColor(
    backgroundColor ?? defaults?.backgroundColor,
    theme.colors.background.light
  );

  const titleColorToken = resolveTextColorToken(
    textColor ?? defaults?.textColor,
    "dark"
  );
  const unitColorToken = resolveTextColorToken(
    secondaryTextColor ?? defaults?.secondaryTextColor,
    "muted"
  );
  const valueColorToken = resolveTextColorToken(
    valueTextColor ?? defaults?.valueTextColor,
    titleColorToken
  );

  const resolvedBorderColor = resolveOptionalPaletteColor(
    borderColor ?? defaults?.borderColor
  );
  const accentColor = getColorFromPalette(color ?? defaults?.color);
  const resolvedIconBackground =
    accentColor ?? styledTextPalette[titleColorToken];

  return (
    <CardWrapper
      backgroundColor={resolvedBackground}
      borderColor={resolvedBorderColor}
    >
      <CardHeader>
        <StyledText color={titleColorToken} variant="mediumRegular">
          {title}
        </StyledText>
        {icon ? (
          <IconContainer backgroundColor={resolvedIconBackground}>
            {icon}
          </IconContainer>
        ) : null}
      </CardHeader>

      <ValueContainer>
        <StyledText color={valueColorToken} variant="largeBold">
          {value}
        </StyledText>
        {unit ? (
          <StyledText color={unitColorToken} variant="mediumRegular">
            {unit}
          </StyledText>
        ) : null}
      </ValueContainer>
    </CardWrapper>
  );
}
