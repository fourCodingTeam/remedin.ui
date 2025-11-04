import FontAwesome from "@expo/vector-icons/FontAwesome";
import { IconWrapper, StyledTabBarLabel } from "./TabBarIcon.styles";
import type { TabBarIconProps } from "./TabBarIcon.types";

export function TabBarIcon({ isActive, color, name, route }: TabBarIconProps) {
  return (
    <IconWrapper isActive={isActive}>
      <FontAwesome color={color} name={name} size={18} />
      <StyledTabBarLabel isActive={isActive}>{route}</StyledTabBarLabel>
    </IconWrapper>
  );
}
