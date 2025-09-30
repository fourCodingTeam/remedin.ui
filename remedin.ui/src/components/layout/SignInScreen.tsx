import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function SignInScreen() {
  const { signInWithEmail, signInWithGoogle, signOut } = useAuth(); // adicionei signOut
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Verifica se existe sessão salva
  useEffect(() => {
    (async () => {
      try {
        const sessionStr = await SecureStore.getItemAsync("supabase_session");
        if (sessionStr) {
          const session = JSON.parse(sessionStr);
          if (session?.access_token) {
            setAuthenticated(true);
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

  if (authenticated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Você já está logado!</Text>
        <Button title="Continuar" onPress={() => console.log("Ir para Home")} />
        <View style={{ height: 12 }} />
        <Button
          title="Sair"
          color="red"
          onPress={async () => {
            try {
              await signOut(); // limpa sessão do supabase + SecureStore
              setAuthenticated(false); // volta pra tela de login
            } catch (err) {
              console.error("Erro ao deslogar:", err);
            }
          }}
        />
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
            setAuthenticated(true);
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
            setAuthenticated(true);
          } catch (e: any) {
            setError(e.message);
          }
        }}
      />
      {error && <Text style={{ color: "red" }}>{error}</Text>}
    </View>
  );
}
