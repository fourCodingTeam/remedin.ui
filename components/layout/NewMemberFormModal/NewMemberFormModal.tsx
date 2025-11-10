import { UserPlus } from "lucide-react-native";
import { Button, InputBase } from "@/components/ui";
import { ModalPageWrapper } from "../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../styles";

type NewMemberFormModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function NewMemberFormModal({
  isVisible,
  onClose,
}: NewMemberFormModalProps) {
  const handleConfirm = () => {
    // TODO: Integrate API call
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalPageWrapper
      header={{
        title: "Adicionar membro",
        description: "Adicione um membro que fará parte do seu círculo",
        icon: <UserPlus color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase placeholder="Email*" />
          <InputBase placeholder="Nome*" />
          <InputBase placeholder="Sobrenome" />
          <InputBase placeholder="Idade*" />
          <InputBase placeholder="Telefone" />
          <InputBase placeholder="Observações" />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button label="Confirmar" onPress={handleConfirm} variant="primary" />
          <Button label="Cancelar" onPress={handleCancel} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}

