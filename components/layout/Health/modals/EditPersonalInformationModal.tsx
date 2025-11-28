import { Pencil } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Button, InputBase } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { GetCurrentPerson, getMemberById, updatePerson } from "@/services/api/person";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { ModalPageWrapper } from "../../Common/ModalPageWrapper";
import {
  ButtonsWrapper,
  FormContentWrapper,
  InputsWrapper,
} from "../../styles";
import type { HealthFormModalProps } from "./HealthFormModal.types";

export function EditPersonalInformationModal({
  isVisible,
  onClose,
}: HealthFormModalProps) {
  const { member, setMember, weight, height, setWeight, setHeight } =
    useMemberStore();
  const {
    username,
    email,
    phoneNumber,
    weightKg,
    heightCm,
    userId,
    setPersonData,
  } = useUserStore();
  const { memberId, isMemberContext } = useMemberContext();
  const { showToast } = useToast();
  const { reload: reloadHealthData } = useHealthData();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadMemberData = useCallback(async () => {
    if (!member.id) {
      return;
    }

    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Erro de autenticação", "error");
        return;
      }

      const response = await getMemberById(member.id, token);
      if (response.success && response.data) {
        setName(response.data.name || member?.name || "");
        setPhone(response.data.phone ?? member?.phoneNumber ?? "");
        setEmailValue(response.data.email || "");
        if (response.data.weightKg != null) {
          setWeightValue(response.data.weightKg.toString());
        } else if (weight > 0) {
          setWeightValue(weight.toString());
        } else {
          setWeightValue("");
        }
        if (response.data.heightCm != null) {
          setHeightValue(response.data.heightCm.toString());
        } else if (height > 0) {
          setHeightValue(height.toString());
        } else {
          setHeightValue("");
        }
      } else {
        // Fallback to store values
        setName(member?.name || "");
        setPhone(member?.phoneNumber || "");
        setEmailValue("");
        setWeightValue(weight > 0 ? weight.toString() : "");
        setHeightValue(height > 0 ? height.toString() : "");
        showToast(
          response.message || "Erro ao carregar dados do membro",
          "error"
        );
      }
    } catch (error) {
      // Fallback to store values
      setName(member?.name || "");
      setPhone(member?.phoneNumber || "");
      setEmailValue("");
      setWeightValue(weight > 0 ? weight.toString() : "");
      setHeightValue(height > 0 ? height.toString() : "");
      showToast(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados do membro",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [memberId, member, weight, height, showToast]);

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
        setName(response.data.name || username || "");
        setPhone(response.data.phone ?? phoneNumber ?? "");
        setEmailValue(response.data.email || email || "");
        if (response.data.weightKg != null) {
          setWeightValue(response.data.weightKg.toString());
        } else if (weightKg != null) {
          setWeightValue(weightKg.toString());
        } else {
          setWeightValue("");
        }
        if (response.data.heightCm != null) {
          setHeightValue(response.data.heightCm.toString());
        } else if (heightCm != null) {
          setHeightValue(heightCm.toString());
        } else {
          setHeightValue("");
        }
      } else {
        // Fallback to store values
        setName(username || "");
        setPhone(phoneNumber || "");
        setEmailValue(email || "");
        setWeightValue(weightKg != null ? weightKg.toString() : "");
        setHeightValue(heightCm != null ? heightCm.toString() : "");
      }
    } catch {
      // Silently fail - will use fallback values
      setName(username || "");
      setPhone(phoneNumber || "");
      setEmailValue(email || "");
      setWeightValue(weightKg != null ? weightKg.toString() : "");
      setHeightValue(heightCm != null ? heightCm.toString() : "");
    } finally {
      setIsLoading(false);
    }
  }, [username, email, phoneNumber, weightKg, heightCm, showToast]);

  useEffect(() => {
    if (!isVisible) {
      setName("");
      setPhone("");
      setEmailValue("");
      setWeightValue("");
      setHeightValue("");
      return;
    }

    if (isVisible && member.id) {
      console.log("member.id:", member.id);
      loadMemberData();
      reloadHealthData();
    } else if (isVisible && !memberId) {
      loadCurrentUserData();
      reloadHealthData();
    }
  }, [
    isVisible,
    memberId,
    loadMemberData,
    loadCurrentUserData,
    reloadHealthData,
  ]);

  const handleConfirm = async () => {
    setIsSaving(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        setIsSaving(false);
        return;
      }

      const personIdToUpdate = memberId || userId;
      if (!personIdToUpdate) {
        showToast("Erro ao identificar usuário", "error");
        setIsSaving(false);
        return;
      }

      const parsedWeight =
        weightValue.trim() !== ""
          ? Number.parseFloat(weightValue.replace(",", "."))
          : null;
      const parsedHeight =
        heightValue.trim() !== ""
          ? Number.parseInt(heightValue.replace(",", "."), 10)
          : null;

      const updateRequest: {
        name?: string;
        phone?: string;
        email?: string;
        weightKg?: number;
        heightCm?: number;
      } = {};

      if (name.trim() !== "") {
        updateRequest.name = name.trim();
      }
      if (phone.trim() !== "") {
        updateRequest.phone = phone.trim();
      }
      if (emailValue.trim() !== "") {
        updateRequest.email = emailValue.trim();
      }
      if (
        parsedWeight !== null &&
        !Number.isNaN(parsedWeight) &&
        parsedWeight > 0
      ) {
        updateRequest.weightKg = parsedWeight;
      }
      if (
        parsedHeight !== null &&
        !Number.isNaN(parsedHeight) &&
        parsedHeight > 0
      ) {
        updateRequest.heightCm = parsedHeight;
      }

      const response = await updatePerson(
        personIdToUpdate,
        updateRequest,
        token
      );

      if (response.success && response.data) {
        showToast("Informações atualizadas com sucesso!", "success");

        if (memberId) {
          setMember({
            ...member,
            name: response.data.name || member.name,
          });
          if (parsedWeight !== null && !Number.isNaN(parsedWeight)) {
            setWeight(parsedWeight);
          }
          if (parsedHeight !== null && !Number.isNaN(parsedHeight)) {
            setHeight(parsedHeight);
          }
        } else if (response.data) {
          setPersonData({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            username: response.data.username || "",
            phone: response.data.phone,
            birthDate: response.data.birthDate,
            weightKg: response.data.weightKg,
            heightCm: response.data.heightCm,
          });
        }

        reloadHealthData();
        onClose();
      } else {
        showToast(response.message || "Erro ao atualizar informações", "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Erro ao atualizar informações",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => onClose();

  return (
    <ModalPageWrapper
      header={{
        title: "Alterar informações pessoais",
        description: "Atualize suas informações cadastrais",
        icon: <Pencil color="black" size={20} />,
      }}
      isVisible={isVisible}
      onClose={onClose}
    >
      <FormContentWrapper>
        <InputsWrapper>
          <InputBase onChangeText={setName} placeholder="Nome" value={name} />
          <InputBase
            onChangeText={setPhone}
            placeholder="Telefone"
            value={phone}
          />
          <InputBase
            onChangeText={setEmailValue}
            placeholder="Email"
            value={emailValue}
          />
          <InputBase
            keyboardType="numeric"
            onChangeText={setWeightValue}
            placeholder="Peso (kg)"
            value={weightValue}
          />
          <InputBase
            keyboardType="numeric"
            onChangeText={setHeightValue}
            placeholder="Altura (cm)"
            value={heightValue}
          />
        </InputsWrapper>
        <ButtonsWrapper addPadding>
          <Button
            isLoading={isLoading}
            label="Confirmar"
            onPress={handleConfirm}
            variant="primary"
          />
          <Button label="Cancelar" onPress={handleCancel} variant="outline" />
        </ButtonsWrapper>
      </FormContentWrapper>
    </ModalPageWrapper>
  );
}
