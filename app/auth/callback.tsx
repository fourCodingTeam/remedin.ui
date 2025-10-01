import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function Callback() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace("/home");
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
