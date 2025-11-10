import { useMemo } from "react";
import { theme } from "@/constants/theme";
import { StyledText } from "../StyledText";
import { AvatarContainer, AvatarImage, StatusBadge } from "./Avatar.styles";
import type { AvatarProps, AvatarSize, AvatarStatus } from "./Avatar.types";

const sizeToTextVariant: Record<
  AvatarSize,
  "smallSemiBold" | "mediumSemiBold" | "largeSemiBold" | "largestSemiBold"
> = {
  xs: "smallSemiBold",
  sm: "smallSemiBold",
  md: "mediumSemiBold",
  lg: "largeSemiBold",
  xl: "largestSemiBold",
};

const statusColorMap: Record<AvatarStatus, string> = {
  online: theme.colors.warnings.success,
  away: theme.colors.warnings.warning,
  busy: theme.colors.warnings.danger,
  offline: theme.colors.border.muted,
  none: "transparent",
};

export function Avatar({
  name,
  source,
  size = "md",
  bordered,
  fallbackBackgroundColor,
  status = "none",
  statusColor,
  style,
  onPress,
  ...rest
}: AvatarProps) {
  const hasImage = Boolean(source);

  const initials = useMemo(() => {
    if (!name) {
      return "";
    }

    const normalizedName = name.trim().replace(/\s+/g, " ");

    if (!normalizedName) {
      return "";
    }

    const nameParts = normalizedName.split(" ");
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() ?? "";
    const secondInitial =
      nameParts.length > 1 ? (nameParts.at(-1)?.[0]?.toUpperCase() ?? "") : "";

    return `${firstInitial}${secondInitial}`.slice(0, 2);
  }, [name]);

  const derivedStatusColor = useMemo(() => {
    if (statusColor) {
      return statusColor;
    }

    return statusColorMap[status];
  }, [status, statusColor]);

  return (
    <AvatarContainer
      bordered={bordered}
      fallbackBackgroundColor={fallbackBackgroundColor}
      hasImage={hasImage}
      onPress={onPress}
      size={size}
      style={style}
      {...rest}
    >
      {hasImage ? (
        <AvatarImage resizeMode="cover" size={size} source={source} />
      ) : (
        <StyledText color="light" variant={sizeToTextVariant[size]}>
          {initials || "?"}
        </StyledText>
      )}

      {status !== "none" && derivedStatusColor !== "transparent" && (
        <StatusBadge size={size} statusColor={derivedStatusColor} />
      )}
    </AvatarContainer>
  );
}
