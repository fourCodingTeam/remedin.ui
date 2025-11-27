import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const FloatingModalContent = styled.View`
  background-color: ${theme.colors.background.light};
  border-top-left-radius: ${theme.borderRadius[5]};
  border-top-right-radius: ${theme.borderRadius[5]};
  max-height: 70%;
  min-height: 200px;
  padding: ${theme.sizes[4]};
  width: 100%;
`;

export const ModalHeader = styled.View`
  gap: ${theme.sizes[1]};
  margin-bottom: ${theme.sizes[3]};
`;

export const ModalHeaderTitle = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[2]};
`;

export const ContentArea = styled.View`
  width: 100%;
  gap: ${theme.sizes[3]};
`;

export const StatusWrapper = styled.View`
  padding: ${theme.sizes[3]};
  border-radius: ${theme.borderRadius[2]};
  border-width: 1px;
  border-color: ${theme.colors.border.muted};
  background-color: ${theme.colors.background.default};
`;

export const ButtonsContainer = styled.View`
  width: 100%;
  gap: ${theme.sizes[2]};
`;
