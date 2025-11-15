import { Bell, Clock, MailCheck } from "lucide-react-native";
import { useState } from "react";
import Modal from "react-native-modal";
import { StyledText } from "@/components/ui";
import { theme } from "@/constants/theme";
import { notificationsMock } from "@/services/mock/notifications";
import {
  FloatingModalContent,
  ModalHeader,
  ModalHeaderTitle,
  NotificationItem,
  NotificationList,
  NotificationTime,
  NotificationTitle,
  ReadButton,
  ReadButtonWrapper,
} from "./NotificationsModal.styles";
import type { NotificationsModalProps } from "./NotificationsModal.types";

export function NotificationsModal({
  isVisible,
  onClose,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState(notificationsMock);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Modal
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={300}
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={{ margin: 0, padding: 0, justifyContent: "flex-end" }}
      useNativeDriver={true}
    >
      <FloatingModalContent>
        <ModalHeader>
          <ModalHeaderTitle>
            <Bell color={theme.colors.text.default} size={20} />
            <StyledText variant="largeSemiBold">Notificações</StyledText>
          </ModalHeaderTitle>
          <StyledText color="muted" variant="mediumRegular">
            {unreadCount > 0
              ? `Você tem ${unreadCount} notificação${unreadCount > 1 ? "ões" : ""} não lida${unreadCount > 1 ? "s" : ""}`
              : "Você não tem notificações não lidas"}
          </StyledText>
        </ModalHeader>
        <ReadButtonWrapper>
          <ReadButton activeOpacity={0.7} onPress={handleMarkAllAsRead}>
            <MailCheck color={theme.colors.accent.primary} size={20} />
            <StyledText color="dark" variant="mediumRegular">
              Marcar todas como lidas
            </StyledText>
          </ReadButton>
        </ReadButtonWrapper>
        <NotificationList showsVerticalScrollIndicator>
          {notifications.map((notification) => (
            <NotificationItem
              isRead={notification.isRead}
              key={notification.id}
            >
              <Clock
                color={
                  notification.isRead
                    ? theme.colors.text.muted
                    : theme.colors.accent.primary
                }
                size={18}
              />
              <NotificationTitle>
                <StyledText
                  color={notification.isRead ? "muted" : "dark"}
                  variant="mediumSemiBold"
                >
                  {notification.title}
                </StyledText>
                <NotificationTime>
                  <StyledText color="muted" variant="smallRegular">
                    {notification.timestamp}
                  </StyledText>
                </NotificationTime>
              </NotificationTitle>
            </NotificationItem>
          ))}
        </NotificationList>
      </FloatingModalContent>
    </Modal>
  );
}
