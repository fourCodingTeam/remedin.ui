import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Button, InputBase } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useHealthData, useMemberContext } from "@/hooks";
import { getMemberById, updatePerson } from "@/services/api/person";
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
  const { memberId } = useMemberContext();
  const { showToast } = useToast();
  const { reload: reloadHealthData } = useHealthData();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [heightValue, setHeightValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load user data when modal opens
  useEffect(() => {
    if (!isVisible) {
      setName("");
      setPhone("");
      setEmailValue("");
      setWeightValue("");
      setHeightValue("");
      return;
    }

    const loadUserData = async () => {
      if (memberId) {
        // First set from store (if available), then try API to update
        setName(member?.name || "");
        setPhone(member?.phoneNumber || "");
        setEmailValue("");
        setWeightValue(weight > 0 ? weight.toString() : "");
        setHeightValue(height > 0 ? height.toString() : "");

        // Then load from API to get latest data
        try {
          const token = await getAuthToken();
          if (token) {
            const response = await getMemberById(memberId, token);
            if (response.success && response.data) {
              setName(response.data.name || member?.name || "");
              setPhone(response.data.phone ?? member?.phoneNumber ?? "");
              setEmailValue(response.data.email || "");
              if (response.data.weightKg != null) {
                setWeightValue(response.data.weightKg.toString());
              }
              if (response.data.heightCm != null) {
                setHeightValue(response.data.heightCm.toString());
              }
            }
          }
        } catch {
          // Ignore errors, keep store values
        }
      } else {
        // Use user store data directly (loaded on login)
        setName(username || "");
        setPhone(phoneNumber || "");
        setEmailValue(email || "");
        setWeightValue(weightKg != null ? weightKg.toString() : "");
        setHeightValue(heightCm != null ? heightCm.toString() : "");
      }
    };

    loadUserData();
  }, [
    isVisible,
    memberId,
    member,
    username,
    email,
    phoneNumber,
    weight,
    height,
    weightKg,
    heightCm,
  ]);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        setIsLoading(false);
        return;
      }

      const personIdToUpdate = memberId || userId;
      if (!personIdToUpdate) {
        showToast("Erro ao identificar usuário", "error");
        setIsLoading(false);
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
      setIsLoading(false);
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
