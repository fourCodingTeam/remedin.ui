import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import { TextInput } from "react-native";

export type InputBaseProps = React.ComponentProps<typeof TextInput> & { 
    suffixIcon?: React.ComponentProps<typeof FontAwesome>["name"];
    prefixIcon?: React.ComponentProps<typeof FontAwesome>["name"];
    compact?: boolean;
    onPressIn?: () => void;
}