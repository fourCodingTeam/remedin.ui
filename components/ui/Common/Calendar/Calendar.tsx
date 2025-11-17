import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { TouchableOpacity } from "react-native";
import { StyledText } from "../StyledText";
import {
  CalendarContainer,
  DayButton,
  DaysGrid,
  Header,
  InnerWrapper,
  MonthNavigationWrapper,
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
  // Use a known Sunday as base date (January 1, 2023 was a Sunday)
  // Create date in local time to avoid timezone issues
  const baseDate = new Date(2023, 0, 1); // January 1, 2023 (Sunday)

  const labels = Array.from({ length: DAYS_IN_WEEK }).map((_, index) => {
    const date = addDays(baseDate, index);
    return date.toLocaleDateString(locale, {
      weekday: "short",
    });
  });

  return labels
    .map((label) => label.replace(TRAILING_DOT_REGEX, ""))
    .slice(weekStartsOn)
    .concat(labels.slice(0, weekStartsOn));
};

const normalizeDate = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const buildCalendarDays = (
  referenceDate: Date,
  weekStartsOn: number
): Date[] => {
  // Normalize reference date to avoid timezone issues
  const normalizedRef = normalizeDate(referenceDate);

  const startOfMonth = getStartOfMonth(normalizedRef);
  const startWeekday = startOfMonth.getDay();

  // Calculate offset: how many days back from start of month to reach the start of the week
  // getDay() returns: 0=Sunday, 1=Monday, ..., 6=Saturday
  // weekStartsOn: 0=Sunday, 1=Monday, ..., 6=Saturday
  const offset = (startWeekday - weekStartsOn + DAYS_IN_WEEK) % DAYS_IN_WEEK;
  const gridStartDate = addDays(startOfMonth, -offset);

  return Array.from({ length: TOTAL_GRID_DAYS }).map((_, index) => {
    const day = addDays(gridStartDate, index);
    // Normalize each day to avoid timezone shifts
    return normalizeDate(day);
  });
};

export function Calendar({
  currentDate = new Date(),
  selectedDate,
  onSelectDate,
  locale = DEFAULT_LOCALE,
  weekStartsOn = 1,
  isDateDisabled,
}: CalendarProps) {
  const [visibleDate, setVisibleDate] = useState(() =>
    normalizeDate(currentDate)
  );
  const highlightedDate = selectedDate
    ? normalizeDate(selectedDate)
    : visibleDate;

  const monthLabel = useMemo(
    () =>
      `${getFormattedMonth(visibleDate, locale)} ${visibleDate.getFullYear()}`,
    [locale, visibleDate]
  );

  useEffect(() => {
    setVisibleDate(normalizeDate(currentDate));
  }, [currentDate]);

  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn),
    [locale, weekStartsOn]
  );

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleDate, weekStartsOn),
    [visibleDate, weekStartsOn]
  );

  const monthNavigate = (direction: "previous" | "next") => {
    setVisibleDate((prev) => {
      const nextVisible = new Date(prev);

      if (direction === "previous") {
        nextVisible.setMonth(nextVisible.getMonth() - 1);
      } else {
        nextVisible.setMonth(nextVisible.getMonth() + 1);
      }

      return nextVisible;
    });
  };

  return (
    <CalendarContainer>
      <Header>
        <StyledText variant="largeSemiBold">
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
        </StyledText>
        <MonthNavigationWrapper>
          <TouchableOpacity
            onPress={() => {
              monthNavigate("previous");
            }}
          >
            <ChevronLeft />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              monthNavigate("next");
            }}
          >
            <ChevronRight />
          </TouchableOpacity>
        </MonthNavigationWrapper>
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
