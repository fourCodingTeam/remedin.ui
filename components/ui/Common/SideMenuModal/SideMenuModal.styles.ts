import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const Container = styled.SafeAreaView`
  flex: 1;
  width: 80%;
  background-color: ${theme.colors.background.light};
  padding: ${theme.sizes[10]} ${theme.sizes[4]} ${theme.sizes[4]} ${theme.sizes[4]};
  gap: ${theme.sizes[5]};
  border-top-left-radius: ${theme.borderRadius[4]};
  border-bottom-left-radius: ${theme.borderRadius[4]};
`;

export const Content = styled.View`
  flex: 1;
  gap: ${theme.sizes[4]};
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[3]};
`;

export const UserInfoTexts = styled.View`
  flex-direction: column;
`;

export const MenuWrapper = styled.View`
  flex: 1;
  gap: ${theme.sizes[2]};
`;

export const MenuItemButton = styled.TouchableOpacity<{ active?: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[1]};
  padding: ${theme.sizes[1]};
  border-radius: ${theme.borderRadius[3]};
  background-color: ${({ active }) =>
    active ? theme.colors.accent.primaryFaded : "transparent"};
`;

export const MenuItemIconWrapper = styled.View<{ active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${theme.sizes[2]};
  align-items: center;
  justify-content: center;
`;

export const FooterSection = styled.View`
  padding-top: ${theme.sizes[4]};
  border-top-width: 1px;
  border-top-color: ${theme.colors.border.muted};
`;

export const FooterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${theme.sizes[3]};
  padding-top: ${theme.sizes[3]};
  padding-bottom: ${theme.sizes[3]};
`;
