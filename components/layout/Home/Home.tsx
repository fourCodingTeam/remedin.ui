import { MultiSelectTag } from "@/components/ui";
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
    <View>
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
  );
}
