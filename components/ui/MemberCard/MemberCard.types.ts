import type { ImageSourcePropType } from "react-native";

export type MemberCardProps = {
  id: string;
  name: string;
  phoneNumber?: string;
  avatar?: string | ImageSourcePropType;
  onPress?: () => void;
  isUser?: boolean;
};
