import type { ImageSourcePropType } from "react-native";

export type MemberCardProps = {
  id: number;
  name: string;
  phoneNumber?: string;
  avatar?: string | ImageSourcePropType;
  onPress?: () => void;
  isUser?: boolean;
};
