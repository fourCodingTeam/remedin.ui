/**
 * Converts a DateOnly string (YYYY-MM-DD) to a Date object
 */
export function dateOnlyToDate(
  dateOnly: string | null | undefined
): Date | null {
  if (!dateOnly) {
    return null;
  }
  const date = new Date(`${dateOnly}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Converts a Date object to DateOnly string (YYYY-MM-DD)
 */
export function dateToDateOnly(date: Date | null | undefined): string | null {
  if (!date) {
    return null;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a DateOnly string (YYYY-MM-DD) to DD/MM/YYYY for display
 */
export function formatDateOnlyToDisplay(
  dateOnly: string | null | undefined
): string {
  if (!dateOnly) {
    return "";
  }
  const date = dateOnlyToDate(dateOnly);
  if (!date) {
    return "";
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
