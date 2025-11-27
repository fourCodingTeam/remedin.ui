import { router } from "expo-router";
import { UserPlus } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { signOut } from "@/auth/signOut";
import { Button, Header, InputSelect, StyledText } from "@/components/ui";
import { MemberCard } from "@/components/ui/MemberCard/MemberCard";
import { useToast } from "@/components/ui/Toast";
import {
  memberSideMenuConfig,
  sideMenuConfig,
} from "@/constants/sideMenu.config";
import { theme } from "@/constants/theme";
import { getMembersByOwner } from "@/services/api/person";
import { memberMock } from "@/services/mock/memberMock";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { PageWrapper } from "../Common/PageWrapper";
import { CalendarModal } from "../Modals/CalendarModal";
import { ConfigurationsModal } from "../Modals/ConfigurationsModal";
import { MedicinesModal } from "../Modals/MedicinesModal";
import { NewMemberFormModal } from "../Modals/NewMemberFormModal";
import { NotificationsModal } from "../Modals/NotificationsModal";
import { ProfileModal } from "../Modals/ProfileModal";
import { ReportsModal } from "../Modals/ReportsModal";
import { ContentWrapper } from "../styles";
import type { MembersProps } from "./Members.types";

export function Members({ isMemberApp = false }: MembersProps) {
  const [isNewMemberModalVisible, setIsNewMemberModalVisible] = useState(false);
  const { username, phoneNumber } = useUserStore();
  const {
    setMember,
    member,
    setWeight,
    setHeight,
    setBloodPressure,
    setBloodSugar,
    setAmountOfMedicine,
  } = useMemberStore();
  const { showToast } = useToast();
  const [membersList, setMembersList] = useState<
    Array<{
      id: string;
      name: string;
      email: string;
    }>
  >([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isMedicinesModalVisible, setIsMedicinesModalVisible] = useState(false);
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  const [isConfigurationsModalVisible, setIsConfigurationsModalVisible] =
    useState(false);
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] =
    useState(false);
  const [selectedFilter, setSelectedFilter] = useState<
    string | number | undefined
  >();

  const { weight, height, bloodPressure, bloodSugar, amountOfMedicine } =
    memberMock;

  const filterOptions = [
    { label: "Todos os membros", value: "all" },
    { label: "Membros ativos", value: "active" },
    { label: "Membros inativos", value: "inactive" },
  ];

  const loadMembers = useCallback(async () => {
    setIsLoadingMembers(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        return;
      }

      const response = await getMembersByOwner(token);
      if (response.success && response.data) {
        setMembersList(response.data);
      } else {
        showToast(response.message || "Erro ao carregar membros", "error");
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao carregar membros",
        "error"
      );
    } finally {
      setIsLoadingMembers(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isMemberApp) {
      loadMembers();
    }
  }, [isMemberApp, loadMembers]);

  const handleOpenMemberAppById = (memberData: {
    id: string;
    name: string;
    email: string;
  }) => {
    if (!memberData.id || memberData.id.trim() === "") {
      showToast("ID do membro inválido", "error");
      return;
    }

    // Converter GUID string para número simples usando hash (apenas para compatibilidade com MemberStore)
    // O importante é que router.push usa o GUID correto
    const numericId =
      memberData.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1_000_000;

    setMember({
      id: numericId,
      name: memberData.name,
      phoneNumber: "",
      avatar: "",
    });
    setWeight(weight);
    setHeight(height);
    setBloodPressure(bloodPressure);
    setBloodSugar(bloodSugar);
    setAmountOfMedicine(amountOfMedicine);
    router.push(`/member/${memberData.id}`);
  };

  const handleMemberCreated = () => {
    loadMembers();
  };

  const handleLogOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  if (isMemberApp) {
    return (
      <PageWrapper
        header={
          <Header
            description="Quem gostaria de ver?"
            onBellPress={() => setIsNotificationsModalVisible(true)}
            sideMenu={memberSideMenuConfig(member, handleLogOut, {
              setIsCalendarModalVisible,
              setIsProfileModalVisible,
              setIsMedicinesModalVisible,
              setIsReportsModalVisible,
              setIsConfigurationsModalVisible,
            })}
            usuario={member.name ?? "Membro"}
          />
        }
        isScrollable
      >
        <ContentWrapper>
          <StyledText variant="largeRegular">Membros</StyledText>
          <InputSelect
            compact
            onChange={setSelectedFilter}
            options={filterOptions}
            placeholder="Filtrar por..."
            value={selectedFilter}
          />
          <MemberCard
            avatar={require("@/assets/images/adaptive-icon.png")}
            id={1}
            isUser
            name="Você"
            onPress={() => router.dismissTo("/(tabs)")}
            phoneNumber="34996621768"
          />
        </ContentWrapper>
        <ProfileModal
          isVisible={isProfileModalVisible}
          onClose={() => setIsProfileModalVisible(false)}
        />
        <MedicinesModal
          isVisible={isMedicinesModalVisible}
          onClose={() => setIsMedicinesModalVisible(false)}
        />
        <ReportsModal
          isVisible={isReportsModalVisible}
          onClose={() => setIsReportsModalVisible(false)}
        />
        <ConfigurationsModal
          isVisible={isConfigurationsModalVisible}
          onClose={() => setIsConfigurationsModalVisible(false)}
        />
        <NotificationsModal
          isVisible={isNotificationsModalVisible}
          onClose={() => setIsNotificationsModalVisible(false)}
        />
      </PageWrapper>
    );
  }

  return (
    <>
      <PageWrapper
        header={
          <Header
            description="Como está se sentindo hoje?"
            onBellPress={() => setIsNotificationsModalVisible(true)}
            sideMenu={sideMenuConfig(
              username ?? "Usuário",
              phoneNumber ?? "",
              handleLogOut,
              {
                setIsCalendarModalVisible,
                setIsProfileModalVisible,
                setIsMedicinesModalVisible,
                setIsReportsModalVisible,
                setIsConfigurationsModalVisible,
              }
            )}
            usuario={username ?? "Usuário"}
          >
            <Button
              icon={UserPlus}
              label="Adicionar membro"
              onPress={() => setIsNewMemberModalVisible(true)}
              variant="primary"
            />
          </Header>
        }
        isScrollable
      >
        <ContentWrapper>
          <StyledText variant="largeRegular">Membros</StyledText>
          <InputSelect
            compact
            onChange={setSelectedFilter}
            options={filterOptions}
            placeholder="Filtrar por..."
            value={selectedFilter}
          />
          {membersList
            .filter(
              (memberData) => memberData.id && memberData.id.trim() !== ""
            )
            .map((memberData) => {
              // Converter GUID string para número simples usando hash (apenas para compatibilidade com MemberCard)
              const numericId = memberData.id
                ? memberData.id
                    .split("")
                    .reduce((acc, char) => acc + char.charCodeAt(0), 0) %
                  1_000_000
                : 0;

              return (
                <MemberCard
                  avatar={require("@/assets/images/adaptive-icon.png")}
                  id={numericId}
                  key={memberData.id}
                  name={memberData.name || "Sem nome"}
                  onPress={() => handleOpenMemberAppById(memberData)}
                  phoneNumber=""
                />
              );
            })}
          {membersList.length === 0 && !isLoadingMembers && (
            <StyledText
              style={{ textAlign: "center", color: theme.colors.text.muted }}
              variant="mediumRegular"
            >
              Nenhum membro cadastrado ainda.
            </StyledText>
          )}
        </ContentWrapper>
      </PageWrapper>

      <NewMemberFormModal
        isVisible={isNewMemberModalVisible}
        onClose={() => setIsNewMemberModalVisible(false)}
        onMemberCreated={handleMemberCreated}
      />
      <CalendarModal
        isVisible={isCalendarModalVisible}
        onClose={() => setIsCalendarModalVisible(false)}
      />
      <ProfileModal
        isVisible={isProfileModalVisible}
        onClose={() => setIsProfileModalVisible(false)}
      />
      <MedicinesModal
        isVisible={isMedicinesModalVisible}
        onClose={() => setIsMedicinesModalVisible(false)}
      />
      <ReportsModal
        isVisible={isReportsModalVisible}
        onClose={() => setIsReportsModalVisible(false)}
      />
      <ConfigurationsModal
        isVisible={isConfigurationsModalVisible}
        onClose={() => setIsConfigurationsModalVisible(false)}
      />
      <NotificationsModal
        isVisible={isNotificationsModalVisible}
        onClose={() => setIsNotificationsModalVisible(false)}
      />
    </>
  );
}
