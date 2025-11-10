import type { StyledTextColor } from "../StyledText/StyledText.types";

export type SideMenuIconRenderer = (options: {
  color: string;
}) => React.ReactNode;

export type SideMenuItem = {
  id: string;
  label: string;
  icon: SideMenuIconRenderer;
  onPress?: () => void | Promise<void>;
  active?: boolean;
};

export type SideMenuFooterAction = {
  label: string;
  icon: SideMenuIconRenderer;
  onPress?: () => void | Promise<void>;
  color?: StyledTextColor;
};

export type SideMenuModalProps = {
  visible: boolean;
  onClose: () => void;
  userName: string;
  userPhone?: string;
  menuItems: SideMenuItem[];
  footerAction?: SideMenuFooterAction;
};
