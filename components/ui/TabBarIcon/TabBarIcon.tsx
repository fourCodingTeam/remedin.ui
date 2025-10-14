import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { IconWrapper, StyledTabBarLabel } from "./TabBarIcon.styles";
import { TabBarIconProps } from "./TabBarIcon.types";

export function TabBarIcon({ isActive, color, name, route }: TabBarIconProps) {
  return (
    <IconWrapper isActive={isActive}>
      <FontAwesome size={18} name={name} color={color} />
      <StyledTabBarLabel isActive={isActive}>{route}</StyledTabBarLabel>
    </IconWrapper>
  );
}
