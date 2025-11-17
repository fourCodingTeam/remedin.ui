/**
 * Formats a TimeOnly string (HH:mm:ss) to HH:mm for display
 */
export function formatTimeOnlyToDisplay(
  timeOnly: string | null | undefined
): string {
  if (!timeOnly) {
    return "";
  }
  // Extract HH:mm from HH:mm:ss format
  return timeOnly.substring(0, 5);
}

/**
 * Formats a Date object time to TimeOnly string (HH:mm:ss)
 */
export function dateToTimeOnly(date: Date | null | undefined): string | null {
  if (!date) {
    return null;
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}:00`;
}
