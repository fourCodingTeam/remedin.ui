import { useEffect, useMemo, useState } from "react";
import { StyledText } from "..";
import { TDCalendarDay, TDCalendarWrapper } from "./TDCalendar.styles";
import type { TDCalendarProps } from "./TDCalendar.types";

const DAY_OFFSETS = [-1, 0, 1] as const;

const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const getRelativeDate = (baseDate: Date, offset: number) => {
  const relative = new Date(baseDate);
  relative.setDate(baseDate.getDate() + offset);
  return normalizeDate(relative);
};

const getDayName = (targetDate: Date) =>
  targetDate.toLocaleString("pt-BR", { weekday: "short" });

export function TDCalendar({ date, onDateChange }: TDCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(normalizeDate(date));

  useEffect(() => {
    const normalizedPropDate = normalizeDate(date);

    if (normalizedPropDate.getTime() !== selectedDate.getTime()) {
      setSelectedDate(normalizedPropDate);
    }
  }, [date, selectedDate]);

  const visibleDays = useMemo(
    () =>
      DAY_OFFSETS.map((offset) => ({
        date: getRelativeDate(selectedDate, offset),
        offset,
      })),
    [selectedDate]
  );

  const handleDatePress = (nextDate: Date) => {
    const normalizedNextDate = normalizeDate(nextDate);
    setSelectedDate(normalizedNextDate);

    onDateChange?.(normalizedNextDate);
  };

  return (
    <TDCalendarWrapper>
      {visibleDays.map(({ date: day, offset }) => (
        <TDCalendarDay
          activeOpacity={0.7}
          isSelected={offset === 0}
          key={day.getTime()}
          onPress={() => handleDatePress(day)}
        >
          <StyledText variant="mediumSemiBold">
            {day.getDate() === new Date().getDate()
              ? `Hoje - ${day.getDate()}`
              : day.getDate()}
          </StyledText>
          <StyledText variant="smallRegular">{getDayName(day)}</StyledText>
        </TDCalendarDay>
      ))}
    </TDCalendarWrapper>
  );
}
