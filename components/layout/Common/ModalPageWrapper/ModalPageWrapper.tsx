import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyledText } from "@/components/ui/Common/StyledText";
import {
  ContentWrapper,
  HeaderWrapper,
  IconWrapper,
  ModalPageWrapperWrapper,
  ModalSafeAreaContainer,
  ScrollableWrapper,
  TitleWrapper,
} from "./ModalPageWrapper.styles";
import type { ModalPageWrapperProps } from "./ModalPageWrapper.types";

export function ModalPageWrapper({
  children,
  header,
  isScrollable,
  isVisible,
  onClose,
}: ModalPageWrapperProps) {
  return (
    <ModalPageWrapperWrapper
      allowSwipeDismissal={true}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="formSheet"
      visible={isVisible}
    >
      <ModalSafeAreaContainer edges={Platform.OS === "android" ? ["top"] : ["top", "bottom"]}>
        {header && (
          <HeaderWrapper>
            <TitleWrapper>
              <IconWrapper>{header.icon}</IconWrapper>
              <StyledText variant="largeRegular">{header.title}</StyledText>
            </TitleWrapper>
            <StyledText color="muted" variant="mediumRegular">
              {header.description}
            </StyledText>
          </HeaderWrapper>
        )}
        {isScrollable ? (
          <ScrollableWrapper>{children}</ScrollableWrapper>
        ) : (
          <ContentWrapper>{children}</ContentWrapper>
        )}
      </ModalSafeAreaContainer>
    </ModalPageWrapperWrapper>
  );
}
