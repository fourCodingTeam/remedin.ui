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
  if (!dateKey || typeof dateKey !== "string") {
    throw new Error(`Invalid dateKey: ${dateKey}`);
  }
  
  const parts = dateKey.split("-");
  if (parts.length !== 3) {
    throw new Error(`Invalid dateKey format: ${dateKey}. Expected YYYY-MM-DD`);
  }
  
  const year = Number.parseInt(parts[0], 10);
  const month = Number.parseInt(parts[1], 10);
  const day = Number.parseInt(parts[2], 10);
  
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error(`Invalid dateKey: ${dateKey}. Could not parse numbers`);
  }
  
  // Create date using local time (month is 0-indexed in Date constructor)
  const date = new Date(year, month - 1, day);
  
  // Validate that the date is valid
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid dateKey: ${dateKey}. Date values out of range`);
  }
  
  date.setHours(0, 0, 0, 0);
  return date;
}
