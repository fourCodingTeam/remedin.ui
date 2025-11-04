// Components/ui/Common/Stepper/Stepper.styles.ts

import styled from "styled-components/native";
import { theme } from "@/constants/theme";
import type { StepSegmentProps } from "./Stepper.types";

export const StepperContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[1]};
`;

export const StepSegment = styled.View<StepSegmentProps>`
  flex: 1;
  height: 1px;
  background-color: ${({ isActive }) =>
    isActive ? theme.colors.text.default : theme.colors.border.muted};
`;
