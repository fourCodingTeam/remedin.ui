import { router } from "expo-router";
import {
  Archive,
  Calendar,
  LogOutIcon,
  Settings,
  User,
  UserPlus,
} from "lucide-react-native";
import { useState } from "react";
import { signOut } from "@/auth/signOut";
import { Button, Header, InputSelect, StyledText } from "@/components/ui";
import { MemberCard } from "@/components/ui/MemberCard/MemberCard";
import { theme } from "@/constants/theme";
import { memberMock } from "@/services/mock/memberMock";
import { useMemberStore } from "@/stores/MemberStore";
import type { MemberState } from "@/stores/MemberStore/@types";
import { useUserStore } from "@/stores/UserStore";
import { PageWrapper } from "../Common/PageWrapper";
import { NewMemberFormModal } from "../NewMemberFormModal";
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
            sideMenu={{
              userPhone: member.phoneNumber ?? undefined,
              userName: member.name ?? undefined,
              menuItems: [
                {
                  id: "1",
                  label: "Perfil",
                  icon: () => <User size={18} />,
                },
                {
                  id: "2",
                  label: "Calendário",
                  icon: () => <Calendar size={18} />,
                },
                {
                  id: "3",
                  label: "Medicações",
                  icon: () => <Archive size={18} />,
                },
                {
                  id: "4",
                  label: "Configurações",
                  icon: () => <Settings size={18} />,
                },
              ],
              footerAction: {
                label: "Sair",
                icon: () => (
                  <LogOutIcon color={theme.colors.warnings.danger} size={18} />
                ),
                onPress: handleLogOut,
              },
            }}
            usuario={`${member.name ?? "Usuário"}`}
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
      </PageWrapper>
    );
  }

  return (
    <>
      <PageWrapper
        header={
          <Header
            description="Como está se sentindo hoje?"
            sideMenu={{
              userName: username ?? undefined,
              userPhone: "99999999999",
              menuItems: [
                {
                  id: "1",
                  label: "Perfil",
                  icon: () => <User size={18} />,
                },
                {
                  id: "2",
                  label: "Calendário",
                  icon: () => <Calendar size={18} />,
                },
                {
                  id: "3",
                  label: "Medicações",
                  icon: () => <Archive size={18} />,
                },
                {
                  id: "4",
                  label: "Configurações",
                  icon: () => <Settings size={18} />,
                },
              ],
              footerAction: {
                label: "Sair",
                icon: () => (
                  <LogOutIcon color={theme.colors.warnings.danger} size={18} />
                ),
                onPress: handleLogOut,
              },
            }}
            usuario={username ?? undefined}
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
    </>
  );
}
