export type CalendarProps = {
  currentDate?: Date;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isDateDisabled?: (date: Date) => boolean;
};
