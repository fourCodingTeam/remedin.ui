import { Button, MultiSelectTag } from "@/components/ui";
import { TagsMock } from "@/services";
import React, { useState } from "react";
import { View } from "react-native";

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      }

      return [...prevTags, tag];
    });
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        paddingVertical: 32,
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      <Button label="Maumau" variant="black" fullWidth />
      <Button label="Maumau" variant="outline" fullWidth />
      <Button label="Maumau" variant="primary" fullWidth />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
        }}
      >
        {TagsMock.map((tag, index) => (
          <MultiSelectTag
            id={tag.id}
            key={index}
            label={tag.label}
            disabled={tag.disabled}
            isSelected={selectedTags.includes(tag.label)}
            onPress={() => handleSelectTag(tag.label)}
          />
        ))}
      </View>
    </View>
  );
}
