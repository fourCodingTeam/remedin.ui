import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const ScrollableMedicationTimeLine = styled.ScrollView`
  gap: ${theme.sizes[4]};
`;

export const MedicationTimeLineItem = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
  align-items: start;
  margin-bottom: ${theme.sizes[4]};
`;

export const MedicinesStack = styled.View`
  gap: ${theme.sizes[2]};
`;
