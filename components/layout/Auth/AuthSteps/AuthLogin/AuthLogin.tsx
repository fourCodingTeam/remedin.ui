import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { signInWithEmail } from "@/auth/signIn";
import { InputBase } from "@/components/ui";
import { Button } from "@/components/ui/Common/Button"; //
import { StyledText } from "@/components/ui/Common/StyledText";
import { useToast } from "@/components/ui/Toast";
import { GetCurrentPerson, loadAllMembersWithFullData } from "@/services/api/person";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores";
import { type LoginFormData, loginSchema } from "@/validators";
import {
  BottomContainer,
  GenericStepContainer,
  InputsWrapper,
  ModalContent,
  StepDescription,
  StepTitle,
  TextWrapper,
} from "../AuthModal.styles";
import type { AuthLoginProps } from "../AuthModal.types";

export function AuthLogin({ onClose, onGoogleLogin }: AuthLoginProps) {
  const { setIsLoggedIn, setUsername, setEmail, setToken, setPersonData } =
    useUserStore();
  const { setMembers } = useMemberStore();
  const { showToast } = useToast();

  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginPress = handleSubmit(async (data) => {
    try {
      setAuthError(null);
      setIsSubmitting(true);

      const response = await signInWithEmail(data.email, data.password);
      const token = response.session.access_token;

      setToken(token);
      setEmail(data.email);

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
        setUsername(
          response.user.user_metadata.username || response.user.email || null
        );
      }

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
      showToast("Login realizado com sucesso!", "success");
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível fazer login. Tente novamente.";
      setAuthError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <ModalContent>
        <GenericStepContainer>
          <TextWrapper>
            <StepTitle>Digite suas credenciais</StepTitle>
            <StepDescription>
              Digite suas credenciais para fazer login no aplicativo
            </StepDescription>
          </TextWrapper>

          <InputsWrapper>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    autoCapitalize="none"
                    compact
                    keyboardType="email-address"
                    onChangeText={onChange}
                    placeholder="E-mail"
                    prefixIcon="envelope"
                    value={value}
                  />
                  {errors.email && (
                    <StyledText color="error" variant="mediumRegular">
                      {errors.email.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <>
                  <InputBase
                    compact
                    onChangeText={onChange}
                    placeholder="Senha"
                    prefixIcon="lock"
                    secureTextEntry
                    value={value}
                  />
                  {errors.password && (
                    <StyledText
                      color="error"
                      style={{ marginTop: 4 }}
                      variant="mediumRegular"
                    >
                      {errors.password.message}
                    </StyledText>
                  )}
                </>
              )}
            />
            {authError && (
              <StyledText
                color="error"
                style={{ marginTop: 8 }}
                variant="mediumRegular"
              >
                {authError}
              </StyledText>
            )}
          </InputsWrapper>
        </GenericStepContainer>
      </ModalContent>

      <BottomContainer>
        <Button
          fullWidth
          isLoading={isSubmitting}
          label="Entrar"
          onPress={handleLoginPress}
          variant="black"
        />
        {onGoogleLogin && (
          <Button
            disabled={isSubmitting}
            fullWidth
            label="Entrar com Google"
            onPress={onGoogleLogin}
            textColor="dark"
            variant="empty"
          />
        )}
      </BottomContainer>
    </>
  );
}
