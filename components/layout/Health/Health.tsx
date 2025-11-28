import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { signOut } from "@/auth/signOut";
import { HealthInfoCard } from "@/components/ui";
import { Header, RegisterHealthInfoCard } from "@/components/ui/Common";
import {
  memberSideMenuConfig,
  sideMenuConfig,
} from "@/constants/sideMenu.config";
import { theme } from "@/constants/theme";
import { useHealthData, useMemberContext } from "@/hooks";
import { getAllMedicines } from "@/services/api/medicine";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { PageWrapper } from "../Common/PageWrapper";
import { CalendarModal } from "../Modals/CalendarModal";
import { ConfigurationsModal } from "../Modals/ConfigurationsModal";
import { MedicineFormModal } from "../Modals/MedicineFormModal";
import { MedicinesModal } from "../Modals/MedicinesModal";
import { NotificationsModal } from "../Modals/NotificationsModal";
import { ProfileModal } from "../Modals/ProfileModal";
import { ReportsModal } from "../Modals/ReportsModal";
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
  const { member, weight, height } = useMemberStore();
  const { username, phoneNumber, token, weightKg, heightCm } = useUserStore();
  const { memberId, isMemberContext } = useMemberContext();
  
  // Use memberId from context if available, otherwise use member.id (similar to Home.tsx)
  const effectiveMemberId = isMemberApp ? (member.id || memberId) : memberId;
  
  const {
    latestWeight,
    latestHeight,
    latestBloodPressure,
    latestBloodSugar,
    isLoading: isLoadingHealth,
    reload: reloadHealth,
  } = useHealthData(effectiveMemberId);

  const displayHeight =
    latestHeight !== null
      ? latestHeight
      : isMemberApp || isMemberContext
        ? height > 0
          ? height
          : null
        : heightCm;

  const displayWeight =
    latestWeight !== null
      ? latestWeight
      : isMemberApp || isMemberContext
        ? weight > 0
          ? weight
          : null
        : weightKg;
  const [medicinesCount, setMedicinesCount] = useState(0);
  const [isLoadingMedicines, setIsLoadingMedicines] = useState(false);
  // Guardar o memberId que foi usado para carregar a contagem de medicamentos
  const [loadedMedicinesMemberId, setLoadedMedicinesMemberId] = useState<string | null | undefined>(null);
  const [activeModal, setActiveModal] = useState<HealthModalKey | null>(null);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isMedicinesModalVisible, setIsMedicinesModalVisible] = useState(false);
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  const [isConfigurationsModalVisible, setIsConfigurationsModalVisible] =
    useState(false);
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] =
    useState(false);

  const loadMedicinesCount = useCallback(async (forceReload = false) => {
    if (!token) {
      return;
    }

    // Se o memberId for o mesmo e não for um reload forçado, não recarregar
    if (!forceReload && effectiveMemberId === loadedMedicinesMemberId && loadedMedicinesMemberId !== null) {
      return;
    }

    setIsLoadingMedicines(true);
    try {
      const response = await getAllMedicines(
        token,
        1,
        1,
        effectiveMemberId || undefined
      );
      if (response.success && response.data) {
        setMedicinesCount(response.data.totalCount || 0);
        // Atualizar o memberId que foi usado para carregar
        setLoadedMedicinesMemberId(effectiveMemberId);
      }
    } catch {
      // Silently fail - will show default value
    } finally {
      setIsLoadingMedicines(false);
    }
  }, [token, effectiveMemberId, loadedMedicinesMemberId]);

  useEffect(() => {
    loadMedicinesCount();
  }, [loadMedicinesCount]);

  // Recarregar dados quando a página é focada (força reload mesmo se ID for o mesmo)
  useFocusEffect(
    useCallback(() => {
      reloadHealth();
      loadMedicinesCount(true);
    }, [reloadHealth, loadMedicinesCount])
  );

  const openModal = (modal: HealthModalKey) => {
    setActiveModal(modal);
  };

  const closeModal = (maybeCallback?: unknown) => {
    setActiveModal(null);
    if (typeof maybeCallback === "function") {
      maybeCallback();
    }
    // Reload health data when modal closes to update displayed values
    reloadHealth();
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
        onClose={() => {
          closeModal();
          loadMedicinesCount();
        }}
      />
      <CalendarModal
        isVisible={isCalendarModalVisible}
        onClose={() => setIsCalendarModalVisible(false)}
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
              onBellPress={() => setIsNotificationsModalVisible(true)}
              sideMenu={memberSideMenuConfig(member, handleLogOut, {
                setIsCalendarModalVisible,
                setIsProfileModalVisible,
                setIsMedicinesModalVisible,
                setIsReportsModalVisible,
                setIsConfigurationsModalVisible,
              })}
              usuario={member.name ?? undefined}
            />
          }
          isScrollable
        >
          <CardsWrapper>
            <ThreeCardsWrapper>
              <HealthInfoCard
                backgroundColor="secondary"
                color="light"
                isLoading={isLoadingHealth}
                title="Peso"
                type="weight"
                unit="kg"
                value={displayWeight !== null ? displayWeight.toString() : "-"}
              />
              <HealthInfoCard
                backgroundColor="primary"
                color="light"
                isLoading={isLoadingHealth}
                secondaryTextColor="dark"
                textColor="dark"
                title="Altura"
                type="weight"
                unit="cm"
                value={displayHeight !== null ? displayHeight.toString() : "-"}
                valueTextColor="dark"
              />
              <HealthInfoCard
                backgroundColor="dark"
                color="dark"
                isLoading={isLoadingMedicines}
                onPress={() => setIsMedicinesModalVisible(true)}
                title="Remédios"
                type="amountOfMedicine"
                value={medicinesCount.toString()}
              />
            </ThreeCardsWrapper>
            <TwoCardsWrapper>
              <HealthInfoCard
                backgroundColor="light"
                color="dark"
                isLoading={isLoadingHealth}
                title="Pressão Arterial"
                type="bloodPressure"
                unit="mmHg"
                value={latestBloodPressure || "-"}
              />
              <HealthInfoCard
                backgroundColor="light"
                color="dark"
                isLoading={isLoadingHealth}
                title="Glicose"
                type="bloodSugar"
                unit="mg/dL"
                value={
                  latestBloodSugar !== null ? latestBloodSugar.toString() : "-"
                }
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

  return (
    <>
      <PageWrapper
        header={
          <Header
            description="Como vai a saúde?"
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
            <CardsWrapper>
              <ThreeCardsWrapper>
                <HealthInfoCard
                  backgroundColor="secondary"
                  color="light"
                  isLoading={isLoadingHealth}
                  title="Peso"
                  type="weight"
                  unit="kg"
                  value={
                    displayWeight !== null ? displayWeight.toString() : "-"
                  }
                />
                <HealthInfoCard
                  backgroundColor="primary"
                  color="light"
                  isLoading={isLoadingHealth}
                  secondaryTextColor="dark"
                  textColor="dark"
                  title="Altura"
                  type="weight"
                  unit="cm"
                  value={
                    displayHeight !== null ? displayHeight.toString() : "-"
                  }
                  valueTextColor="dark"
                />
                <HealthInfoCard
                  backgroundColor="dark"
                  color="dark"
                  isLoading={isLoadingMedicines}
                  onPress={() => setIsMedicinesModalVisible(true)}
                  title="Remédios"
                  type="amountOfMedicine"
                  value={medicinesCount.toString()}
                />
              </ThreeCardsWrapper>
              <TwoCardsWrapper>
                <HealthInfoCard
                  backgroundColor="light"
                  color="dark"
                  isLoading={isLoadingHealth}
                  title="Pressão Arterial"
                  type="bloodPressure"
                  unit="mmHg"
                  value={latestBloodPressure || "-"}
                />
                <HealthInfoCard
                  backgroundColor="light"
                  color="dark"
                  isLoading={isLoadingHealth}
                  title="Glicose"
                  type="bloodSugar"
                  unit="mg/dL"
                  value={
                    latestBloodSugar !== null
                      ? latestBloodSugar.toString()
                      : "-"
                  }
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
