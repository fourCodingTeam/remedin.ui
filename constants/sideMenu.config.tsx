import {
  Archive,
  Calendar,
  ClipboardPen,
  LogOutIcon,
  Settings,
  User,
} from "lucide-react-native";
import type { MemberState } from "@/stores/MemberStore/@types";
import { theme } from "./theme";

type SideMenuModalHandlers = {
  setIsCalendarModalVisible: (visible: boolean) => void;
  setIsProfileModalVisible?: (visible: boolean) => void;
  setIsMedicinesModalVisible?: (visible: boolean) => void;
  setIsReportsModalVisible?: (visible: boolean) => void;
  setIsConfigurationsModalVisible?: (visible: boolean) => void;
};

export const memberSideMenuConfig = (
  member: MemberState["member"],
  handleLogOut: () => void,
  handlers: SideMenuModalHandlers
) => ({
  userPhone: member.phoneNumber ?? undefined,
  userName: member.name ?? undefined,
  menuItems: [
    {
      id: "1",
      label: "Perfil",
      icon: () => <User size={18} />,
      onPress: () => handlers.setIsProfileModalVisible?.(true),
    },
    {
      id: "2",
      label: "Calendário",
      icon: () => <Calendar size={18} />,
      onPress: () => handlers.setIsCalendarModalVisible(true),
    },
    {
      id: "3",
      label: "Medicações",
      icon: () => <Archive size={18} />,
      onPress: () => handlers.setIsMedicinesModalVisible?.(true),
    },
    {
      id: "4",
      label: "Relatórios",
      icon: () => <ClipboardPen size={18} />,
      onPress: () => handlers.setIsReportsModalVisible?.(true),
    },
    {
      id: "5",
      label: "Configurações",
      icon: () => <Settings size={18} />,
      onPress: () => handlers.setIsConfigurationsModalVisible?.(true),
    },
  ],
  footerAction: {
    label: "Sair",
    icon: () => <LogOutIcon color={theme.colors.warnings.danger} size={18} />,
    onPress: handleLogOut,
  },
});

export const sideMenuConfig = (
  username: string,
  phoneNumber: string,
  handleLogOut: () => void,
  handlers: SideMenuModalHandlers
) => ({
  userName: username ?? undefined,
  userPhone: phoneNumber ?? undefined,
  menuItems: [
    {
      id: "1",
      label: "Perfil",
      icon: () => <User size={18} />,
      onPress: () => handlers.setIsProfileModalVisible?.(true),
    },
    {
      id: "2",
      label: "Calendário",
      icon: () => <Calendar size={18} />,
      onPress: () => handlers.setIsCalendarModalVisible(true),
    },
    {
      id: "3",
      label: "Medicações",
      icon: () => <Archive size={18} />,
      onPress: () => handlers.setIsMedicinesModalVisible?.(true),
    },
    {
      id: "4",
      label: "Relatórios",
      icon: () => <ClipboardPen size={18} />,
      onPress: () => handlers.setIsReportsModalVisible?.(true),
    },
    {
      id: "5",
      label: "Configurações",
      icon: () => <Settings size={18} />,
      onPress: () => handlers.setIsConfigurationsModalVisible?.(true),
    },
  ],
  footerAction: {
    label: "Sair",
    icon: () => <LogOutIcon color={theme.colors.warnings.danger} size={18} />,
    onPress: handleLogOut,
  },
});
