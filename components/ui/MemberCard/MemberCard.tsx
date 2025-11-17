import { ChevronRight } from "lucide-react-native";
import { theme } from "@/constants/theme";
import { useFormatPhoneNumber } from "@/hooks/useFormatPhoneNumber";
import { useUserStore } from "@/stores";
import { Avatar, StyledText } from "../Common";
import {
  MemberCardContentTextsWrapper,
  MemberCardContentWrapper,
  MemberCardWrapper,
} from "./MemberCard.styles";
import type { MemberCardProps } from "./MemberCard.types";

export function MemberCard({
  id,
  name,
  phoneNumber,
  avatar,
  onPress,
  isUser = false,
}: MemberCardProps) {
  const { userId } = useUserStore();

  const getBackgroundColor = (memberId: string | number) => {
    const memberIdStr = String(memberId);
    if (userId && memberIdStr === userId) {
      return theme.colors.accent.primary;
    }
    return theme.colors.accent.secondary;
  };

  const formattedPhoneNumber = useFormatPhoneNumber(phoneNumber ?? "");

  return (
    <MemberCardWrapper
      activeOpacity={0.7}
      backgroundColor={
        isUser ? theme.colors.accent.primary : getBackgroundColor(id)
      }
      onPress={onPress}
    >
      <MemberCardContentWrapper>
        <Avatar
          name={name}
          size="md"
          source={typeof avatar === "string" ? { uri: avatar } : avatar}
          style={{ borderColor: theme.colors.background.light, borderWidth: 1 }}
        />
        <MemberCardContentTextsWrapper>
          <StyledText
            color={isUser ? "default" : "light"}
            variant="mediumRegular"
          >
            {name}
          </StyledText>
          <StyledText
            color={isUser ? "default" : "light"}
            style={{ opacity: 0.5 }}
            variant="mediumRegular"
          >
            {formattedPhoneNumber}
          </StyledText>
        </MemberCardContentTextsWrapper>
      </MemberCardContentWrapper>
      <ChevronRight
        color={
          isUser ? theme.colors.text.default : theme.colors.background.light
        }
        size={24}
      />
    </MemberCardWrapper>
  );
}
