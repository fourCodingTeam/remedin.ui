import { InputBase, InputDate, InputSelect, MultiSelectTag } from "@/components/ui";
import React, { useState } from "react";
import { View } from "react-native";

export default function Home() {
    const [birth, setBirth] = useState("");
    const [selected, setSelected] = useState<string | number | undefined>(undefined);

    const options = [
  { label: "Opção 1", value: "1" },
  { label: "Opção 2", value: "2" },
  { label: "Opção 3", value: "3" },
  { label: "Opção 4", value: "4" },
  { label: "Opção 5", value: "5" },
  { label: "Opção 6", value: "6" },
  { label: "Opção 7", value: "7" },
  { label: "Opção 8", value: "8" },
  { label: "Opção 9", value: "9" },
  { label: "Opção 10", value: "10" },
  { label: "Opção 11", value: "11" },
  { label: "Opção 12", value: "12" },
  { label: "Opção 13", value: "13" },
  { label: "Opção 14", value: "14" },
  { label: "Opção 15", value: "15" },
  { label: "Opção 16", value: "16" },
  { label: "Opção 17", value: "17" },
  { label: "Opção 18", value: "18" },
  { label: "Opção 19", value: "19" },
  { label: "Opção 20", value: "20" },
  { label: "Opção 21", value: "21" },
  { label: "Opção 22", value: "22" },
  { label: "Opção 23", value: "23" },
  { label: "Opção 24", value: "24" },
  { label: "Opção 25", value: "25" },
  { label: "Opção 26", value: "26" },
  { label: "Opção 27", value: "27" },
  { label: "Opção 28", value: "28" },
  { label: "Opção 29", value: "29" },
  { label: "Opção 30", value: "30" },
];
  return (
    <View>
      <MultiSelectTag id={1} isSelected label="Selected" />
      <MultiSelectTag id={1} isSelected={false} label="Not Selected" disabled />
      <MultiSelectTag id={1} label="Disabled" />
      <InputBase prefixIcon="automobile" suffixIcon="angle-double-right"/>
      <InputDate value={birth} onChange={setBirth} placeholder="data" />
      <InputSelect options={options}
        value={selected}
        onChange={setSelected}
        placeholder="Escolha uma opção"
        prefixIcon="list"
        compact
      />
    </View>
  );
}
