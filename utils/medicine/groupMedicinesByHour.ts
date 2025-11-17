import type { MedicineCardData } from "./medicineCardMapper";

export type MedicinesByHour = {
  hour: string;
  medicines: MedicineCardData[];
};

/**
 * Groups medicine cards by hour for timeline display
 */
export function groupMedicinesByHour(
  medicines: MedicineCardData[]
): MedicinesByHour[] {
  const hourMap = new Map<string, MedicineCardData[]>();

  for (const medicine of medicines) {
    // Extract hour from scheduleLabel (format: "HH:mm - ...")
    const timeMatch = medicine.card.scheduleLabel.match(/^(\d{2}):(\d{2})/);
    if (!timeMatch) {
      continue;
    }

    const hours = timeMatch[1];
    const hour = `${hours}h00`; // Format: "08:00" -> "08h00"

    if (!hourMap.has(hour)) {
      hourMap.set(hour, []);
    }
    hourMap.get(hour)?.push(medicine);
  }

  // Convert to array and sort by hour
  const result: MedicinesByHour[] = Array.from(hourMap.entries())
    .map(([hour, medicinesList]) => ({
      hour,
      medicines: medicinesList,
    }))
    .sort((a, b) => {
      // Extract hour number for comparison
      const hourA = Number.parseInt(a.hour.replace("h00", ""), 10);
      const hourB = Number.parseInt(b.hour.replace("h00", ""), 10);
      return hourA - hourB;
    });

  return result;
}

