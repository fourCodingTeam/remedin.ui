import { useState } from "react";
import { Modal } from "react-native";
import { AuthLogin } from "./AuthLogin";
import { ModalView } from "./AuthModal.styles";
import type { AuthModalProps } from "./AuthModal.types";
import { AuthRegister } from "./AuthRegister";

export function AuthModal({ isVisible, onClose }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<"login" | "register">("login");

  const handleNavigateToRegister = () => {
    setCurrentView("register");
  };

  const handleNavigateToLogin = () => {
    setCurrentView("login");
  };

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="formSheet"
      visible={isVisible}
    >
      <ModalView>
        {currentView === "login" ? (
          <AuthLogin
            onClose={onClose}
            onNavigateToRegister={handleNavigateToRegister}
          />
        ) : (
          <AuthRegister
            onClose={onClose}
            onNavigateToLogin={handleNavigateToLogin}
          />
        )}
      </ModalView>
    </Modal>
  );
}
