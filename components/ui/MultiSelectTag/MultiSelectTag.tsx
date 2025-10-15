import React from "react";
import { StyledText } from "../Common";
import { TagWrapper } from "./MultiSelectTag.styles";
import { MultiSelectTagProps } from "./MultiSelectTag.types";

export function MultiSelectTag({
  id,
  isSelected,
  label,
  disabled,
  onPress,
}: MultiSelectTagProps) {
  return (
    <TagWrapper
      isSelected={isSelected}
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <StyledText variant="mediumRegular">{label}</StyledText>
    </TagWrapper>
  );
}
