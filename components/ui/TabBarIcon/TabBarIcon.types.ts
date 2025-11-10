export type TabBarIconName = "home" | "users" | "heart";

export type TabBarIconProps = {
  name: TabBarIconName;
  color: string;
  route?: string;
  isActive: boolean;
  size?: number;
};
