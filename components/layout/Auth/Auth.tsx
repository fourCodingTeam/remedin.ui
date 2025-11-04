import { useState } from "react";
import { Button } from "@/components/ui";
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
        resizeMode="cover"
        source={require("@/assets/images/auth/iPhone 16 - 3 - Login.png")}
      />
      <ButtonsWrapper>
        <Button label="Entrar" onPress={handlePressLogIn} variant="primary" />
        <Button
          icon="google"
          label="Login com o Google"
          textColor="light"
          variant="outline"
        />
      </ButtonsWrapper>

      <AuthModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </StyledView>
  );
}
