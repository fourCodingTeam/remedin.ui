import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Home() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo à Home!</Text>
      <Button
        title="Sair"
        onPress={async () => {
          await signOut();
          router.replace("/login");
        }}
      />
    </View>
  );
}
