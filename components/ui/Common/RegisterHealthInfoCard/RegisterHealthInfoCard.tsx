import { ChevronRight } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { StyledText } from "../StyledText";
import { CardWrapper, TextsWrapper } from "./RegisterHealthInfoCard.styles";
import type { RegisterHealthInfoCardProps } from "./RegisterHealthInfoCard.types";

export function RegisterHealthInfoCard({
  title,
  description,
  backgroundColor = theme.colors.background.light,
  borderColor,
  textColor = theme.colors.text.default,
  iconColor = theme.colors.text.default,
  onPress,
}: RegisterHealthInfoCardProps) {
  const resolvedBorderColor = borderColor ?? backgroundColor;

  return (
    <CardWrapper
      activeOpacity={0.8}
      backgroundColor={backgroundColor}
      borderColor={resolvedBorderColor}
      onPress={onPress}
    >
      <TextsWrapper>
        <StyledText
          color="default"
          style={{ color: textColor }}
          variant="mediumRegular"
        >
          {title}
        </StyledText>
        {description ? (
          <StyledText
            color="muted"
            style={{ color: textColor, opacity: 0.8 }}
            variant="mediumRegular"
          >
            {description}
          </StyledText>
        ) : null}
      </TextsWrapper>
      <ChevronRight color={iconColor} size={20} />
    </CardWrapper>
  );
}
