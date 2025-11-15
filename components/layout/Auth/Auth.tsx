import { router } from "expo-router";
import { LogIn } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { signInWithGoogle } from "@/auth/signIn";
import { Button } from "@/components/ui";
import { useUserStore } from "@/stores/UserStore";
import { ButtonsWrapper, StyledImage, StyledView } from "./Auth.styles";
import { AuthModal } from "./AuthSteps";

export function Auth() {
  const { token, setToken, setEmail, setUsername, setIsLoggedIn } =
    useUserStore();
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

  const handlePressGoogleLogin = useCallback(async () => {
    try {
      const session = await signInWithGoogle();

      if (!session?.access_token) {
        return;
      }

      setToken(session.access_token);
      setIsLoggedIn(true);
      setEmail(session.user.email ?? null);

      const displayName =
        (session.user.user_metadata?.full_name as string | undefined) ??
        session.user.email ??
        null;

      setUsername(displayName);
      router.push("/(tabs)");
    } catch {
      Alert.alert(
        "Erro ao entrar",
        "Não foi possível completar o login com o Google. Tente novamente."
      );
    }
  }, [setEmail, setIsLoggedIn, setToken, setUsername]);

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
