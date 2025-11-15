import { CheckCircle2, Info, X, XCircle } from "lucide-react-native";
import { useCallback, useEffect, useRef } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { theme } from "@/constants/theme";
import { StyledText } from "../Common/StyledText";
import {
  AnimatedToastContainer,
  CloseButton,
  IconWrapper,
  ToastContent,
} from "./Toast.styles";
import type { ToastProps } from "./Toast.types";

export function Toast({
  message,
  type = "success",
  onClose,
  duration = 3000,
  index = 0,
  totalToasts = 1,
}: ToastProps) {
  const translateX = useSharedValue(400);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClose = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    translateX.value = withTiming(400, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 });

    closeTimeoutRef.current = setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, translateX, opacity]);

  useEffect(() => {
    translateX.value = withTiming(0, { duration: 300 });

    if (index < totalToasts - 1) {
      scale.value = withTiming(0.9, { duration: 200 });
    }

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }
  }, [duration, index, totalToasts, translateX, scale, handleClose]);

  useEffect(() => {
    if (index < totalToasts - 1) {
      scale.value = withTiming(0.9, { duration: 200 });
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [totalToasts, index, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
    opacity: opacity.value,
    zIndex: totalToasts - index,
  }));

  const getTitle = () => {
    if (type === "success") {
      return "Sucesso!";
    }
    if (type === "error") {
      return "Erro!";
    }
    return "Info!";
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 color={theme.colors.background.light} size={20} />;
      case "error":
        return <XCircle color={theme.colors.background.light} size={20} />;
      case "info":
        return <Info color={theme.colors.background.light} size={20} />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return theme.colors.warnings.success;
      case "error":
        return theme.colors.warnings.danger;
      case "info":
        return theme.colors.warnings.info;
      default:
        return theme.colors.warnings.success;
    }
  };

  return (
    <AnimatedToastContainer
      backgroundColor={getBackgroundColor()}
      style={animatedStyle}
    >
      <IconWrapper>{getIcon()}</IconWrapper>
      <ToastContent>
        <StyledText color="light" variant="mediumSemiBold">
          {getTitle()}
        </StyledText>
        <StyledText color="light" variant="mediumRegular">
          {message}
        </StyledText>
      </ToastContent>
      <CloseButton activeOpacity={0.7} onPress={handleClose}>
        <X color={theme.colors.background.light} size={18} />
      </CloseButton>
    </AnimatedToastContainer>
  );
}
