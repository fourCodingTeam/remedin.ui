import React from "react";
import { Text } from "react-native";
import { TagWrapper } from "./MultiSelectTag.styles";
import { MultiSelectTagProps } from "./MultiSelectTag.types";

export function MultiSelectTag({
  id,
  isSelected,
  label,
  disabled,
}: MultiSelectTagProps) {
  return (
    <TagWrapper isSelected={isSelected} disabled={disabled} activeOpacity={0.7}>
      <Text>{label}</Text>
    </TagWrapper>
  );
}
