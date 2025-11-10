import type { SideMenuModalProps } from "../SideMenuModal/SideMenuModal.types";

export type HeaderSideMenuConfig = Omit<
  SideMenuModalProps,
  "visible" | "onClose" | "userName"
> & {
  userName?: string;
};

export type HeaderProps = {
  usuario?: string;
  description?: string;
  children?: React.ReactNode;
  onBellPress?: () => void;
  onMenuPress?: () => void;
  onAvatarPress?: () => void;
  sideMenu?: HeaderSideMenuConfig;
};
