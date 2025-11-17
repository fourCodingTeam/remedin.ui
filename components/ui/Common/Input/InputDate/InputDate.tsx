import { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  formatDateToDDMMYYYY,
  formatTimeToDisplay,
} from "@/utils/DateFormatters";
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

  const getDisplayValue = () => {
    if (!value) {
      return "";
    }
    if (mode === "time") {
      return formatTimeToDisplay(value);
    }
    return formatDateToDDMMYYYY(value);
  };

  const suffixIcon = mode === "time" ? "clock" : "calendar";

  return (
    <>
      <InputBase
        suffixIcon={suffixIcon}
        {...(rest as Record<string, unknown>)}
        editable={false}
        onPressIn={() => setVisible(true)}
        placeholder={placeholder}
        value={getDisplayValue()}
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
