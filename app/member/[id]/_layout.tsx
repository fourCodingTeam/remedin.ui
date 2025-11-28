import { useEffect } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useMemberStore } from "@/stores/MemberStore";
import { getMemberById as getMemberByIdFromApi } from "@/services/api/person";
import { getAuthToken } from "@/services/utils/getAuthToken";
import { useToast } from "@/components/ui/Toast";

export default function MemberLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setMember, getMemberById: getMemberFromStore, setWeight, setHeight } = useMemberStore();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const loadMemberData = async () => {
      if (!id) {
        router.replace("/(tabs)");
        return;
      }

      const memberFromStore = getMemberFromStore(id);
      if (memberFromStore) {
        setMember({
          id: id,
          name: memberFromStore.name,
          phoneNumber: memberFromStore.phoneNumber || memberFromStore.phone || "",
          avatar: memberFromStore.avatar || "",
        });
        // Set weight and height from store if available
        if (memberFromStore.weightKg) {
          setWeight(memberFromStore.weightKg);
        }
        if (memberFromStore.heightCm) {
          setHeight(memberFromStore.heightCm);
        }
        return;
      }

      // If not in store, fetch from API
      try {
        const token = await getAuthToken();
        if (!token) {
          showToast("Erro de autenticação", "error");
          router.replace("/(tabs)");
          return;
        }

        const response = await getMemberByIdFromApi(id, token);
        if (response.success && response.data) {
          setMember({
            id: id,
            name: response.data.name,
            phoneNumber: response.data.phone || "",
            avatar: "",
          });
          // Set weight and height from API response
          if (response.data.weightKg) {
            setWeight(response.data.weightKg);
          }
          if (response.data.heightCm) {
            setHeight(response.data.heightCm);
          }
        } else {
          showToast(
            response.message || "Erro ao carregar dados do membro",
            "error"
          );
          router.replace("/(tabs)");
        }
      } catch (error) {
        showToast(
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do membro",
          "error"
        );
        router.replace("/(tabs)");
      }
    };

    loadMemberData();
  }, [id, setMember, getMemberFromStore, setWeight, setHeight, showToast, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

