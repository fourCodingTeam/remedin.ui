import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useState } from "react";
import { BlurEvent, FocusEvent } from "react-native";
import { InputBaseWrapper, InputStyle } from "./InputBase.styles";
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
    <InputBaseWrapper isActive={isFocused}>
      {props.prefixIcon && <FontAwesome name={props.prefixIcon} />}
      <InputStyle {...props} onFocus={onFocus} onBlur={onBlur} />
      {props.suffixIcon && <FontAwesome name={props.suffixIcon} />}
    </InputBaseWrapper>
  );
};
