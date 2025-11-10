import { createClient } from "@supabase/supabase-js";

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const EXPO_PUBLIC_SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_URL is not set. Please check your environment variables."
  );
}

if (!EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error(
    "EXPO_PUBLIC_SUPABASE_ANON_KEY is not set. Please check your environment variables."
  );
}

export const supabase = createClient(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
