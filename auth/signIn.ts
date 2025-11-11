import type { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { supabase } from "@/services/supabase/supabaseClient";

WebBrowser.maybeCompleteAuthSession();

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

function buildSearchParams(url: string, delimiter: "?" | "#") {
  const index = url.indexOf(delimiter);

  if (index === -1) {
    return null;
  }

  const endIndex = delimiter === "?" ? url.indexOf("#") : undefined;

  return new URLSearchParams(
    url.slice(index + 1, endIndex === -1 ? undefined : endIndex)
  );
}

async function resolveSessionFromUrl(url: string): Promise<Session | null> {
  const hashParams = buildSearchParams(url, "#");
  const queryParams = buildSearchParams(url, "?");

  const getParam = (key: string) =>
    hashParams?.get(key) ?? queryParams?.get(key);

  const error = getParam("error");
  const errorDescription = getParam("error_description");

  if (error || errorDescription) {
    throw new Error(
      errorDescription ?? error ?? "Erro ao autenticar com o Google"
    );
  }

  const accessToken = getParam("access_token");
  const refreshToken = getParam("refresh_token");

  if (accessToken && refreshToken) {
    const { data, error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      throw sessionError;
    }

    return data.session ?? null;
  }

  const code = getParam("code");

  if (code) {
    const { data, error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      throw exchangeError;
    }

    return data.session ?? null;
  }

  return null;
}

export async function signInWithGoogle(): Promise<Session | null> {
  const redirectUri = Linking.createURL("/auth");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.url) {
    return null;
  }

  return new Promise<Session | null>((resolve, reject) => {
    let handled = false;
    let subscription: { remove: () => void } | null = null;
    let cancelTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanup = () => {
      if (subscription) {
        subscription.remove();
        subscription = null;
      }

      if (cancelTimeout) {
        clearTimeout(cancelTimeout);
        cancelTimeout = null;
      }
    };

    const finish = (session: Session | null) => {
      if (handled) {
        return;
      }
      handled = true;
      cleanup();
      resolve(session);
    };

    const fail = (err: unknown) => {
      if (handled) {
        return;
      }
      handled = true;
      cleanup();
      reject(err);
    };

    subscription = Linking.addEventListener("url", async ({ url }) => {
      if (!url) {
        return;
      }

      if (!url.startsWith(redirectUri)) {
        return;
      }

      try {
        const session = await resolveSessionFromUrl(url);
        try {
          WebBrowser.dismissBrowser();
        } catch {
          // Ignore – the browser might already be closed.
        }
        finish(session);
      } catch (err) {
        fail(err);
      }
    });

    WebBrowser.openBrowserAsync(data.url)
      .then((result) => {
        if (handled) {
          return;
        }

        const { type } = result;

        if (type === "cancel" || type === "dismiss") {
          cancelTimeout = setTimeout(() => {
            if (!handled) {
              finish(null);
            }
          }, 150);
        }
      })
      .catch((err) => {
        fail(err);
      });
  });
}
