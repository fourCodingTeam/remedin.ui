import { StyledText } from "../Common";
import { TagWrapper } from "./MultiSelectTag.styles";
import type { MultiSelectTagProps } from "./MultiSelectTag.types";

export function MultiSelectTag({
  id,
  isSelected,
  label,
  disabled,
  onPress,
}: MultiSelectTagProps) {
  return (
    <TagWrapper
      activeOpacity={0.7}
      disabled={disabled}
      isSelected={isSelected}
      onPress={onPress}
    >
      <StyledText variant="mediumRegular">{label}</StyledText>
    </TagWrapper>
  );
}
