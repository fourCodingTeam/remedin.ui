import type { MedicineCheckboxCardProps } from "@/components/ui/Common/CheckboxCard/MedicineCheckboxCard";

export type MedicinesByHour = {
  hour: string;
  medicines: Pick<
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
  >[];
};

export const medicinesPerHourMock: MedicinesByHour[] = [
  {
    hour: "22h00",
    medicines: [
      {
        title: "Dipirona - 1g",
        scheduleLabel: "Hoje às 22h",
        value: "dipirona-22",
      },
      {
        extraLines: ["Tomar com água"],
        title: "Azitromicina - 500mg",
        scheduleLabel: "Hoje às 22h",
        value: "azitromicina-22",
      },
    ],
  },
  {
    hour: "23h00",
    medicines: [
      {
        value: "trenbolona-23",
        title: "Trenbolona - 1g",
        scheduleLabel: "Hoje às 23h",
      },
    ],
  },
];
