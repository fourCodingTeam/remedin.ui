import { User2 } from "lucide-react-native";
import { Button, InputBase, StyledText } from "@/components/ui";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import type { ProfileModalProps } from "./ProfileModal.types";

export function ProfileModal({ isVisible, onClose }: ProfileModalProps) {
  const { username } = useUserStore();
  const { member } = useMemberStore();

  const displayName = member?.name || username || "Usuário";
  const phoneNumber = member?.phoneNumber || "";

  return (
    <ModalPageWrapper
      header={{
        title: "Perfil",
        description: "Visualize e edite suas informações pessoais",
        icon: <User2 color="black" size={18} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <StyledText variant="mediumSemiBold">Informações pessoais</StyledText>
          <InputBase editable={false} placeholder="Nome" value={displayName} />
          <InputBase
            editable={false}
            placeholder="Telefone"
            value={phoneNumber}
          />
          <InputBase editable={false} placeholder="Email" value="" />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button label="Editar" onPress={onClose} variant="primary" />
          <Button label="Voltar" onPress={onClose} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
