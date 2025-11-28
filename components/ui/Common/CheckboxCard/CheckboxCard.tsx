import { useCallback, useMemo, useState } from "react";
import { theme } from "@/constants/theme";
import { Checkbox, CheckboxCardWrapper } from "./CheckboxCard.styles";
import type {
  CheckboxCardProps,
  CheckboxCardRenderProps,
  CheckboxCardTone,
} from "./CheckboxCard.types";

type ToneColorConfig = {
  background: string;
  border: string;
  checkboxBorder: string;
  checkboxBackground: string;
  textColor: CheckboxCardRenderProps["textColor"];
  secondaryTextColor?: CheckboxCardRenderProps["secondaryTextColor"];
};

type ToneStateConfig = {
  unchecked: ToneColorConfig;
  checked: ToneColorConfig;
};

const toneConfigMap: Record<CheckboxCardTone, ToneStateConfig> = {
  neutral: {
    unchecked: {
      background: theme.colors.background.light,
      border: theme.colors.border.default,
      checkboxBorder: theme.colors.border.default,
      checkboxBackground: "transparent",
      textColor: "dark",
      secondaryTextColor: "muted",
    },
    checked: {
      background: theme.colors.background.light,
      border: theme.colors.accent.primary,
      checkboxBorder: theme.colors.common.black,
      checkboxBackground: theme.colors.common.black,
      textColor: "dark",
      secondaryTextColor: "muted",
    },
  },
  primary: {
    unchecked: {
      background: theme.colors.accent.primaryFaded,
      border: theme.colors.accent.primary,
      checkboxBorder: theme.colors.accent.primary,
      checkboxBackground: "transparent",
      textColor: "light",
      secondaryTextColor: "muted",
    },
    checked: {
      background: theme.colors.accent.primary,
      border: theme.colors.accent.primary,
      checkboxBorder: theme.colors.accent.primary,
      checkboxBackground: theme.colors.background.light,
      textColor: "dark",
      secondaryTextColor: "dark",
    },
  },
  secondary: {
    unchecked: {
      background: theme.colors.accent.secondary,
      border: theme.colors.accent.secondary,
      checkboxBorder: theme.colors.background.light,
      checkboxBackground: "transparent",
      textColor: "light",
      secondaryTextColor: "light",
    },
    checked: {
      background: theme.colors.accent.secondaryFaded,
      border: theme.colors.accent.secondaryFaded,
      checkboxBorder: theme.colors.background.light,
      checkboxBackground: theme.colors.background.light,
      textColor: "light",
      secondaryTextColor: "light",
    },
  },
  danger: {
    unchecked: {
      background: theme.colors.background.default,
      border: theme.colors.warnings.danger,
      checkboxBorder: theme.colors.warnings.danger,
      checkboxBackground: "transparent",
      textColor: "error",
      secondaryTextColor: "error",
    },
    checked: {
      background: theme.colors.warnings.danger,
      border: theme.colors.warnings.danger,
      checkboxBorder: theme.colors.background.light,
      checkboxBackground: theme.colors.background.light,
      textColor: "light",
      secondaryTextColor: "light",
    },
  },
};

export function CheckboxCard({
  value,
  tone = "neutral",
  checked,
  defaultChecked = false,
  disabled,
  onChange,
  onPress,
  children,
  renderRightAccessory,
  style,
}: CheckboxCardProps) {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isChecked = isControlled ? (checked as boolean) : internalChecked;

  const toneConfig = toneConfigMap[tone];
  const stateConfig = isChecked ? toneConfig.checked : toneConfig.unchecked;

  const checkboxBackgroundColor = stateConfig.checkboxBackground;
  const checkboxBorderColor = stateConfig.checkboxBorder;

  const renderProps: CheckboxCardRenderProps = useMemo(
    () => ({
      checked: isChecked,
      textColor: stateConfig.textColor,
      secondaryTextColor:
        stateConfig.secondaryTextColor ?? stateConfig.textColor,
    }),
    [isChecked, stateConfig.secondaryTextColor, stateConfig.textColor]
  );

  const toggle = useCallback(() => {
    if (disabled) {
      return;
    }

    const nextValue = !isChecked;

    if (!isControlled) {
      setInternalChecked(nextValue);
    }

    onChange?.(value, nextValue);
    onPress?.(value, nextValue);
  }, [disabled, isChecked, isControlled, onChange, onPress, value]);

  const rightAccessory = useMemo(() => {
    if (renderRightAccessory) {
      return renderRightAccessory(renderProps);
    }

    return (
      <Checkbox
        backgroundColor={checkboxBackgroundColor}
        borderColor={checkboxBorderColor}
        checked={isChecked}
      />
    );
  }, [
    renderRightAccessory,
    renderProps,
    checkboxBackgroundColor,
    checkboxBorderColor,
    isChecked,
  ]);

  return (
    <CheckboxCardWrapper
      backgroundColor={stateConfig.background}
      borderColor={stateConfig.border}
      disabled={disabled}
      onPress={toggle}
      style={style}
    >
      {children(renderProps)}
      {rightAccessory}
    </CheckboxCardWrapper>
  );
}
