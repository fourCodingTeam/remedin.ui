import * as SecureStore from "expo-secure-store";

const API_BASE = "http://192.168.12.17:7191";

export async function getMeFromApi() {
  const saved = await SecureStore.getItemAsync("supabase_session");
  if (!saved) throw new Error("No session");

  const { access_token } = JSON.parse(saved);

  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`API error ${res.status}: ${txt}`);
  }

  return res.json();
}
