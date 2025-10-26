import { InputBase, MultiSelectTag } from "@/components/ui";
import React from "react";
import { View } from "react-native";

export default function Home() {
  return (
    <View>
      <MultiSelectTag id={1} isSelected label="Selected" />
      <MultiSelectTag id={1} isSelected={false} label="Not Selected" disabled />
      <MultiSelectTag id={1} label="Disabled" />
      <InputBase/>
    </View>
  );
}
