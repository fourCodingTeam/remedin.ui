import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateToDDMMYYYY } from "@/utils/DateFormatters";
import { InputBase } from "../InputBase";
import type { InputDateProps } from "./InputData.types";

type ValueType = Date | null | undefined;

export function InputDate({
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
  mode = "date",
  ...rest
}: Omit<InputDateProps, "value" | "onChange"> & {
  value?: ValueType;
  onChange?: (date: Date | null) => void;
}) {
  const [visible, setVisible] = useState(false);

  const currentDate = value ?? new Date();

  const handleConfirm = (date: Date) => {
    setVisible(false);
    onChange?.(date);
  };

  return (
    <>
      <InputBase
        suffixIcon="calendar"
        {...(rest as any)}
        editable={false}
        onPressIn={() => setVisible(true)}
        placeholder={placeholder}
        value={value ? formatDateToDDMMYYYY(value) : ""}
      />

      <DateTimePickerModal
        date={currentDate}
        isVisible={visible}
        mode={mode}
        onCancel={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
