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
import { useMedicines, useMemberContext } from "@/hooks";
import { useDoseOccurrencesForDate } from "@/hooks/useDoseOccurrencesForDate";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { getDateFromKey, getDateKey } from "@/utils/date/dateKey";
import {
  enrichCardsWithDoseStatus,
  mapMedicinesToCardsForDate,
} from "@/utils/medicine/medicineCardMapper";
import { PageWrapper } from "../Common/PageWrapper";
import { CalendarModal } from "../Modals/CalendarModal/CalendarModal";
import { ConfigurationsModal } from "../Modals/ConfigurationsModal";
import { MedicineAdherenceModal } from "../Modals/MedicineAdherenceModal/MedicineAdherenceModal";
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
  const { memberId } = useMemberContext();
  
  // Use memberId from context if available, otherwise use member.id
  const effectiveMemberId = isMemberApp ? (member.id || memberId) : memberId;
  
  const { medicines, isLoading, reloadMedicines } = useMedicines(effectiveMemberId);
  const getTodayDate = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const [selectedDate, setSelectedDate] = useState(() => getTodayDate());

  // Fetch dose occurrences for selected date
  const {
    doseOccurrences,
    isLoading: isLoadingDoses,
    reload: reloadDoses,
  } = useDoseOccurrencesForDate(selectedDate, effectiveMemberId);
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
  const [isMedicineAdherenceModalVisible, setIsMedicineAdherenceModalVisible] =
    useState(false);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string | null>(
    null
  );
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null
  );
  const filterOptions = [
    { label: "Todas as medicações", value: "all" },
    { label: "Medicações agendadas", value: "scheduled" },
    { label: "Medicações não agendadas", value: "not_scheduled" },
    { label: "Medicações concluídas", value: "completed" },
    { label: "Medicações pendentes", value: "pending" },
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

  const medicinesForSelectedDate = useMemo(() => {
    const cards = mapMedicinesToCardsForDate(
      medicines,
      selectedDateObj,
      selectedDateKey
    );

    const enrichedCards = enrichCardsWithDoseStatus(cards, doseOccurrences);

    let validCards = enrichedCards.filter((card) => {
      const isValid =
        card &&
        card.card &&
        card.card.value &&
        typeof card.card.value === "string";
      if (!isValid) {
        console.warn(
          "[Home] Filtered out invalid card after enrichment:",
          card
        );
      }
      return isValid;
    });

    if (selectedFilter === "not_scheduled") {
      const medicinesWithoutSchedules = medicines.filter(
        (med) => !med.schedules || med.schedules.length === 0
      );
      if (medicinesWithoutSchedules.length === 0) {
        return [];
      }
      return [];
    }

    if (selectedFilter && selectedFilter !== "all") {
      validCards = validCards.filter((card) => {
        switch (selectedFilter) {
          case "scheduled":
            return true;
          
          case "completed":
            return card.card.isCompleted === true;
          
          case "pending":
            return !card.card.isCompleted && !card.card.isForgotten;
          
          case "nearest":
            return true;
          
          case "furthest":
            return true;
          
          default:
            return true;
        }
      });

      if (selectedFilter === "nearest") {
        validCards = [...validCards].sort((a, b) => {
          const timeA = a.card.scheduleLabel?.split(" - ")[0] || "";
          const timeB = b.card.scheduleLabel?.split(" - ")[0] || "";
          return timeA.localeCompare(timeB);
        });
      } else if (selectedFilter === "furthest") {
        validCards = [...validCards].sort((a, b) => {
          const timeA = a.card.scheduleLabel?.split(" - ")[0] || "";
          const timeB = b.card.scheduleLabel?.split(" - ")[0] || "";
          return timeB.localeCompare(timeA);
        });
      }
    }

    return validCards;
  }, [medicines, selectedDateObj, selectedDateKey, doseOccurrences, selectedFilter]);

  const renderMedicinesList = () => {
    if (isLoading || isLoadingDoses) {
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
      const filterLabel = filterOptions.find(
        (opt) => opt.value === selectedFilter
      )?.label;
      return (
        <StyledText
          color="muted"
          style={{ textAlign: "center", marginTop: 4 }}
          variant="mediumRegular"
        >
          {selectedFilter && selectedFilter !== "all"
            ? `Nenhuma medicação encontrada para o filtro "${filterLabel}".`
            : "Nenhuma medicação para esta data."}
        </StyledText>
      );
    }

    return medicinesForSelectedDate
      .map((item, index) => {
        if (!(item && item.card && item.id)) {
          console.warn(
            `[Home] Invalid item structure at index ${index}:`,
            item
          );
          return null;
        }

        const { id, card, date: cardDateKey } = item;

        if (!(card && card.value) || typeof card.value !== "string") {
          console.warn(
            `[Home] Missing or invalid card.value at index ${index}:`,
            {
              cardValue: card?.value,
              cardStructure: card,
              itemId: id,
            }
          );
          return null;
        }

        const separator = "|";
        let parts: string[];

        try {
          parts = card.value.split(separator);
        } catch (error) {
          console.warn("Error splitting card.value:", card.value, error);
          return null;
        }

        if (parts.length !== 2) {
          return null;
        }

        const [medicineId, scheduleId] = parts;

        let cardDate: Date;
        try {
          cardDate = getDateFromKey(cardDateKey);
        } catch {
          cardDate = getTodayDate();
        }

        return (
          <MedicineCheckboxCard
            key={id}
            checked={card.checked}
            extraLines={card.extraLines}
            isCompleted={card.isCompleted}
            isForgotten={card.isForgotten}
            scheduleLabel={card.scheduleLabel}
            statusLabel={card.statusLabel}
            title={card.title}
            tone={card.tone}
            value={card.value}
            onPress={() => {
              setSelectedMedicineId(medicineId);
              setSelectedScheduleId(scheduleId);
              setSelectedDateForModal(cardDate);
              setIsMedicineAdherenceModalVisible(true);
            }}
            style={{ marginTop: 4, marginBottom: 4 }}
          />
        );
      })
      .filter(Boolean);
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
        {selectedMedicineId && selectedScheduleId && selectedDateForModal && (
          <MedicineAdherenceModal
            date={selectedDateForModal}
            isVisible={isMedicineAdherenceModalVisible}
            medicineId={selectedMedicineId}
            onClose={() => {
              setIsMedicineAdherenceModalVisible(false);
              setSelectedDateForModal(null);
              reloadMedicines();
              reloadDoses();
            }}
            scheduleId={selectedScheduleId}
          />
        )}
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
      {selectedMedicineId && selectedScheduleId && selectedDateForModal && (
        <MedicineAdherenceModal
          date={selectedDateForModal}
          isVisible={isMedicineAdherenceModalVisible}
          medicineId={selectedMedicineId}
          onClose={() => {
            setIsMedicineAdherenceModalVisible(false);
            setSelectedDateForModal(null);
            reloadMedicines();
            reloadDoses();
          }}
          scheduleId={selectedScheduleId}
        />
      )}
    </PageWrapper>
  );
}
