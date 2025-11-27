import { Bell, Clock, MailCheck } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import Modal from "react-native-modal";
import { StyledText } from "@/components/ui";
import { theme } from "@/constants/theme";
import type {
  MedicationReminderNotification,
  MedicationTakenNotification,
} from "@/services/websocket/websocketService";
import { websocketService } from "@/services/websocket/websocketService";
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

export type NotificationData = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: "medication_reminder" | "medication_taken";
  data?: MedicationReminderNotification | MedicationTakenNotification;
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60_000);
  const diffInHours = Math.floor(diffInMs / 3_600_000);
  const diffInDays = Math.floor(diffInMs / 86_400_000);

  if (diffInMinutes < 1) {
    return "Agora";
  }
  if (diffInMinutes < 60) {
    return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`;
  }
  if (diffInHours < 24) {
    return `Há ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`;
  }
  if (diffInDays < 7) {
    return `Há ${diffInDays} dia${diffInDays > 1 ? "s" : ""}`;
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function NotificationsModal({
  isVisible,
  onClose,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Listen for notifications from websocket
    const unsubscribe = websocketService.onNotification((notification) => {
      const newNotification: NotificationData = {
        id:
          "doseOccurrenceId" in notification
            ? notification.doseOccurrenceId
            : `taken-${Date.now()}`,
        title:
          "doseOccurrenceId" in notification
            ? "Hora de tomar medicação"
            : "Medicamento registrado",
        message: notification.message,
        timestamp: new Date(),
        isRead: false,
        type:
          "doseOccurrenceId" in notification
            ? "medication_reminder"
            : "medication_taken",
        data: notification,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

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
                    {formatTimestamp(notification.timestamp)}
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
