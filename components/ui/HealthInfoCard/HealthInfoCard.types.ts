export type HealthInfoCardColor =
  | "primary"
  | "secondary"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark";

import type { StyledTextColor } from "../Common/StyledText/StyledText.types";

export type HealthInfoCardProps = {
  title: string;
  value: string;
  icon?: React.ReactNode;
  type:
    | "weight"
    | "height"
    | "bloodPressure"
    | "amountOfMedicine"
    | "bloodSugar"
    | "arterialPressure";
  unit?: "kg" | "cm" | "mmHg" | "mg" | "mmol/L" | "bpm" | "mg/dL";
  color?: HealthInfoCardColor;
  backgroundColor?: HealthInfoCardColor;
  textColor?: StyledTextColor;
  secondaryTextColor?: StyledTextColor;
  valueTextColor?: StyledTextColor;
  borderColor?: HealthInfoCardColor;
  isLoading?: boolean;
  onPress?: () => void;
};
