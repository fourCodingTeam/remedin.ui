import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { signInWithGoogle } from "@/auth/signIn";
import { Button } from "@/components/ui";
import { GetCurrentPerson } from "@/services/api/person";
import { useUserStore } from "@/stores/UserStore";
import { ButtonsWrapper, StyledImage, StyledView } from "./Auth.styles";
import { AuthModal } from "./AuthSteps";

export function Auth() {
  const {
    token,
    setToken,
    setEmail,
    setUsername,
    setIsLoggedIn,
    setPersonData,
  } = useUserStore();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const handlePressLogIn = () => {
    setIsLoginModalVisible(true);
  };

  const handlePressRegister = () => {
    setIsRegisterModalVisible(true);
  };

  const handleCloseLoginModal = () => {
    if (token) {
      router.push("/(tabs)");
    } else {
      router.replace("/auth");
    }
    setIsLoginModalVisible(false);
  };

  const handleCloseRegisterModal = () => {
    if (token) {
      router.push("/(tabs)");
    } else {
      router.replace("/auth");
    }
    setIsRegisterModalVisible(false);
  };

  const handlePressGoogleLogin = useCallback(async () => {
    try {
      const session = await signInWithGoogle();

      if (!session?.access_token) {
        return;
      }

      const token = session.access_token;
      setToken(token);
      setEmail(session.user.email ?? null);

      // Get person data from backend
      const personResponse = await GetCurrentPerson(token);
      if (personResponse.success && personResponse.data) {
        setPersonData({
          id: personResponse.data.id,
          name: personResponse.data.name,
          email: personResponse.data.email,
          username: personResponse.data.username,
          phone: personResponse.data.phone,
          birthDate: personResponse.data.birthDate,
          weightKg: personResponse.data.weightKg,
          heightCm: personResponse.data.heightCm,
        });
      } else {
        // Fallback to metadata if backend call fails
        const displayName =
          (session.user.user_metadata?.full_name as string | undefined) ??
          session.user.email ??
          null;
        setUsername(displayName);
      }

      setIsLoggedIn(true);
      router.push("/(tabs)");
    } catch {
      Alert.alert(
        "Erro ao entrar",
        "Não foi possível completar o login com o Google. Tente novamente."
      );
    }
  }, [setEmail, setIsLoggedIn, setToken, setUsername, setPersonData]);

  return (
    <StyledView>
      <StyledImage
        resizeMode="cover"
        source={require("@/assets/images/auth/iPhone 16 - 3 - Login.png")}
      />
      <ButtonsWrapper>
        <Button label="Entrar" onPress={handlePressLogIn} variant="primary" />
        <Button
          label="Criar uma conta"
          onPress={handlePressRegister}
          textColor="light"
          variant="outline"
        />
      </ButtonsWrapper>

      <AuthModal
        isVisible={isLoginModalVisible}
        mode="login"
        onClose={handleCloseLoginModal}
        onGoogleLogin={handlePressGoogleLogin}
      />
      <AuthModal
        isVisible={isRegisterModalVisible}
        mode="register"
        onClose={handleCloseRegisterModal}
      />
    </StyledView>
  );
}
