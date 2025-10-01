import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";

export default function SignInScreen() {
  const { signInWithEmail, signInWithGoogle, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const sessionStr = await SecureStore.getItemAsync("supabase_session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session?.access_token) {
          }
        }
      } catch (err) {
        console.error("Erro ao ler sessão:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Entrar com Email"
        onPress={async () => {
          try {
            await signInWithEmail(email, password);
          } catch (e: any) {
            setError(e.message);
          }
        }}
      />
      <View style={{ height: 12 }} />
      <Button
        title="Entrar com Google"
        onPress={async () => {
          try {
            await signInWithGoogle();
          } catch (e: any) {
            setError(e.message);
          }
        }}
      />
      <Button title="Criar conta" onPress={() => router.push("/register")} />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}
