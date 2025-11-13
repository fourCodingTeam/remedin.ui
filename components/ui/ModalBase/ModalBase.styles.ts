import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const ModalView = styled.View`
  padding: ${theme.sizes[4]};
  background-color: ${theme.colors.background.light};
  border-radius: ${theme.borderRadius[3]};
  gap: ${theme.sizes[6]};
  width: 90%;
  align-items: center;
  justify-content: center;
`;

export const TextsWrapper = styled.View`
  gap: ${theme.sizes[1]};
  align-items: center;
  justify-content: center;
`;

export const ButtonsWrapper = styled.View`
  width: 100%;
  gap: ${theme.sizes[2]};
  justify-content: space-between;
  flex-direction: column;
`;
