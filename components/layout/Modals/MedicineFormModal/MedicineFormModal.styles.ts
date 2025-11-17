import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const SideBySideInputsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${theme.sizes[2]};
`;

export const WeekDaysWrapper = styled.View`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${theme.sizes[2]};
  margin-top: ${theme.sizes[2]};
`;
