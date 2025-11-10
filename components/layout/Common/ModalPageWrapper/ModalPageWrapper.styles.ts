import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const ModalPageWrapperWrapper = styled.Modal`
  flex: 1;
  display: flex;
  background-color: ${theme.colors.background.default};
  flex-direction: column;
  gap: 8px;
`;

export const ContentWrapper = styled.View`
  flex: 1;
  background-color: ${theme.colors.background.default};
  padding: 0 ${theme.sizes[4]};
  gap: ${theme.sizes[2]};
`;

export const ScrollableWrapper = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background.default};
  padding: 0 ${theme.sizes[4]};
  gap: ${theme.sizes[2]};
`;

export const IconWrapper = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: ${theme.sizes[1]};
  padding: ${theme.sizes[4]};
  background-color: ${theme.colors.background.default};
  padding-top: ${theme.sizes[7]};
`;

export const TitleWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[1]};
`;
