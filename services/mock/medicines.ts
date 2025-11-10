import type { MedicineCheckboxCardProps } from "@/components/ui/Common/CheckboxCard/MedicineCheckboxCard";

type MedicineCardProps = Pick<
  MedicineCheckboxCardProps,
  | "value"
  | "title"
  | "scheduleLabel"
  | "statusLabel"
  | "extraLines"
  | "tone"
  | "isForgotten"
  | "isCompleted"
  | "checked"
  | "defaultChecked"
  | "disabled"
  | "onChange"
  | "onPress"
>;

export type MedicineSchedule = {
  id: string;
  date: string;
  card: MedicineCardProps;
};

const formatDate = (date: Date) => {
  const formatted = new Date(date);
  formatted.setHours(0, 0, 0, 0);
  return formatted.toISOString().split("T")[0];
};

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(today.getDate() + 7);

export const medicinesMock: MedicineSchedule[] = [
  {
    id: "med-001",
    date: formatDate(twoDaysAgo),
    card: {
      value: "amlodipino-08h",
      title: "Amlodipino - 5mg",
      scheduleLabel: "08h00 - Antes do café",
      checked: true,
    },
  },
  {
    id: "med-002",
    date: formatDate(twoDaysAgo),
    card: {
      value: "metformina-21h",
      title: "Metformina - 850mg",
      scheduleLabel: "21h00 - Após o jantar",
      checked: true,
    },
  },
  {
    id: "med-003",
    date: formatDate(yesterday),
    card: {
      value: "clonazepam-10h",
      title: "Clonazepam - 2mg",
      scheduleLabel: "10h00 - Hoje às 10h",
      statusLabel: "Esquecida",
      isForgotten: true,
    },
  },
  {
    id: "med-004",
    date: formatDate(yesterday),
    card: {
      value: "dipirona-16h",
      title: "Dipirona - 1g",
      scheduleLabel: "16h30 - Hoje às 16h30",
      extraLines: ["Repetir se dor persistir", "Tomar com água", "Esquecida"],
      isForgotten: true,
    },
  },
  {
    id: "med-005",
    date: formatDate(today),
    card: {
      value: "vitamina-d-07h",
      title: "Vitamina D - 2000UI",
      scheduleLabel: "07h00 - Antes do sol",
      extraLines: ["Tomar com suco"],
    },
  },
  {
    id: "med-006",
    date: formatDate(today),
    card: {
      value: "losartana-14h",
      title: "Losartana - 50mg",
      scheduleLabel: "14h00 - Hoje às 14h",
      statusLabel: "Aguardando",
    },
  },
  {
    id: "med-007",
    date: formatDate(today),
    card: {
      value: "insulina-19h",
      title: "Insulina NPH - 10u",
      scheduleLabel: "19h00 - Antes do jantar",
      extraLines: ["Verificar glicemia antes"],
      disabled: false,
    },
  },
  {
    id: "med-008",
    date: formatDate(tomorrow),
    card: {
      value: "antibiotico-09h",
      title: "Amoxicilina - 500mg",
      scheduleLabel: "09h00 - Amanhã",
      extraLines: ["Tomar com alimentos"],
    },
  },
  {
    id: "med-009",
    date: formatDate(tomorrow),
    card: {
      value: "melatonina-23h",
      title: "Melatonina - 3mg",
      scheduleLabel: "23h00 - Antes de dormir",
      statusLabel: "Agendada",
    },
  },
  {
    id: "med-010",
    date: formatDate(nextWeek),
    card: {
      value: "vitamina-b12-08h",
      title: "Vitamina B12 - Injetável",
      scheduleLabel: "08h00 - Sessão no posto",
      extraLines: ["Aplicar na clínica"],
    },
  },
  {
    id: "med-011",
    date: formatDate(nextWeek),
    card: {
      value: "omeprazol-07h",
      title: "Omeprazol - 20mg",
      scheduleLabel: "07h00 - Em jejum",
      checked: false,
    },
  },
];
