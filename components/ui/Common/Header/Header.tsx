import { BellIcon, Menu } from "lucide-react-native";
import { useState } from "react";
import { theme } from "@/constants/theme";
import { Avatar, SideMenuModal, StyledText } from "..";
import {
  HeaderWrapper,
  IconsWrapper,
  IconWrapper,
  TextsWrapper,
  TopWrapper,
} from "./Header.styles";
import type { HeaderProps } from "./Header.types";

export function Header({
  usuario,
  description,
  children,
  onBellPress,
  onMenuPress,
  onAvatarPress,
  sideMenu,
}: HeaderProps) {
  const [isMenuVisible, setMenuVisible] = useState(false);

  const displayName = usuario ?? "Usuário";
  const menuConfig = sideMenu
    ? {
        ...sideMenu,
        userName: sideMenu.userName ?? displayName,
      }
    : undefined;

  const handleOpenMenu = () => {
    if (menuConfig) {
      setMenuVisible(true);
    }
    onMenuPress?.();
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  return (
    <>
      <HeaderWrapper>
        <TopWrapper>
          <Avatar
            activeOpacity={0.7}
            name={displayName}
            onPress={onAvatarPress}
            size="md"
          />
          <IconsWrapper>
            <IconWrapper activeOpacity={0.7} onPress={onBellPress}>
              <BellIcon color={theme.colors.text.default} size={24} />
            </IconWrapper>
            <IconWrapper activeOpacity={0.7} onPress={handleOpenMenu}>
              <Menu color={theme.colors.text.default} size={24} />
            </IconWrapper>
          </IconsWrapper>
        </TopWrapper>
        <TextsWrapper>
          <StyledText variant="largeRegular">{displayName}</StyledText>
          {description && (
            <StyledText color="muted" variant="mediumRegular">
              {description}
            </StyledText>
          )}
        </TextsWrapper>
        {children}
      </HeaderWrapper>
      {menuConfig ? (
        <SideMenuModal
          {...menuConfig}
          onClose={handleCloseMenu}
          userName={menuConfig.userName}
          visible={isMenuVisible}
        />
      ) : null}
    </>
  );
}
