import { router } from "expo-router";
import { LogIn } from "lucide-react-native";
import { useState } from "react";
import { signInWithGoogle } from "@/auth/signIn";
import { Button } from "@/components/ui";
import { useUserStore } from "@/stores/UserStore";
import { ButtonsWrapper, StyledImage, StyledView } from "./Auth.styles";
import { AuthModal } from "./AuthSteps";

export function Auth() {
  const { token, signOut } = useUserStore();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handlePressLogIn = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    if (token) {
      router.push("/(tabs)");
    } else {
      router.replace("/auth");
    }
    setIsModalVisible(false);
  };

  const handlePressGoogleLogin = async () => {
    signOut();
    await signInWithGoogle();
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
          icon={LogIn}
          label="Login com o Google"
          onPress={handlePressGoogleLogin}
          textColor="light"
          variant="outline"
        />
      </ButtonsWrapper>

      <AuthModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </StyledView>
  );
}
