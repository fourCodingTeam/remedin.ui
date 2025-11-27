import { Eye, EyeOff } from "lucide-react-native";
import type React from "react";
import { useState } from "react";
import { type BlurEvent, type FocusEvent, Pressable } from "react-native";
import { theme } from "@/constants/theme";
import {
  InputBaseWrapper,
  InputPrefixIconWrapper,
  InputStyle,
  InputSuffixIconWrapper,
  PasswordToggleWrapper,
} from "./InputBase.styles";
import type { InputBaseProps } from "./InputBase.types";

export const InputBase: React.FC<InputBaseProps> = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = props.secureTextEntry === true;
  const showPasswordToggle = isPassword;

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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <InputBaseWrapper
      enableFlexOne={props.enableFlexOne ?? false}
      isActive={isFocused}
      isCompact={props.compact ?? true}
    >
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
          autoCapitalize="none"
          onBlur={onBlur}
          onFocus={onFocus}
          pointerEvents={props.editable === false ? "none" : undefined}
          secureTextEntry={isPassword && !isPasswordVisible}
        />
        {showPasswordToggle && (
          <PasswordToggleWrapper onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <Eye color={theme.colors.text.muted} size={18} />
            ) : (
              <EyeOff color={theme.colors.text.muted} size={18} />
            )}
          </PasswordToggleWrapper>
        )}
        {props.suffixIcon && !showPasswordToggle && (
          <InputSuffixIconWrapper
            color={theme.colors.text.muted}
            name={props.suffixIcon}
            size={12}
          />
        )}
      </Pressable>
    </InputBaseWrapper>
  );
};
