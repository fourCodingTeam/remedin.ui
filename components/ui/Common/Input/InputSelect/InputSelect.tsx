import { useMemo, useState } from "react";
import { FlatList, Modal } from "react-native";
import { InputBase } from "../InputBase";
import { Backdrop, Container, Item, ItemText } from "./InputSelect.styles";
import type { InputSelectProps, Option } from "./InputSelect.types";

export function InputSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione",
  ...rest
}: InputSelectProps) {
  const [visible, setVisible] = useState(false);

  const selectedLabel = useMemo(() => {
    const found = options.find((o) => o.value === value);
    return found ? found.label : "";
  }, [options, value]);

  const handleSelect = (item: Option) => {
    onChange?.(item.value);
    setVisible(false);
  };

  return (
    <>
      <InputBase
        {...(rest as any)}
        editable={false}
        onPressIn={() => setVisible(true)}
        placeholder={placeholder}
        value={selectedLabel}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        transparent
        visible={visible}
      >
        <Backdrop activeOpacity={1} onPress={() => setVisible(true)}>
          <Container>
            <FlatList
              data={options}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <Item onPress={() => handleSelect(item)}>
                  <ItemText>{item.label}</ItemText>
                </Item>
              )}
            />
          </Container>
        </Backdrop>
      </Modal>
    </>
  );
}
