import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const CardWrapper = styled.TouchableOpacity<{
  backgroundColor: string;
  borderColor: string;
}>`
  width: 100%;
  border-radius: ${theme.borderRadius[3]};
  padding: ${theme.sizes[8]} ${theme.sizes[4]};
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
  background-color: ${({ backgroundColor }) => backgroundColor};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextsWrapper = styled.View`
  flex: 1;
  gap: ${theme.sizes[1]};
`;
