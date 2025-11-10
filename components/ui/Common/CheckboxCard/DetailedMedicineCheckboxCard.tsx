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

export type DetailedMedicineCheckboxCardProps = {
  value: string;
  title: string;
  periodLabel?: string;
  periodRange?: {
    start: string;
    end?: string;
  };
  usageLabel?: string;
  scheduleTimes?: string[];
  instructions?: string;
  tone?: CheckboxCardTone;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (value: string, checked: boolean) => void;
  onPress?: (value: string, checked: boolean) => void;
};

const defaultTone: CheckboxCardTone = "secondary";

export function DetailedMedicineCheckboxCard({
  value,
  title,
  periodLabel,
  periodRange,
  usageLabel,
  scheduleTimes,
  instructions,
  tone = defaultTone,
  checked,
  defaultChecked,
  disabled,
  onChange,
  onPress,
}: DetailedMedicineCheckboxCardProps) {
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

          <MetaGroup>
            {(periodLabel || periodRange) && (
              <MetaRow>
                <StyledText color={secondaryTextColor} variant="mediumRegular">
                  Período:
                </StyledText>
                <BadgeWrapper>
                  {periodRange ? (
                    <>
                      <Badge>
                        <StyledText color="black" variant="mediumRegular">
                          {periodRange.start}
                        </StyledText>
                      </Badge>
                      {periodRange.end ? (
                        <Badge>
                          <StyledText color="black" variant="mediumRegular">
                            {periodRange.end}
                          </StyledText>
                        </Badge>
                      ) : null}
                    </>
                  ) : (
                    <StyledText
                      color={secondaryTextColor}
                      variant="mediumRegular"
                    >
                      {periodLabel}
                    </StyledText>
                  )}
                </BadgeWrapper>
              </MetaRow>
            )}

            {usageLabel ? (
              <MetaRow>
                <StyledText color={secondaryTextColor} variant="mediumRegular">
                  Uso:
                </StyledText>
                <BadgeWrapper>
                  <Badge>
                    <StyledText color="black" variant="mediumRegular">
                      {usageLabel}
                    </StyledText>
                  </Badge>
                </BadgeWrapper>
              </MetaRow>
            ) : null}

            {scheduleTimes && scheduleTimes.length > 0 ? (
              <MetaRow>
                <StyledText color={secondaryTextColor} variant="mediumRegular">
                  Horários:
                </StyledText>
                <BadgeWrapper>
                  {scheduleTimes.map((time) => (
                    <Badge key={time}>
                      <StyledText color="black" variant="mediumRegular">
                        {time}
                      </StyledText>
                    </Badge>
                  ))}
                </BadgeWrapper>
              </MetaRow>
            ) : null}
          </MetaGroup>

          {instructions ? (
            <StyledText color={secondaryTextColor} variant="mediumRegular">
              {instructions}
            </StyledText>
          ) : null}
        </TextsWrapper>
      )}
    </CheckboxCard>
  );
}
