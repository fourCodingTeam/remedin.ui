import { User2 } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Button, InputBase, StyledText } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { GetCurrentPerson, getMemberById } from "@/services/api/person";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import type { ProfileModalProps } from "./ProfileModal.types";

export function ProfileModal({ isVisible, onClose }: ProfileModalProps) {
  const { username, email, phoneNumber, weightKg, heightCm } = useUserStore();
  const { member, weight, height } = useMemberStore();
  const { memberId, isMemberContext } = useMemberContext();
  const { showToast } = useToast();
  const {
    latestWeight,
    latestHeight,
    latestBloodPressure,
    latestBloodSugar,
    reload: reloadHealthData,
  } = useHealthData();
  const [memberData, setMemberData] = useState<{
    name: string;
    email: string;
    phone: string | null;
  } | null>(null);
  const [_isLoading, setIsLoading] = useState(false);

  const loadMemberData = useCallback(async () => {
    if (!memberId) {
      return;
    }

    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Erro de autenticação", "error");
        return;
      }

      const response = await getMemberById(memberId, token);
      if (response.success && response.data) {
        setMemberData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || null,
        });
      } else {
        showToast(
          response.message || "Erro ao carregar dados do membro",
          "error"
        );
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados do membro",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [memberId, showToast]);

  const loadCurrentUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Erro de autenticação", "error");
        return;
      }

      const response = await GetCurrentPerson(token);
      if (response.success && response.data) {
        setMemberData({
          name: response.data.name || "",
          email: response.data.email || "",
          phone: response.data.phone || null,
        });
      }
    } catch {
      // Silently fail - will use fallback values
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (isVisible && memberId) {
      loadMemberData();
      // Reload health data for the member
      reloadHealthData();
    } else if (isVisible && !memberId) {
      loadCurrentUserData();
      // Reload health data for the current user
      reloadHealthData();
    }
  }, [
    isVisible,
    memberId,
    loadMemberData,
    loadCurrentUserData,
    reloadHealthData,
  ]);

  const displayName = memberData?.name || member?.name || username || "Usuário";
  const displayPhone =
    memberData?.phone || phoneNumber || member?.phoneNumber || "";
  const displayEmail = memberData?.email || email || "";

  // Use latestHeight from API, fallback to member or user store based on context
  const displayHeight =
    latestHeight !== null
      ? latestHeight
      : isMemberContext
        ? height > 0
          ? height
          : null
        : heightCm;

  // Use latestWeight from API, fallback to member or user store based on context
  const displayWeight =
    latestWeight !== null
      ? latestWeight
      : isMemberContext
        ? weight > 0
          ? weight
          : null
        : weightKg;

  return (
    <ModalPageWrapper
      header={{
        title: "Perfil",
        description: "Visualize e edite suas informações pessoais",
        icon: <User2 color="black" size={18} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <StyledText variant="mediumSemiBold">Informações pessoais</StyledText>
          <InputBase editable={false} placeholder="Nome" value={displayName} />
          <InputBase
            editable={false}
            placeholder="Telefone"
            secureTextEntry
            value={displayPhone}
          />
          <InputBase
            editable={false}
            placeholder="Email"
            secureTextEntry
            value={displayEmail}
          />
          <StyledText style={{ marginTop: 16 }} variant="mediumSemiBold">
            Dados de saúde
          </StyledText>
          <InputBase
            editable={false}
            placeholder="Peso (kg)"
            value={displayWeight !== null ? displayWeight.toString() : "-"}
          />
          <InputBase
            editable={false}
            placeholder="Altura (cm)"
            value={displayHeight !== null ? displayHeight.toString() : "-"}
          />
          <InputBase
            editable={false}
            placeholder="Pressão Arterial (mmHg)"
            value={latestBloodPressure || "-"}
          />
          <InputBase
            editable={false}
            placeholder="Glicose (mg/dL)"
            value={
              latestBloodSugar !== null ? latestBloodSugar.toString() : "-"
            }
          />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button label="Voltar" onPress={onClose} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
