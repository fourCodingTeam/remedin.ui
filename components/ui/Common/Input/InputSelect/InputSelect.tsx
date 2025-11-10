import { useMemo, useState } from "react";
import { FlatList, Modal } from "react-native";
import { StyledText } from "../..";
import { InputBase } from "../InputBase";
import { Backdrop, Container, Item } from "./InputSelect.styles";
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
        suffixIcon="chevron-down"
        value={selectedLabel}
      />

      <Modal
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        transparent
        visible={visible}
      >
        <Backdrop onPress={() => setVisible(false)}>
          <Container>
            <FlatList
              contentContainerStyle={{
                paddingBottom: 16,
              }}
              data={options}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <Item onPress={() => handleSelect(item)}>
                  <StyledText variant="mediumRegular">{item.label}</StyledText>
                </Item>
              )}
            />
          </Container>
        </Backdrop>
      </Modal>
    </>
  );
}
