import { router } from "expo-router";
import {
  Archive,
  Calendar,
  CalendarDays,
  LogOutIcon,
  Plus,
  Settings,
  User,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { Button, Header, InputSelect, StyledText } from "@/components/ui";
import { TDCalendar } from "@/components/ui/ClickableThreeDayCalendar";
import { MedicineCheckboxCard } from "@/components/ui/Common/CheckboxCard";
import { theme } from "@/constants/theme";
import { medicinesMock } from "@/services/mock/medicines";
import { useMemberStore } from "@/stores/MemberStore";
import { useUserStore } from "@/stores/UserStore";
import { PageWrapper } from "..";
import { CalendarModal } from "../CalendarModal/CalendarModal";
import { MedicineFormModal } from "../MedicineFormModal";
import { ButtonsWrapper, ScrollableContentWrapper } from "../styles";
import type { HomeProps } from "./Home.types";

export default function Home({ isMemberApp = false }: HomeProps) {
  const { username, signOut } = useUserStore();
  const { member } = useMemberStore();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedFilter, setSelectedFilter] = useState<
    string | number | undefined
  >();
  const [isMedicineFormModalVisible, setIsMedicineFormModalVisible] =
    useState(false);
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
  const filterOptions = [
    { label: "Todas as medicações", value: "all" },
    { label: "Medicações agendadas", value: "scheduled" },
    { label: "Medicações não agendadas", value: "not_scheduled" },
    { label: "Medicações concluídas", value: "completed" },
    { label: "Mais próximas", value: "nearest" },
    { label: "Mais distantes", value: "furthest" },
  ];

  const selectedDateKey = useMemo(() => {
    const dateCopy = new Date(selectedDate);
    dateCopy.setHours(0, 0, 0, 0);
    return dateCopy.toISOString().split("T")[0];
  }, [selectedDate]);

  const medicinesForSelectedDate = useMemo(
    () => medicinesMock.filter((medicine) => medicine.date === selectedDateKey),
    [selectedDateKey]
  );

  const handleLogOut = async () => {
    await signOut();
    router.replace("/auth");
  };

  if (isMemberApp) {
    return (
      <PageWrapper
        header={
          <Header
            description="Como está se sentindo hoje?"
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
            usuario={`No perfil de ${member.name}`}
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
          {medicinesForSelectedDate.length === 0 ? (
            <StyledText
              color="muted"
              style={{ textAlign: "center", marginTop: 4 }}
              variant="mediumRegular"
            >
              Nenhuma medicação para esta data.
            </StyledText>
          ) : (
            medicinesForSelectedDate.map(({ id, card }) => (
              <MedicineCheckboxCard
                key={id}
                {...card}
                style={{ marginTop: 4, marginBottom: 4 }}
              />
            ))
          )}
        </ScrollableContentWrapper>
        <MedicineFormModal
          isVisible={isMedicineFormModalVisible}
          onClose={() => {
            setIsMedicineFormModalVisible(false);
          }}
        />
        <CalendarModal
          isVisible={isCalendarModalVisible}
          onClose={() => setIsCalendarModalVisible(false)}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      header={
        <Header
          description="Como está se sentindo hoje?"
          sideMenu={{
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
          usuario={`Olá, ${username ?? "Usuário"}!`}
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
        {medicinesForSelectedDate.length === 0 ? (
          <StyledText
            color="muted"
            style={{ textAlign: "center", marginTop: 8 }}
            variant="mediumRegular"
          >
            Nenhuma medicação para esta data.
          </StyledText>
        ) : (
          medicinesForSelectedDate.map(({ id, card }) => (
            <MedicineCheckboxCard
              key={id}
              {...card}
              style={{ marginTop: 4, marginBottom: 4 }}
            />
          ))
        )}
      </ScrollableContentWrapper>
      <MedicineFormModal
        isVisible={isMedicineFormModalVisible}
        onClose={() => {
          setIsMedicineFormModalVisible(false);
        }}
      />
      <CalendarModal
        isVisible={isCalendarModalVisible}
        onClose={() => setIsCalendarModalVisible(false)}
      />
    </PageWrapper>
  );
}
