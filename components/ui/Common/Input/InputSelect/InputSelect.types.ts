import type { InputBaseProps } from "../InputBase.types";

export type Option = { label: string; value: string | number };

export type InputSelectProps = Omit<
  InputBaseProps,
  "onChange" | "editable" | "value"
> & {
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
};
