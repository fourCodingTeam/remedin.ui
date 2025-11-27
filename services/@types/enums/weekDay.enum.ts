export enum WeekDay {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7,
}

export const weekDayLabels: Record<WeekDay, string> = {
  [WeekDay.Monday]: "Segunda-feira",
  [WeekDay.Tuesday]: "Terça-feira",
  [WeekDay.Wednesday]: "Quarta-feira",
  [WeekDay.Thursday]: "Quinta-feira",
  [WeekDay.Friday]: "Sexta-feira",
  [WeekDay.Saturday]: "Sábado",
  [WeekDay.Sunday]: "Domingo",
};
