import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/services/supabase/supabaseClient";
import {
  clearSession,
  getStoredSession,
  type StoredSession,
  saveSession,
} from "@/storage/authStorage";
import { useAuthStore } from "@/stores/AuthStore";

WebBrowser.maybeCompleteAuthSession();

let initialized = false;
let linkingSubscription: { remove: () => void } | null = null;
let authUnsubscribe: (() => void) | null = null;

export async function initAuth() {
  if (initialized) {
    return;
  }
  initialized = true;

  const { setUser, setIsLoadingAuth } = useAuthStore.getState();

  setIsLoadingAuth(true);

  try {
    const stored = await getStoredSession();

    if (stored) {
      const { access_token, refresh_token } = stored;
      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (!error) {
        setUser(data.session?.user ?? null);
      }
    }
  } catch (err) {
    throw new Error(`[initAuth] erro ao restaurar sessão: ${err}`);
  } finally {
    setIsLoadingAuth(false);
  }

  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const { setUser } = useAuthStore.getState();

    setUser(session?.user ?? null);

    if (session?.access_token && session.refresh_token) {
      const s: StoredSession = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      };
      saveSession(s).catch(
        (err) => new Error(`[initAuth] erro ao salvar sessão: ${err}`)
      );
    } else {
      clearSession().catch(
        (err) => new Error(`[initAuth] erro ao limpar sessão: ${err}`)
      );
    }
  });

  authUnsubscribe = () => data.subscription.unsubscribe();

  linkingSubscription = Linking.addEventListener("url", async ({ url }) => {
    try {
      const [, hash] = url.split("#");
      if (!hash) {
        return;
      }

      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!(access_token && refresh_token)) {
        return;
      }

      await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
    } catch (err) {
      new Error(`[initAuth] erro no deep-link OAuth: ${err}`);
    }
  });
}

export function disposeAuth() {
  if (authUnsubscribe) {
    authUnsubscribe();
  }
  if (linkingSubscription) {
    linkingSubscription.remove();
  }
}
