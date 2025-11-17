/**
 * Converts a TimeOnly string (HH:mm:ss) to a Date object with today's date
 */
export function timeOnlyToDate(
  timeOnly: string | null | undefined
): Date | null {
  if (!timeOnly) {
    return null;
  }
  // Extract HH:mm from HH:mm:ss
  const [hours, minutes] = timeOnly.substring(0, 5).split(":");
  if (!(hours && minutes)) {
    return null;
  }

  const date = new Date();
  date.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0);
  return date;
}
