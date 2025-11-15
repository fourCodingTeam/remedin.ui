import { router } from "expo-router";
import { UserPlus } from "lucide-react-native";
import { useState } from "react";
import { signOut } from "@/auth/signOut";
import { Button, Header, InputSelect, StyledText } from "@/components/ui";
import { MemberCard } from "@/components/ui/MemberCard/MemberCard";
import {
  memberSideMenuConfig,
  sideMenuConfig,
} from "@/constants/sideMenu.config";
import { memberMock } from "@/services/mock/memberMock";
import { useMemberStore } from "@/stores/MemberStore";
import type { MemberState } from "@/stores/MemberStore/@types";
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
  const { username } = useUserStore();
  const {
    setMember,
    member,
    setWeight,
    setHeight,
    setBloodPressure,
    setBloodSugar,
    setAmountOfMedicine,
  } = useMemberStore();
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

  const handleOpenMemberAppById = (member: MemberState["member"]) => {
    setMember(member);
    setWeight(weight);
    setHeight(height);
    setBloodPressure(bloodPressure);
    setBloodSugar(bloodSugar);
    setAmountOfMedicine(amountOfMedicine);
    router.push(`/member/${member.id}`);
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
            sideMenu={sideMenuConfig(username ?? "Usuário", handleLogOut, {
              setIsCalendarModalVisible,
              setIsProfileModalVisible,
              setIsMedicinesModalVisible,
              setIsReportsModalVisible,
              setIsConfigurationsModalVisible,
            })}
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
          <MemberCard
            avatar={require("@/assets/images/adaptive-icon.png")}
            id={1}
            name="Reginaldo Santos"
            onPress={() =>
              handleOpenMemberAppById({
                id: 1,
                name: "Reginaldo Santos",
                phoneNumber: "34996621768",
                avatar: require("@/assets/images/adaptive-icon.png"),
              })
            }
            phoneNumber="34996621768"
          />
        </ContentWrapper>
      </PageWrapper>

      <NewMemberFormModal
        isVisible={isNewMemberModalVisible}
        onClose={() => setIsNewMemberModalVisible(false)}
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
