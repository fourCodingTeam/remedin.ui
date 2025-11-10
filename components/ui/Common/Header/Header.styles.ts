import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 16px;
  background-color: ${theme.colors.background.default};
  border-radius: 0 0 ${theme.sizes[4]} ${theme.sizes[4]};
`;

export const TopWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const IconsWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

export const IconWrapper = styled.TouchableOpacity`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TextsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
`;
