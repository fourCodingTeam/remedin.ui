import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  VitalSignRecordDto,
} from "@/services/@types/health";
import {
  getLatestVitalSign,
  getVitalSigns,
} from "@/services/api/health";
import { VitalSignType } from "@/services/@types/enums";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useMemberContext } from "./useMemberContext";

export function useHealthData(memberIdOverride?: string | null) {
  const { showToast } = useToast();
  const { memberId: contextMemberId } = useMemberContext();
  
  // Usar memberId fornecido como parâmetro ou do contexto
  const effectiveMemberId = memberIdOverride ?? contextMemberId;
  
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
  // Guardar o memberId que foi usado para carregar os dados atuais
  const [loadedMemberId, setLoadedMemberId] = useState<string | null | undefined>(null);

  const loadHealthData = useCallback(async (forceReload = false) => {
    // Se o memberId for o mesmo e não for um reload forçado, não recarregar
    if (!forceReload && effectiveMemberId === loadedMemberId && loadedMemberId !== null) {
      return;
    }

    setIsLoading(true);
    // Limpar dados anteriores antes de carregar novos
    setLatestWeight(null);
    setLatestHeight(null);
    setLatestBloodPressure(null);
    setLatestBloodSugar(null);
    setVitalSigns([]);
    
    try {
      const token = await getAuthToken();
      if (!token) {
        return;
      }

      // Load latest weight
      const weightResponse = await getLatestVitalSign(
        VitalSignType.Weight,
        token,
        effectiveMemberId || undefined
      );
      if (weightResponse.success && weightResponse.data) {
        setLatestWeight(weightResponse.data.value);
      }

      // Load latest height
      const heightResponse = await getLatestVitalSign(
        VitalSignType.Height,
        token,
        effectiveMemberId || undefined
      );
      if (heightResponse.success && heightResponse.data) {
        setLatestHeight(heightResponse.data.value);
      }

      // Load latest blood pressure
      const bpResponse = await getLatestVitalSign(
        VitalSignType.BloodPressure,
        token,
        effectiveMemberId || undefined
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
        effectiveMemberId || undefined
      );
      if (sugarResponse.success && sugarResponse.data) {
        setLatestBloodSugar(sugarResponse.data.value);
      }

      // Load all vital signs for history
      const allResponse = await getVitalSigns(token, effectiveMemberId || undefined);
      if (allResponse.success && allResponse.data) {
        setVitalSigns(allResponse.data);
      }

      // Atualizar o memberId que foi usado para carregar
      setLoadedMemberId(effectiveMemberId);
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
  }, [showToast, effectiveMemberId, loadedMemberId]);

  // Função de reload que força o recarregamento
  const reloadHealthData = useCallback(() => {
    loadHealthData(true);
  }, [loadHealthData]);

  // Recarregar quando effectiveMemberId mudar
  useEffect(() => {
    loadHealthData();
  }, [loadHealthData, effectiveMemberId]);

  return {
    latestWeight,
    latestHeight,
    latestBloodPressure,
    latestBloodSugar,
    vitalSigns,
    isLoading,
    reload: reloadHealthData,
  };
}

