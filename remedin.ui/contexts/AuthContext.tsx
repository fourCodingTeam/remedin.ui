import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type AuthContextType = {
  user: any | null;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const redirectUri = Linking.createURL("auth/callback");

  useEffect(() => {
    // 1) Tenta recuperar sessão salva no SecureStore ao iniciar
    (async () => {
      const saved = await SecureStore.getItemAsync("supabase_session");
      if (saved) {
        try {
          const { access_token, refresh_token } = JSON.parse(saved);
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (!error) setUser(data.session?.user ?? null);
        } catch (error) {
          console.log(error);
        }
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        // salvamos sessão em SecureStore para persistência
        if (session?.access_token) {
          SecureStore.setItemAsync(
            "supabase_session",
            JSON.stringify({
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            })
          );
        } else {
          SecureStore.deleteItemAsync("supabase_session");
        }
      }
    );

    // 3) Listener para deep-links vindos do flow OAuth (quando supabase redireciona com tokens no hash)
    const subscription = Linking.addEventListener("url", async ({ url }) => {
      const [, hash] = url.split("#");

      if (!hash) return;

      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (access_token == null || refresh_token == null) return;

      // configura a sessão no supabase client
      await supabase.auth.setSession({ access_token, refresh_token });
      // onAuthStateChange será disparado e salvará session no SecureStore
    });

    return () => {
      authListener?.subscription.unsubscribe();
      subscription.remove();
    };
  }, []);

  // Funções públicas
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    const session = data.session;
    if (session) {
      await SecureStore.setItemAsync(
        "supabase_session",
        JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })
      );
      setUser(session.user);
    }
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectUri },
    });
    if (error) throw error;
    await WebBrowser.openBrowserAsync(data.url);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync("supabase_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, signUp, signInWithEmail, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
