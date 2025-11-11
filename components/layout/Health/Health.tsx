import { router } from "expo-router";
import {
  Archive,
  Calendar,
  LogOutIcon,
  Settings,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { signOut } from "@/auth/signOut";
import { HealthInfoCard } from "@/components/ui";
import { Header, RegisterHealthInfoCard } from "@/components/ui/Common";
import { theme } from "@/constants/theme";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { PageWrapper } from "../Common";
import { MedicineFormModal } from "../MedicineFormModal";
import {
  CardsWrapper,
  RegisterCardsWrapper,
  ThreeCardsWrapper,
  TwoCardsWrapper,
} from "./Health.styles";
import type { HealthProps } from "./Health.types";
import {
  EditPersonalInformationModal,
  RegisterBloodPressureModal,
  RegisterBloodSugarModal,
  RegisterHeightModal,
  RegisterSymptomsModal,
  RegisterWeightModal,
} from "./modals";

type HealthModalKey =
  | "symptoms"
  | "personal"
  | "bloodSugar"
  | "bloodPressure"
  | "weight"
  | "height"
  | "medicines";

export function Health({ isMemberApp = false }: HealthProps) {
  const {
    weight,
    height,
    bloodPressure,
    bloodSugar,
    amountOfMedicine,
    member,
  } = useMemberStore();

  const { username } = useUserStore();
  const [activeModal, setActiveModal] = useState<HealthModalKey | null>(null);

  const openModal = (modal: HealthModalKey) => {
    setActiveModal(modal);
  };

  const closeModal = (maybeCallback?: unknown) => {
    setActiveModal(null);
    if (typeof maybeCallback === "function") {
      maybeCallback();
    }
  };

  const registerCardConfigs: Array<{
    key: HealthModalKey;
    title: string;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    iconColor?: string;
  }> = [
    {
      key: "symptoms",
      title: "Registrar Sintomas",
      backgroundColor: theme.colors.accent.secondary,
      textColor: theme.colors.background.light,
      iconColor: theme.colors.background.light,
    },
    {
      key: "personal",
      title: "Alterar Informações Pessoais",
      backgroundColor: theme.colors.accent.primary,
      textColor: theme.colors.text.default,
      iconColor: theme.colors.text.default,
    },
    {
      key: "medicines",
      title: "Registrar Medicações",
      backgroundColor: theme.colors.common.black,
      textColor: theme.colors.background.light,
      iconColor: theme.colors.background.light,
    },
    {
      key: "bloodSugar",
      title: "Registrar Glicose",
      backgroundColor: theme.colors.background.light,
      borderColor: theme.colors.accent.secondary,
      iconColor: theme.colors.accent.secondary,
    },
    {
      key: "bloodPressure",
      title: "Registrar Pressão Arterial",
      backgroundColor: theme.colors.background.light,
      borderColor: theme.colors.accent.primary,
      iconColor: theme.colors.accent.primary,
    },
    {
      key: "weight",
      title: "Registrar Peso",
      backgroundColor: theme.colors.background.light,
      borderColor: theme.colors.accent.secondary,
      iconColor: theme.colors.accent.secondary,
    },
    {
      key: "height",
      title: "Registrar Altura",
      backgroundColor: theme.colors.background.light,
      borderColor: theme.colors.accent.secondary,
      iconColor: theme.colors.accent.secondary,
    },
  ];

  const modals = (
    <>
      <RegisterSymptomsModal
        isVisible={activeModal === "symptoms"}
        onClose={closeModal}
      />
      <EditPersonalInformationModal
        isVisible={activeModal === "personal"}
        onClose={closeModal}
      />
      <RegisterBloodSugarModal
        isVisible={activeModal === "bloodSugar"}
        onClose={closeModal}
      />
      <RegisterBloodPressureModal
        isVisible={activeModal === "bloodPressure"}
        onClose={closeModal}
      />
      <RegisterWeightModal
        isVisible={activeModal === "weight"}
        onClose={closeModal}
      />
      <RegisterHeightModal
        isVisible={activeModal === "height"}
        onClose={closeModal}
      />
      <MedicineFormModal
        isVisible={activeModal === "medicines"}
        onClose={() => closeModal()}
      />
    </>
  );

  const handleLogOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  if (isMemberApp) {
    return (
      <>
        <PageWrapper
          header={
            <Header
              description="Como vai a saúde?"
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
                    <LogOutIcon
                      color={theme.colors.warnings.danger}
                      size={18}
                    />
                  ),
                  onPress: handleLogOut,
                },
              }}
              usuario={`${member.name ?? "Usuário"}`}
            />
          }
          isScrollable
        >
          <CardsWrapper>
            <ThreeCardsWrapper>
              <HealthInfoCard
                backgroundColor="secondary"
                color="light"
                title="Peso"
                type="weight"
                unit="kg"
                value={weight.toString()}
              />
              <HealthInfoCard
                backgroundColor="primary"
                color="light"
                secondaryTextColor="dark"
                textColor="dark"
                title="Altura"
                type="weight"
                unit="cm"
                value={height.toString()}
                valueTextColor="dark"
              />
              <HealthInfoCard
                backgroundColor="dark"
                color="dark"
                title="Remédios"
                type="amountOfMedicine"
                value={amountOfMedicine.toString()}
              />
            </ThreeCardsWrapper>
            <TwoCardsWrapper>
              <HealthInfoCard
                backgroundColor="light"
                color="dark"
                title="Pressão Arterial"
                type="bloodPressure"
                unit="mmHg"
                value={bloodPressure.toString()}
              />
              <HealthInfoCard
                backgroundColor="light"
                color="dark"
                title="Glicose"
                type="bloodSugar"
                unit="mg/dL"
                value={bloodSugar.toString()}
              />
            </TwoCardsWrapper>
            <RegisterCardsWrapper>
              {registerCardConfigs.map(({ key, ...card }) => (
                <RegisterHealthInfoCard
                  key={key}
                  {...card}
                  onPress={() => openModal(key)}
                />
              ))}
            </RegisterCardsWrapper>
          </CardsWrapper>
        </PageWrapper>
        {modals}
      </>
    );
  }

  return (
    <>
      <PageWrapper
        header={
          <Header
            description="Como vai a saúde?"
            sideMenu={{
              userPhone: "99999999999",
              userName: username ?? undefined,
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
            <CardsWrapper>
              <ThreeCardsWrapper>
                <HealthInfoCard
                  backgroundColor="secondary"
                  color="light"
                  title="Peso"
                  type="weight"
                  unit="kg"
                  value="80"
                />
                <HealthInfoCard
                  backgroundColor="primary"
                  color="light"
                  secondaryTextColor="dark"
                  textColor="dark"
                  title="Altura"
                  type="weight"
                  unit="cm"
                  value="180"
                  valueTextColor="dark"
                />
                <HealthInfoCard
                  backgroundColor="dark"
                  color="dark"
                  title="Remédios"
                  type="amountOfMedicine"
                  value="5"
                />
              </ThreeCardsWrapper>
              <TwoCardsWrapper>
                <HealthInfoCard
                  backgroundColor="light"
                  color="dark"
                  title="Pressão Arterial"
                  type="bloodPressure"
                  unit="mmHg"
                  value="120/80"
                />
                <HealthInfoCard
                  backgroundColor="light"
                  color="dark"
                  title="Glicose"
                  type="bloodSugar"
                  unit="mg/dL"
                  value="100"
                />
              </TwoCardsWrapper>
            </CardsWrapper>
          </Header>
        }
        isScrollable
      >
        <RegisterCardsWrapper>
          {registerCardConfigs.map(({ key, ...card }) => (
            <RegisterHealthInfoCard
              key={key}
              {...card}
              onPress={() => openModal(key)}
            />
          ))}
        </RegisterCardsWrapper>
      </PageWrapper>
      {modals}
    </>
  );
}
