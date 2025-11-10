import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const PageWrapperWrapper = styled.View`
  flex: 1;
  display: flex;
  background-color: ${theme.colors.background.default};
  flex-direction: column;
  gap: 8px;
`;

export const ContentWrapper = styled.View`
  flex: 1;
  padding: 0 ${theme.sizes[4]};
  gap: ${theme.sizes[2]};
`;

export const ScrollableWrapper = styled.ScrollView`
  flex: 1;
  background-color: ${theme.colors.background.default};
  padding: 0 ${theme.sizes[4]};
`;
