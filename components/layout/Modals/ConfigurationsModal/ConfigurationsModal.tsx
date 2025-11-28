import { useState, useEffect } from "react";
import {
  Bell,
  type LucideIcon,
  SettingsIcon,
} from "lucide-react-native";
import * as Notifications from "expo-notifications";
import { Button, ModalBase } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  ContentWrapper,
  ScrollableContentWrapper,
} from "../../styles";
import type { ConfigurationsModalProps } from "./ConfigurationsModal.types";

const configurationOptions = [
  {
    id: "1",
    title: "Notificações",
    description: "Configure suas preferências de notificação",
  },
];

export function ConfigurationsModal({
  isVisible,
  onClose,
}: ConfigurationsModalProps) {
  const { showToast } = useToast();
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if (isVisible) {
      checkNotificationStatus();
    }
  }, [isVisible]);

  const checkNotificationStatus = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      setNotificationsEnabled(status === "granted");
    } catch (error) {
      console.error("Error checking notification status:", error);
    }
  };

  const handleOptionPress = (id: string) => {
    if (id === "1") {
      setIsNotificationModalVisible(true);
    }
  };

  const handleToggleNotifications = async () => {
    try {
      if (notificationsEnabled) {
        // Desabilitar notificações - cancelar todas as notificações agendadas
        await Notifications.cancelAllScheduledNotificationsAsync();
        showToast("Notificações desabilitadas", "success");
        setNotificationsEnabled(false);
      } else {
        // Habilitar notificações - solicitar permissão
        const { status } = await Notifications.requestPermissionsAsync();
        if (status === "granted") {
          showToast("Notificações habilitadas", "success");
          setNotificationsEnabled(true);
        } else {
          showToast("Permissão de notificações negada", "error");
        }
      }
      setIsNotificationModalVisible(false);
    } catch (error) {
      console.error("Error toggling notifications:", error);
      showToast("Erro ao alterar configurações de notificação", "error");
    }
  };

  const getIconByOption = (
    option: (typeof configurationOptions)[number]
  ): LucideIcon | undefined => {
    switch (option.id) {
      case "1":
        return Bell;
      default:
        break;
    }
  };

  return (
    <>
      <ModalPageWrapper
        header={{
          title: "Configurações",
          description: "Personalize suas preferências do aplicativo",
          icon: <SettingsIcon color="black" size={20} />,
        }}
        isVisible={isVisible}
        onClose={onClose}
      >
        <ContentWrapper>
          <ScrollableContentWrapper>
            {configurationOptions.map((option) => (
              <Button
                icon={getIconByOption(option)}
                key={option.id}
                label={option.title}
                onPress={() => handleOptionPress(option.id)}
                spacedBetween
                style={{ marginTop: 8 }}
                textColor="black"
                variant="outline"
              />
            ))}
          </ScrollableContentWrapper>
          <ButtonsWrapper addPadding>
            <Button label="Voltar" onPress={onClose} variant="outline" />
          </ButtonsWrapper>
        </ContentWrapper>
      </ModalPageWrapper>

      <ModalBase
        description={
          notificationsEnabled
            ? "Deseja desabilitar as notificações do aplicativo?"
            : "Deseja habilitar as notificações do aplicativo?"
        }
        isVisible={isNotificationModalVisible}
        onClose={() => setIsNotificationModalVisible(false)}
        title="Notificações"
        button={[
          {
            label: notificationsEnabled ? "Desabilitar" : "Habilitar",
            onPress: handleToggleNotifications,
            variant: notificationsEnabled ? "outline" : "primary",
          },
          {
            label: "Cancelar",
            onPress: () => setIsNotificationModalVisible(false),
            variant: "outline",
          },
        ]}
      />
    </>
  );
}
