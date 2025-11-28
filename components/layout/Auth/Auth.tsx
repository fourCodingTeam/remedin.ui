import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { signInWithGoogle } from "@/auth/signIn";
import { Button } from "@/components/ui";
import { CompleteRegistrationModal } from "@/components/layout/Modals/CompleteRegistrationModal";
import { GetCurrentPerson, loadAllMembersWithFullData } from "@/services/api/person";
import { useMemberStore } from "@/stores/MemberStore";
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
    setNeedsRegistration,
  } = useUserStore();
  const { setMembers } = useMemberStore();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);
  const [isCompleteRegistrationVisible, setIsCompleteRegistrationVisible] =
    useState(false);
  const [pendingUserData, setPendingUserData] = useState<{
    email: string | null;
    name: string | null;
    token: string;
  } | null>(null);

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
      // Don't set token yet - wait until person is found or registration is complete
      setEmail(session.user.email ?? null);

      // Get person data from backend
      const personResponse = await GetCurrentPerson(token);
      
      if (personResponse.success && personResponse.data) {
        // Person found - set token and login
        setToken(token);
        setNeedsRegistration(false); // Clear registration flag
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

        // Load all members with full data
        const membersResponse = await loadAllMembersWithFullData(token);
        if (membersResponse.success && membersResponse.data) {
          const membersWithPhone = membersResponse.data.map((member) => ({
            ...member,
            phoneNumber: member.phone || "",
            avatar: "",
          }));
          setMembers(membersWithPhone);
        }

        setIsLoggedIn(true);
        router.push("/(tabs)");
      } else {
        // Pessoa não encontrada ou erro - mostrar modal de cadastro completo
        console.log("Person not found, showing registration modal:", personResponse);
        // Set token but mark as needing registration to prevent auto-redirect
        setToken(token);
        setNeedsRegistration(true);
        const displayName =
          (session.user.user_metadata?.full_name as string | undefined) ??
          session.user.email ??
          null;
        setUsername(displayName);
        // Store token temporarily - will be set after registration is complete
        setPendingUserData({
          email: session.user.email ?? null,
          name: displayName,
          token,
        });
        setIsCompleteRegistrationVisible(true);
      }
    } catch (error) {
      console.error("Erro no login Google:", error);
      Alert.alert(
        "Erro ao entrar",
        "Não foi possível completar o login com o Google. Tente novamente."
      );
    }
  }, [setEmail, setIsLoggedIn, setToken, setUsername, setPersonData, setMembers]);

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
        onPersonNotFound={(email, token) => {
          setIsLoginModalVisible(false);
          // Set token but mark as needing registration to prevent auto-redirect
          setToken(token);
          setNeedsRegistration(true);
          setPendingUserData({
            email,
            name: null,
            token,
          });
          setIsCompleteRegistrationVisible(true);
        }}
      />
      <AuthModal
        isVisible={isRegisterModalVisible}
        mode="register"
        onClose={handleCloseRegisterModal}
      />
      <CompleteRegistrationModal
        initialEmail={pendingUserData?.email || undefined}
        initialName={pendingUserData?.name || undefined}
        isVisible={isCompleteRegistrationVisible}
        onClose={() => {
          setIsCompleteRegistrationVisible(false);
          setPendingUserData(null);
        }}
        onRegistrationComplete={async () => {
          if (pendingUserData) {
            // Registration complete - clear the flag
            setNeedsRegistration(false);
            
            // Load all members with full data
            const membersResponse = await loadAllMembersWithFullData(
              pendingUserData.token
            );
            if (membersResponse.success && membersResponse.data) {
              const membersWithPhone = membersResponse.data.map((member) => ({
                ...member,
                phoneNumber: member.phone || "",
                avatar: "",
              }));
              setMembers(membersWithPhone);
            }

            setIsLoggedIn(true);
            setIsCompleteRegistrationVisible(false);
            setPendingUserData(null);
            router.push("/(tabs)");
          }
        }}
      />
    </StyledView>
  );
}
