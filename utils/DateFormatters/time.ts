/**
 * Formats a Date object time to HH:mm for display
 */
export function formatTimeToDisplay(date: Date | null | undefined): string {
  if (!date) {
    return "";
  }
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
