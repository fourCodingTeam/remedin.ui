import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const MemberCardWrapper = styled.TouchableOpacity<{
  backgroundColor?: string;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.sizes[4]};
  border-radius: ${theme.borderRadius[3]};
  background-color: ${({ backgroundColor }) => backgroundColor ?? theme.colors.accent.secondary};
  `;

export const MemberCardContentWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: start;
  gap: ${theme.sizes[3]};
`;

export const MemberCardContentTextsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${theme.sizes[1]};
`;
