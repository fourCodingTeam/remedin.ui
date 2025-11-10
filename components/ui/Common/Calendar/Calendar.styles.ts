import styled, { css } from "styled-components/native";
import { theme } from "@/constants/theme";

export const CalendarContainer = styled.View`
  display: flex;
  padding: ${theme.sizes[4]};
  border-radius: ${theme.sizes[3]};
  background-color: ${theme.colors.background.light};
  border-width: 1px;
  border-color: ${theme.colors.border.default};
  gap: ${theme.sizes[4]};
`;

export const InnerWrapper = styled.View`
  gap: ${theme.sizes[1]};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const MonthTitle = styled.Text`
  font-family: ${theme.fonts.semiBold};
  font-size: ${theme.sizes[5]};
  color: ${theme.colors.text.default};
`;

export const WeekdayRow = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: ${theme.sizes[2]};
`;

export const DaysGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: ${theme.sizes[1]};
`;

export const DayButton = styled.TouchableOpacity<{
  isSelected?: boolean;
  isCurrentMonth?: boolean;
  isDisabled?: boolean;
}>`
  width: ${100 / 7}%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius[2]};

  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: ${theme.colors.accent.secondary};
    `}

  ${({ isDisabled }) =>
    isDisabled &&
    css`
      opacity: 0.4;
    `}
`;
