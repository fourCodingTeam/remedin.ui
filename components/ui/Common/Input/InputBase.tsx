import type React from "react";
import { useState } from "react";
import { type BlurEvent, type FocusEvent, Pressable } from "react-native";
import { theme } from "@/constants/theme";
import {
  InputBaseWrapper,
  InputPrefixIconWrapper,
  InputStyle,
  InputSuffixIconWrapper,
} from "./InputBase.styles";
import type { InputBaseProps } from "./InputBase.types";

export const InputBase: React.FC<InputBaseProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (e: FocusEvent) => {
    setIsFocused(true);
    if (props.onFocus) {
      props.onFocus(e);
    }
  };
  const onBlur = (e: BlurEvent) => {
    setIsFocused(false);
    if (props.onBlur) {
      props.onBlur(e);
    }
  };

  return (
    <InputBaseWrapper isActive={isFocused} isCompact={props.compact}>
      <Pressable
        disabled={props.editable === false ? false : undefined}
        onPressIn={props.onPressIn}
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      >
        {props.prefixIcon && (
          <InputPrefixIconWrapper
            color={theme.colors.text.muted}
            name={props.prefixIcon}
            size={18}
          />
        )}
        <InputStyle
          {...props}
          onBlur={onBlur}
          onFocus={onFocus}
          pointerEvents={props.editable === false ? "none" : undefined}
        />
        {props.suffixIcon && (
          <InputSuffixIconWrapper
            color={theme.colors.text.muted}
            name={props.suffixIcon}
            size={18}
          />
        )}
      </Pressable>
    </InputBaseWrapper>
  );
};
