import { router } from "expo-router";
import { CalendarDays, Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { Button, Header, InputSelect, StyledText } from "@/components/ui";
import { TDCalendar } from "@/components/ui/ClickableThreeDayCalendar";
import { MedicineCheckboxCard } from "@/components/ui/Common/CheckboxCard";
import { useToast } from "@/components/ui/Toast";
import {
  memberSideMenuConfig,
  sideMenuConfig,
} from "@/constants/sideMenu.config";
import { useMedicines } from "@/hooks/useMedicines";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { getDateFromKey, getDateKey } from "@/utils/date/dateKey";
import { mapMedicinesToCardsForDate } from "@/utils/medicine/medicineCardMapper";
import { PageWrapper } from "../Common/PageWrapper";
import { CalendarModal } from "../Modals/CalendarModal/CalendarModal";
import { ConfigurationsModal } from "../Modals/ConfigurationsModal";
import { MedicineFormModal } from "../Modals/MedicineFormModal";
import { MedicinesModal } from "../Modals/MedicinesModal";
import { NotificationsModal } from "../Modals/NotificationsModal";
import { ProfileModal } from "../Modals/ProfileModal";
import { ReportsModal } from "../Modals/ReportsModal";
import { ButtonsWrapper, ScrollableContentWrapper } from "../styles";
import type { HomeProps } from "./Home.types";

export default function Home({ isMemberApp = false }: HomeProps) {
  const { username, signOut, phoneNumber } = useUserStore();
  const { member } = useMemberStore();
  const { showToast } = useToast();
  const { medicines, isLoading, reloadMedicines } = useMedicines();
  const getTodayDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [selectedDate, setSelectedDate] = useState(() => getTodayDate());
  const [selectedFilter, setSelectedFilter] = useState<
    string | number | undefined
  >();
  const [isMedicineFormModalVisible, setIsMedicineFormModalVisible] =
    useState(false);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [isMedicinesModalVisible, setIsMedicinesModalVisible] = useState(false);
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false);
  const [isConfigurationsModalVisible, setIsConfigurationsModalVisible] =
    useState(false);
  const [isNotificationsModalVisible, setIsNotificationsModalVisible] =
    useState(false);
  const filterOptions = [
    { label: "Todas as medicações", value: "all" },
    { label: "Medicações agendadas", value: "scheduled" },
    { label: "Medicações não agendadas", value: "not_scheduled" },
    { label: "Medicações concluídas", value: "completed" },
    { label: "Mais próximas", value: "nearest" },
    { label: "Mais distantes", value: "furthest" },
  ];

  const selectedDateKey = useMemo(
    () => getDateKey(selectedDate),
    [selectedDate]
  );

  const selectedDateObj = useMemo(
    () => getDateFromKey(selectedDateKey),
    [selectedDateKey]
  );

  const medicinesForSelectedDate = useMemo(
    () =>
      mapMedicinesToCardsForDate(medicines, selectedDateObj, selectedDateKey),
    [medicines, selectedDateObj, selectedDateKey]
  );

  const renderMedicinesList = () => {
    if (isLoading) {
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 16 }}
          variant="mediumRegular"
        >
          Carregando medicações...
        </StyledText>
      );
    }

    if (medicinesForSelectedDate.length === 0) {
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 4 }}
          variant="mediumRegular"
        >
          Nenhuma medicação para esta data.
        </StyledText>
      );
    }

    return medicinesForSelectedDate.map(({ id, card }) => (
      <MedicineCheckboxCard
        key={id}
        {...card}
        style={{ marginTop: 4, marginBottom: 4 }}
      />
    ));
  };

  const handleLogOut = async () => {
    await signOut();
    showToast("Logout realizado com sucesso!", "success");
    router.replace("/auth");
  };

  if (isMemberApp) {
    return (
      <PageWrapper
        header={
          <Header
            description="Como está se sentindo hoje?"
            onBellPress={() => setIsNotificationsModalVisible(true)}
            sideMenu={memberSideMenuConfig(member, handleLogOut, {
              setIsCalendarModalVisible,
              setIsProfileModalVisible,
              setIsMedicinesModalVisible,
              setIsReportsModalVisible,
              setIsConfigurationsModalVisible,
            })}
            usuario={member.name ?? "Membro"}
          >
            <TDCalendar date={selectedDate} onDateChange={setSelectedDate} />
            <ButtonsWrapper>
              <Button
                icon={Plus}
                label="Adicionar medicação"
                onPress={() => setIsMedicineFormModalVisible(true)}
                variant="primary"
              />
              <Button
                icon={CalendarDays}
                label="Abrir calendário"
                onPress={() => setIsCalendarModalVisible(true)}
                variant="secondary"
              />
            </ButtonsWrapper>
          </Header>
        }
      >
        <StyledText variant="largeRegular">Medicações</StyledText>
        <InputSelect
          compact
          onChange={setSelectedFilter}
          options={filterOptions}
          placeholder="Filtrar por..."
          value={selectedFilter}
        />
        <ScrollableContentWrapper>
          {renderMedicinesList()}
        </ScrollableContentWrapper>
        <MedicineFormModal
          isVisible={isMedicineFormModalVisible}
          onClose={() => {
            setIsMedicineFormModalVisible(false);
            reloadMedicines();
          }}
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
      </PageWrapper>
    );
  }

  return (
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
          <TDCalendar date={selectedDate} onDateChange={setSelectedDate} />
          <ButtonsWrapper>
            <Button
              icon={Plus}
              label="Adicionar medicação"
              onPress={() => setIsMedicineFormModalVisible(true)}
              variant="primary"
            />
            <Button
              icon={CalendarDays}
              label="Abrir calendário"
              onPress={() => setIsCalendarModalVisible(true)}
              variant="secondary"
            />
          </ButtonsWrapper>
        </Header>
      }
    >
      <StyledText variant="largeRegular">Medicações</StyledText>
      <InputSelect
        compact
        onChange={setSelectedFilter}
        options={filterOptions}
        placeholder="Filtrar por..."
        value={selectedFilter}
      />
      <ScrollableContentWrapper>
        {renderMedicinesList()}
      </ScrollableContentWrapper>
      <MedicineFormModal
        isVisible={isMedicineFormModalVisible}
        onClose={() => {
          setIsMedicineFormModalVisible(false);
          reloadMedicines();
        }}
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
    </PageWrapper>
  );
}
