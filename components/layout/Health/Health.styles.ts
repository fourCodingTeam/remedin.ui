import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const ThreeCardsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${theme.sizes[2]};
  width: 100%;
`;

export const TwoCardsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${theme.sizes[2]};
  width: 100%;
`;

export const CardsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
  width: 100%;
`;

export const RegisterCardsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[2]};
  width: 100%;
  margin-top: ${theme.sizes[3]};
`;