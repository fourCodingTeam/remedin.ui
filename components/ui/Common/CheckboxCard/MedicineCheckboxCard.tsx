import type { StyleProp, ViewStyle } from "react-native";
import { StyledText } from "../StyledText";
import { CheckboxCard } from "./CheckboxCard";
import { TextsWrapper } from "./CheckboxCard.styles";
import type { CheckboxCardTone } from "./CheckboxCard.types";

export type MedicineCheckboxCardProps = {
  value: string;
  title: string;
  scheduleLabel: string;
  statusLabel?: string;
  extraLines?: string[];
  tone?: CheckboxCardTone;
  isForgotten?: boolean;
  isCompleted?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string, checked: boolean) => void;
  onPress?: (value: string, checked: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

const resolveTone = ({
  tone,
  isForgotten,
  isCompleted,
}: {
  tone?: CheckboxCardTone;
  isForgotten?: boolean;
  isCompleted?: boolean;
}): CheckboxCardTone => {
  if (tone) {
    return tone;
  }

  if (isForgotten) {
    return "danger";
  }

  if (isCompleted) {
    return "primary";
  }

  return "secondary";
};

export function MedicineCheckboxCard({
  value,
  title,
  scheduleLabel,
  statusLabel,
  extraLines,
  tone,
  isForgotten,
  isCompleted,
  checked,
  defaultChecked,
  disabled,
  onChange,
  onPress,
  style,
}: MedicineCheckboxCardProps) {
  return (
    <CheckboxCard
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onChange={onChange}
      onPress={onPress}
      style={style}
      tone={resolveTone({ tone, isForgotten, isCompleted })}
      value={value}
    >
      {({ checked: isChecked, textColor, secondaryTextColor }) => (
        <TextsWrapper>
          <StyledText color={textColor} variant="mediumRegular">
            {title}
          </StyledText>

          <StyledText color={secondaryTextColor} variant="mediumRegular">
            {scheduleLabel}
          </StyledText>

          {extraLines?.map((line) => (
            <StyledText
              color={secondaryTextColor}
              key={line}
              variant="mediumRegular"
            >
              {line}
            </StyledText>
          ))}

          {statusLabel ? (
            <StyledText
              color={isChecked ? "dark" : secondaryTextColor}
              variant="mediumRegular"
            >
              {statusLabel}
            </StyledText>
          ) : null}
        </TextsWrapper>
      )}
    </CheckboxCard>
  );
}
