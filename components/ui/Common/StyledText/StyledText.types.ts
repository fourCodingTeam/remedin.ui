export type StyledTextVariant =
  | "smallRegular"
  | "smallSemiBold"
  | "smallBold"
  | "mediumRegular"
  | "mediumSemiBold"
  | "mediumBold"
  | "largeRegular"
  | "largeSemiBold"
  | "largeBold"
  | "largestRegular"
  | "largestSemiBold"
  | "largestBold";

export type StyledTextColor =
  | "default"
  | "muted"
  | "black"
  | "light"
  | "dark"
  | "error";

export type StyledTextProps = {
  variant?: StyledTextVariant;
  color?: StyledTextColor;
  children: React.ReactNode;
  style?: object;
};
