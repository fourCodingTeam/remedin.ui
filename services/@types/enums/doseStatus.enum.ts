/**
 * DoseStatus enum - matches backend DoseStatus enum
 * Backend values: Pending = 1, Taken = 2, Skipped = 3, Expired = 4
 * Backend returns status as string via ToString(): "Pending", "Taken", "Skipped", "Expired"
 */
export enum DoseStatus {
  Pending = 1,
  Taken = 2,
  Skipped = 3,
  Expired = 4,
}

/**
 * Helper function to parse status from backend response
 * Backend returns status as string: "Pending", "Taken", "Skipped", "Expired"
 */
export function parseDoseStatus(status: string | number | null | undefined): DoseStatus {
  if (status == null || status === undefined) {
    return DoseStatus.Pending;
  }

  // If it's already a number matching our enum
  if (typeof status === "number") {
    if (status === DoseStatus.Taken) return DoseStatus.Taken;
    if (status === DoseStatus.Skipped) return DoseStatus.Skipped;
    if (status === DoseStatus.Expired) return DoseStatus.Expired;
    return DoseStatus.Pending;
  }

  // If it's a string, parse it
  const statusStr = String(status).trim();
  const statusUpper = statusStr.toUpperCase();

  if (statusUpper === "TAKEN" || statusStr === "Taken") {
    return DoseStatus.Taken;
  }
  if (statusUpper === "SKIPPED" || statusStr === "Skipped") {
    return DoseStatus.Skipped;
  }
  if (statusUpper === "EXPIRED" || statusStr === "Expired") {
    return DoseStatus.Expired;
  }

  // Try parsing as number string
  const parsed = parseInt(statusStr, 10);
  if (!isNaN(parsed)) {
    if (parsed === DoseStatus.Taken) return DoseStatus.Taken;
    if (parsed === DoseStatus.Skipped) return DoseStatus.Skipped;
    if (parsed === DoseStatus.Expired) return DoseStatus.Expired;
  }

  // Default to Pending
  return DoseStatus.Pending;
}

