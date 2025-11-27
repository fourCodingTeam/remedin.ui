import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import type { MedicineDtoResponse } from "@/services/@types/medicine";
import type { ScheduleDtoResponse } from "@/services/@types/schedule";
import { getAllMedicines } from "@/services/api/medicine";
import { getAllSchedules } from "@/services/api/schedule";
import { getAuthToken } from "@/services/utils/getAuthToken";

export type MedicineWithSchedules = MedicineDtoResponse & {
  schedules: ScheduleDtoResponse[];
};

function getSchedulesFromResponse(
  schedulesResponse: Awaited<ReturnType<typeof getAllSchedules>>
): ScheduleDtoResponse[] {
  if (schedulesResponse.success && schedulesResponse.data) {
    return schedulesResponse.data.items;
  }
  return [];
}

function mapSchedulesToMedicines(
  medicines: MedicineDtoResponse[],
  schedules: ScheduleDtoResponse[]
): MedicineWithSchedules[] {
  return medicines.map((medicine) => ({
    ...medicine,
    schedules: schedules.filter(
      (schedule) => schedule.medicineId === medicine.id
    ),
  }));
}

export function useMedicines(memberId?: string | null) {
  const [medicines, setMedicines] = useState<MedicineWithSchedules[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const loadMedicines = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        showToast("Você precisa estar autenticado", "error");
        return;
      }

      const [medicinesResponse, schedulesResponse] = await Promise.all([
        getAllMedicines(token, 1, 100, memberId || undefined),
        getAllSchedules(token, 1, 1000, memberId || undefined),
      ]);

      const hasError = !medicinesResponse.success;
      const noData = !medicinesResponse.data;
      if (hasError || noData) {
        showToast(
          medicinesResponse.message || "Erro ao carregar medicações",
          "error"
        );
        return;
      }

      const schedules = getSchedulesFromResponse(schedulesResponse);

      // Map schedules to medicines
      if (medicinesResponse.data) {
        const medicinesWithSchedules = mapSchedulesToMedicines(
          medicinesResponse.data.items,
          schedules
        );
        setMedicines(medicinesWithSchedules);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao carregar medicações";
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast, memberId]);

  useEffect(() => {
    loadMedicines();
  }, [loadMedicines]);

  return {
    medicines,
    isLoading,
    reloadMedicines: loadMedicines,
  };
}
