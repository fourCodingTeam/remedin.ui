import { Modal } from "react-native";
import { AuthLogin } from "./AuthLogin";
import { ModalView } from "./AuthModal.styles";
import type { AuthModalProps } from "./AuthModal.types";
import { AuthRegister } from "./AuthRegister";

export function AuthModal({
  isVisible,
  mode,
  onClose,
  onGoogleLogin,
  onPersonNotFound,
}: AuthModalProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="formSheet"
      visible={isVisible}
    >
      <ModalView>
        {mode === "login" ? (
          <AuthLogin
            onClose={onClose}
            onGoogleLogin={onGoogleLogin}
            onPersonNotFound={onPersonNotFound}
          />
        ) : (
          <AuthRegister onClose={onClose} />
        )}
      </ModalView>
    </Modal>
  );
}
