import { StyledText } from "../StyledText";
import { CheckboxCard } from "./CheckboxCard";
import {
  Badge,
  BadgeWrapper,
  MetaGroup,
  MetaRow,
  TextsWrapper,
} from "./CheckboxCard.styles";
import type { CheckboxCardTone } from "./CheckboxCard.types";

export type ReportCheckboxCardProps = {
  value: string;
  title: string;
  description?: string;
  periodStart: string;
  periodEnd: string;
  tone?: CheckboxCardTone;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string, checked: boolean) => void;
  onPress?: (value: string, checked: boolean) => void;
};

const defaultTone: CheckboxCardTone = "neutral";

export function ReportCheckboxCard({
  value,
  title,
  description,
  periodStart,
  periodEnd,
  tone = defaultTone,
  checked,
  defaultChecked,
  disabled,
  onChange,
  onPress,
}: ReportCheckboxCardProps) {
  return (
    <CheckboxCard
      checked={checked}
      defaultChecked={defaultChecked}
      disabled={disabled}
      onChange={onChange}
      onPress={onPress}
      tone={tone}
      value={value}
    >
      {({ textColor, secondaryTextColor }) => (
        <TextsWrapper>
          <StyledText color={textColor} variant="mediumRegular">
            {title}
          </StyledText>
          {description ? (
            <StyledText color={secondaryTextColor} variant="mediumRegular">
              {description}
            </StyledText>
          ) : null}

          <MetaGroup>
            <MetaRow>
              <StyledText color={secondaryTextColor} variant="mediumRegular">
                Período:
              </StyledText>
              <BadgeWrapper>
                <Badge>
                  <StyledText color="black" variant="mediumRegular">
                    {periodStart}
                  </StyledText>
                </Badge>
                <Badge>
                  <StyledText color="black" variant="mediumRegular">
                    {periodEnd}
                  </StyledText>
                </Badge>
              </BadgeWrapper>
            </MetaRow>
          </MetaGroup>
        </TextsWrapper>
      )}
    </CheckboxCard>
  );
}
