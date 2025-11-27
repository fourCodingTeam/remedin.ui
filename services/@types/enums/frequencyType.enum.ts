export enum FrequencyType {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
}

export const frequencyTypeLabels: Record<FrequencyType, string> = {
  [FrequencyType.Daily]: "Diário",
  [FrequencyType.Weekly]: "Semanal",
  [FrequencyType.Monthly]: "Mensal",
};
