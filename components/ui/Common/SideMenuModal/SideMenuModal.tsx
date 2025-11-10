import Modal from "react-native-modal";
import { theme } from "@/constants/theme";
import { Avatar } from "../Avatar";
import { StyledText } from "../StyledText";
import type { StyledTextColor } from "../StyledText/StyledText.types";
import {
  Container,
  Content,
  FooterButton,
  FooterSection,
  MenuItemButton,
  MenuItemIconWrapper,
  MenuWrapper,
  UserInfo,
  UserInfoTexts,
} from "./SideMenuModal.styles";
import type { SideMenuModalProps } from "./SideMenuModal.types";

const getStyledTextColorValue = (color: StyledTextColor | undefined) => {
  switch (color) {
    case "muted":
      return theme.colors.text.muted;
    case "black":
      return theme.colors.common.black;
    case "light":
      return theme.colors.background.light;
    case "dark":
      return theme.colors.text.default;
    case "error":
      return theme.colors.warnings.danger;
    default:
      return theme.colors.text.default;
  }
};

export function SideMenuModal({
  visible,
  onClose,
  userName,
  userPhone,
  menuItems,
  footerAction,
}: SideMenuModalProps) {
  const handlePressItem = async (action?: () => void | Promise<void>) => {
    try {
      if (action) {
        await action();
      }
    } catch {
      // Intentionally swallow errors to avoid unhandled promise rejections.
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      animationIn="slideInRight"
      animationInTiming={300}
      animationOut="slideOutRight"
      animationOutTiming={300}
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      style={{ margin: 0, padding: 0, alignItems: "flex-end" }}
      useNativeDriver={true}
    >
      <Container>
        <Content>
          <UserInfo>
            <Avatar name={userName} size="md" />
            <UserInfoTexts>
              <StyledText color="dark" variant="largeSemiBold">
                {userName}
              </StyledText>
              {userPhone ? (
                <StyledText color="muted" variant="mediumRegular">
                  {userPhone}
                </StyledText>
              ) : null}
            </UserInfoTexts>
          </UserInfo>

          <MenuWrapper>
            {menuItems.map((item) => {
              const isActive = item.active;
              const iconColor = isActive
                ? theme.colors.accent.primary
                : theme.colors.text.default;

              return (
                <MenuItemButton
                  active={isActive}
                  activeOpacity={0.8}
                  key={item.id}
                  onPress={() => {
                    handlePressItem(item.onPress);
                  }}
                >
                  <MenuItemIconWrapper active={isActive}>
                    {item.icon({ color: iconColor })}
                  </MenuItemIconWrapper>
                  <StyledText
                    color="dark"
                    variant={isActive ? "mediumSemiBold" : "mediumRegular"}
                  >
                    {item.label}
                  </StyledText>
                </MenuItemButton>
              );
            })}
          </MenuWrapper>
        </Content>

        {footerAction ? (
          <FooterSection>
            <FooterButton
              activeOpacity={0.8}
              onPress={() => {
                handlePressItem(footerAction.onPress);
              }}
            >
              {footerAction.icon({
                color: getStyledTextColorValue(footerAction.color ?? "error"),
              })}
              <StyledText
                color={footerAction.color ?? "error"}
                variant="mediumSemiBold"
              >
                {footerAction.label}
              </StyledText>
            </FooterButton>
          </FooterSection>
        ) : null}
      </Container>
    </Modal>
  );
}
