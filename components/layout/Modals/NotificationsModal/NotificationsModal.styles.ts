import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const FloatingModalContent = styled.View`
  background-color: ${theme.colors.background.light};
  border-top-left-radius: ${theme.borderRadius[5]};
  border-top-right-radius: ${theme.borderRadius[5]};
  max-height: 70%;
  min-height: 300px;
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

export const ReadButtonWrapper = styled.View`
  width: 100%;
  margin-bottom: ${theme.sizes[3]};
`;

export const ReadButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[2]};
  padding: ${theme.sizes[2]};
  border-radius: ${theme.borderRadius[2]};
  border-width: 1px;
  border-color: ${theme.colors.border.muted};
`;

export const NotificationList = styled.ScrollView`
  max-height: 300px;
  width: 100%;
`;

export const NotificationItem = styled.View<{ isRead: boolean }>`
  flex-direction: row;
  align-items: flex-start;
  gap: ${theme.sizes[2]};
  padding: ${theme.sizes[3]};
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border.muted};
  opacity: ${({ isRead }) => (isRead ? 0.7 : 1)};
`;

export const NotificationTitle = styled.View`
  flex: 1;
  gap: ${theme.sizes[1]};
`;

export const NotificationTime = styled.View`
  margin-top: ${theme.sizes[1]};
`;
