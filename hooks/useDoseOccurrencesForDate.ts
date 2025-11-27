import { useCallback, useEffect, useState } from "react";
import type { DoseOccurrenceDto } from "@/services/api/medicineAdherence";
import { getDailyHistory } from "@/services/api/medicineAdherence";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { getDateKey } from "@/utils/date/dateKey";

export function useDoseOccurrencesForDate(
  date: Date | null,
  memberId?: string | null
) {
  const [doseOccurrences, setDoseOccurrences] = useState<DoseOccurrenceDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDoseOccurrences = useCallback(async () => {
    if (!date) {
      setDoseOccurrences([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getAuthToken();
      if (!token) {
        setError("Você precisa estar autenticado");
        return;
      }

      const response = await getDailyHistory(date, token, memberId || undefined);

      if (response.success && response.data) {
        setDoseOccurrences(response.data);
      } else {
        setError(response.message || "Erro ao carregar doses");
        setDoseOccurrences([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar doses";
      setError(errorMessage);
      setDoseOccurrences([]);
    } finally {
      setIsLoading(false);
    }
  }, [date, memberId]);

  useEffect(() => {
    loadDoseOccurrences();
  }, [loadDoseOccurrences]);

  return {
    doseOccurrences,
    isLoading,
    error,
    reload: loadDoseOccurrences,
  };
}

