import {
  Bell,
  Globe,
  type LucideIcon,
  SettingsIcon,
  Shield,
  Sun,
} from "lucide-react-native";
import { Button } from "@/components/ui";
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
  {
    id: "2",
    title: "Privacidade",
    description: "Gerencie suas configurações de privacidade",
  },
  // {
  //   id: "3",
  //   title: "Idioma",
  //   description: "Altere o idioma do aplicativo",
  // },
  // {
  //   id: "4",
  //   title: "Tema",
  //   description: "Escolha entre tema claro ou escuro",
  // },
];

export function ConfigurationsModal({
  isVisible,
  onClose,
}: ConfigurationsModalProps) {
  const handleOptionPress = (_id: string) => {
    // Implement navigation to specific configuration screen
    // TODO: Navigate to specific configuration screen based on id
  };

  const getIconByOption = (
    option: (typeof configurationOptions)[number]
  ): LucideIcon | undefined => {
    switch (option.id) {
      case "1":
        return Bell;
      case "2":
        return Shield;
      case "3":
        return Globe;
      case "4":
        return Sun;
      default:
        break;
    }
  };

  return (
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
  );
}
