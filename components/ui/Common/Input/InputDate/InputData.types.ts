import type { Dispatch, SetStateAction } from "react";
import type { InputBaseProps } from "../InputBase.types";

export type InputDateProps = Omit<
  InputBaseProps,
  "onChange" | "keyboardType"
> & {
  value?: string;
  onChange?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  mode?: "date" | "time" | "datetime";
};
