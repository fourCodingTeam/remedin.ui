import { Button } from "@/components/ui";
import React, { useState } from "react";
import { ButtonsWrapper, StyledImage, StyledView } from "./Auth.styles";
import { AuthModal } from "./AuthSteps";

export function Auth() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePressLogIn = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    // Aqui você poderia, por exemplo, verificar o useUserStore
    // e navegar para a home se o login foi bem-sucedido.
  };

  return (
    <StyledView>
      <StyledImage
        source={require("@/assets/images/auth/iPhone 16 - 3 - Login.png")}
        resizeMode="cover"
      />
      <ButtonsWrapper>
        <Button label="Entrar" variant="primary" onPress={handlePressLogIn} />
        <Button
          icon="google"
          label="Login com o Google"
          variant="outline"
          textColor="light"
        />
      </ButtonsWrapper>

      <AuthModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </StyledView>
  );
}
