import type FontAwesome from "@expo/vector-icons/FontAwesome";
import type React from "react";
import type { TextInput } from "react-native";

export type InputBaseProps = React.ComponentProps<typeof TextInput> & {
  suffixIcon?: React.ComponentProps<typeof FontAwesome>["name"];
  prefixIcon?: React.ComponentProps<typeof FontAwesome>["name"];
  compact?: boolean;
  onPressIn?: () => void;
  enableFlexOne?: boolean;
};
