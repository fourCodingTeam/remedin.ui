/**
 * Converts a Date object to a date key string (YYYY-MM-DD)
 * Uses local time to avoid timezone issues
 */
export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Converts a date key string (YYYY-MM-DD) to a normalized Date object
 * Uses local time components to avoid timezone shifts
 */
export function getDateFromKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number.parseInt);
  // Create date using local time (month is 0-indexed in Date constructor)
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}
