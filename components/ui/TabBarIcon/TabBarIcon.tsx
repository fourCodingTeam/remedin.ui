import { Heart, Home, Users } from "lucide-react-native";
import { IconWrapper, StyledTabBarLabel } from "./TabBarIcon.styles";
import type { TabBarIconProps } from "./TabBarIcon.types";

const iconMap = {
  home: Home,
  users: Users,
  heart: Heart,
};

export function TabBarIcon({
  isActive,
  color,
  name,
  route,
  size = 20,
}: TabBarIconProps) {
  const IconComponent = iconMap[name];

  return (
    <IconWrapper isActive={isActive}>
      <IconComponent color={color} size={size} />
      <StyledTabBarLabel isActive={isActive}>{route}</StyledTabBarLabel>
    </IconWrapper>
  );
}
