import Modal from "react-native-modal";
import { Button } from "..";
import { StyledText } from "../Common/StyledText/StyledText";
import { ButtonsWrapper, ModalView, TextsWrapper } from "./ModalBase.styles";
import type { ModalBaseProps } from "./ModalBase.types";

export function ModalBase({
  isVisible,
  onClose,
  title,
  description,
  button,
}: ModalBaseProps) {
  return (
    <Modal
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={300}
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      style={{ margin: 0, padding: 0, alignItems: "center" }}
      useNativeDriver={true}
    >
      <ModalView>
        <TextsWrapper>
          <StyledText style={{ textAlign: "center" }} variant="largeSemiBold">
            {title}
          </StyledText>
          <StyledText
            color="muted"
            style={{ textAlign: "center" }}
            variant="mediumRegular"
          >
            {description}
          </StyledText>
        </TextsWrapper>
        <ButtonsWrapper>
          {button &&
            button.length > 0 &&
            button.map((button) => (
              <Button
                fullWidth
                key={`${button.label}-${button.variant}`}
                label={button.label}
                onPress={button.onPress}
                variant={button.variant}
              />
            ))}
        </ButtonsWrapper>
      </ModalView>
    </Modal>
  );
}
