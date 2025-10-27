import React, { useState } from "react";
import { Platform } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { InputBase } from "../InputBase";
import type { InputDateProps } from "./InputData.types";

function formatDateToYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function InputDate({
  value,
  onChange,
  placeholder = "YYYY-MM-DD",
  mode = "date",
  ...rest
}: InputDateProps) {
  const [visible, setVisible] = useState(false);

  const parseDateOrNow = (val?: string) => {
    if (!val) return new Date();
    const parsed = new Date(val);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const handleConfirm = (date: Date) => {
    const formatted = formatDateToYYYYMMDD(date);
    setVisible(false);
    onChange?.(formatted);
  };

   return (
    <>
      <InputBase
        suffixIcon="calendar-plus-o"
        {...(rest as any)}
        value={value}
        placeholder={placeholder}
        editable={false}
        onPressIn={() => setVisible(true)} 
      />

      <DateTimePickerModal
        isVisible={visible}
        mode={mode === "datetime" && Platform.OS === "web" ? "date" : (mode as any)}
        date={parseDateOrNow(value)}
        onConfirm={handleConfirm}
        onCancel={() => setVisible(false)}
      />
    </>
  );
}