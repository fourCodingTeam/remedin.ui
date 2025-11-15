import Animated from "react-native-reanimated";
import styled from "styled-components/native";
import { theme } from "@/constants/theme";

export const AnimatedToastContainer = styled(Animated.View)<{
  backgroundColor: string;
}>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${theme.borderRadius[3]};
  padding: ${theme.sizes[3]} ${theme.sizes[4]};
  gap: ${theme.sizes[2]};
  margin-bottom: ${theme.sizes[2]};
`;

export const IconWrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const ToastContent = styled.View`
  flex: 1;
  gap: ${theme.sizes[1]};
`;

export const CloseButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: ${theme.sizes[1]};
`;
