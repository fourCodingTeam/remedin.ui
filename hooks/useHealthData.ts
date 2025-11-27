import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  getLatestVitalSign,
  getVitalSigns,
  type VitalSignRecordDto,
} from "@/services/api/health";
import { VitalSignType } from "@/services/@types/enums";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useMemberContext } from "./useMemberContext";

export function useHealthData() {
  const { showToast } = useToast();
  const { memberId } = useMemberContext();
  const [latestWeight, setLatestWeight] = useState<number | null>(null);
  const [latestHeight, setLatestHeight] = useState<number | null>(null);
  const [latestBloodPressure, setLatestBloodPressure] = useState<string | null>(
    null
  );
  const [latestBloodSugar, setLatestBloodSugar] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [vitalSigns, setVitalSigns] = useState<VitalSignRecordDto[]>([]);

  const loadHealthData = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        return;
      }

      // Load latest weight
      const weightResponse = await getLatestVitalSign(
        VitalSignType.Weight,
        token,
        memberId || undefined
      );
      if (weightResponse.success && weightResponse.data) {
        setLatestWeight(weightResponse.data.value);
      }

      // Load latest height
      const heightResponse = await getLatestVitalSign(
        VitalSignType.Height,
        token,
        memberId || undefined
      );
      if (heightResponse.success && heightResponse.data) {
        setLatestHeight(heightResponse.data.value);
      }

      // Load latest blood pressure
      const bpResponse = await getLatestVitalSign(
        VitalSignType.BloodPressure,
        token,
        memberId || undefined
      );
      if (bpResponse.success && bpResponse.data) {
        const systolic = bpResponse.data.value;
        const diastolic = bpResponse.data.secondaryValue;
        if (systolic && diastolic) {
          setLatestBloodPressure(`${systolic}/${diastolic}`);
        }
      }

      // Load latest blood sugar
      const sugarResponse = await getLatestVitalSign(
        VitalSignType.BloodSugar,
        token,
        memberId || undefined
      );
      if (sugarResponse.success && sugarResponse.data) {
        setLatestBloodSugar(sugarResponse.data.value);
      }

      // Load all vital signs for history
      const allResponse = await getVitalSigns(token, memberId || undefined);
      if (allResponse.success && allResponse.data) {
        setVitalSigns(allResponse.data);
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados de saúde",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast, memberId]);

  useEffect(() => {
    loadHealthData();
  }, [loadHealthData]);

  return {
    latestWeight,
    latestHeight,
    latestBloodPressure,
    latestBloodSugar,
    vitalSigns,
    isLoading,
    reload: loadHealthData,
  };
}

