import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

/**
 * Hook para detectar se estamos no contexto de um membro e retornar o memberId
 * @returns { memberId: string | null, isMemberContext: boolean }
 */
export function useMemberContext() {
  const params = useLocalSearchParams<{ id?: string }>();

  const memberId = useMemo(() => {
    // Se estamos na rota /member/[id], o id será o memberId
    if (params.id) {
      return params.id;
    }
    return null;
  }, [params.id]);

  const isMemberContext = useMemo(() => memberId !== null, [memberId]);

  return {
    memberId,
    isMemberContext,
  };
}
