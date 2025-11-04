import type FontAwesome from "@expo/vector-icons/FontAwesome";

export type TabBarIconProps = {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
  route?: string;
  isActive: boolean;
};
