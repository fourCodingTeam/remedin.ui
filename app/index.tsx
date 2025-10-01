import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  useEffect(() => {
    const checkSession = async () => {
      const sessionStr = await SecureStore.getItemAsync("supabase_session");
      if (sessionStr) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    };
    checkSession();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
