import { useMemo } from "react";
import { StyledText } from "..";
import {
  CalendarContainer,
  DayButton,
  DaysGrid,
  Header,
  InnerWrapper,
  WeekdayRow,
} from "./Calendar.styles";
import type { CalendarProps } from "./Calendar.types";

const DEFAULT_LOCALE = "pt-BR";
const DAYS_IN_WEEK = 7;
const TOTAL_GRID_DAYS = 42;

const isSameDay = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const isSameMonth = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth();

const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const getStartOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const getFormattedMonth = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, { month: "long" });

const TRAILING_DOT_REGEX = /\.?$/;

const getWeekdayLabels = (locale: string, weekStartsOn: number) => {
  const baseDate = new Date(Date.UTC(2023, 0, 1));

  const labels = Array.from({ length: DAYS_IN_WEEK }).map((_, index) =>
    addDays(baseDate, index).toLocaleDateString(locale, {
      weekday: "short",
    })
  );

  return labels
    .map((label) => label.replace(TRAILING_DOT_REGEX, ""))
    .slice(weekStartsOn)
    .concat(labels.slice(0, weekStartsOn));
};

const buildCalendarDays = (
  referenceDate: Date,
  weekStartsOn: number
): Date[] => {
  const startOfMonth = getStartOfMonth(referenceDate);
  const startWeekday = startOfMonth.getDay();
  const offset = (startWeekday - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const gridStartDate = addDays(startOfMonth, -offset);

  return Array.from({ length: TOTAL_GRID_DAYS }).map((_, index) =>
    addDays(gridStartDate, index)
  );
};

export function Calendar({
  currentDate = new Date(),
  selectedDate,
  onSelectDate,
  locale = DEFAULT_LOCALE,
  weekStartsOn = 1,
  isDateDisabled,
}: CalendarProps) {
  const visibleDate = useMemo(() => new Date(currentDate), [currentDate]);
  const highlightedDate = selectedDate ?? visibleDate;

  const monthLabel = useMemo(
    () =>
      `${getFormattedMonth(visibleDate, locale)} ${visibleDate.getFullYear()}`,
    [locale, visibleDate]
  );

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn]
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleDate, weekStartsOn),
    [visibleDate, weekStartsOn]
  );

  return (
    <CalendarContainer>
      <Header>
        <StyledText variant="largeSemiBold">
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
        </StyledText>
      </Header>

      <InnerWrapper>
        <WeekdayRow>
          {weekdayLabels.map((weekday) => (
            <StyledText color="muted" key={weekday} variant="mediumRegular">
              {weekday}
            </StyledText>
          ))}
        </WeekdayRow>

        <DaysGrid>
          {calendarDays.map((day) => {
            const disabled = isDateDisabled?.(day) ?? false;
            const isSelected = isSameDay(day, highlightedDate);
            const currentMonth = isSameMonth(day, visibleDate);

            return (
              <DayButton
                activeOpacity={disabled ? 1 : 0.7}
                disabled={disabled}
                isCurrentMonth={currentMonth}
                isDisabled={disabled}
                isSelected={isSelected}
                key={day.toDateString()}
                onPress={() => {
                  onSelectDate?.(day);
                }}
              >
                {isSelected ? (
                  <StyledText color="light" variant="mediumSemiBold">
                    {day.getDate()}
                  </StyledText>
                ) : (
                  <StyledText
                    color={currentMonth ? "default" : "muted"}
                    variant="mediumRegular"
                  >
                    {day.getDate()}
                  </StyledText>
                )}
              </DayButton>
            );
          })}
        </DaysGrid>
      </InnerWrapper>
    </CalendarContainer>
  );
}
