import React, { useState } from "react";
import { Modal } from "react-native";
import { AuthLogin } from "./AuthLogin";
import { ModalView } from "./AuthModal.styles";
import { AuthModalProps } from "./AuthModal.types";
import { AuthRegister } from "./AuthRegister";

export function AuthModal({ isVisible, onClose }: AuthModalProps) {
  const [currentView, setCurrentView] = useState<"login" | "register">("login");
  console.log("AuthModal rendered with isVisible:", isVisible);

  const handleNavigateToRegister = () => {
    setCurrentView("register");
  };

  const handleNavigateToLogin = () => {
    setCurrentView("login");
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onClose}
      animationType="slide"
      presentationStyle="formSheet"
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
