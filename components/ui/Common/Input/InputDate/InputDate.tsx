import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { InputBase } from "../InputBase";
import type { InputDateProps } from "./InputData.types";

function formatDateToDDMMYYYY(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${day}-${m}-${y}`;
}

export function InputDate({
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
  mode = "date",
  ...rest
}: InputDateProps) {
  const [visible, setVisible] = useState(false);

  const parseDateOrNow = (val?: string) => {
    if (!val) {
      return new Date();
    }
    const parsed = new Date(val);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const handleConfirm = (date: Date) => {
    const formatted = formatDateToDDMMYYYY(date);
    setVisible(false);
    onChange?.(formatted);
  };

  return (
    <>
      <InputBase
        suffixIcon="calendar"
        {...(rest as any)}
        editable={false}
        onPressIn={() => setVisible(true)}
        placeholder={placeholder}
        value={value}
      />

      <DateTimePickerModal
        date={parseDateOrNow(value)}
        isVisible={visible}
        mode={
          mode === "datetime" ? "date" : (mode as "date" | "time" | "datetime")
        }
        onCancel={() => setVisible(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
}
