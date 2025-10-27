import React, { useState } from "react";
import { BlurEvent, FocusEvent, Pressable } from "react-native";
import { InputBaseWrapper, InputPrefixIconWrapper, InputStyle, InputSuffixIconWrapper } from "./InputBase.styles";
import { InputBaseProps } from "./InputBase.types";

export const InputBase: React.FC<InputBaseProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = (e: FocusEvent) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };
  const onBlur = (e: BlurEvent) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <InputBaseWrapper isActive={isFocused} isCompact={props.compact}>
      <Pressable onPressIn={props.onPressIn} disabled={props.editable === false ? false : undefined} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {props.prefixIcon && <InputPrefixIconWrapper name={props.prefixIcon} size={18} />}
        <InputStyle {...props} onFocus={onFocus} onBlur={onBlur} pointerEvents={props.editable === false ? "none" : undefined} />
        {props.suffixIcon && <InputSuffixIconWrapper name={props.suffixIcon} size={18} />}
      </Pressable>
    </InputBaseWrapper>
  );
};
