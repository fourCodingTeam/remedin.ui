import { supabase } from "../supabase/supabaseClient";

/**
 * Gets the current authentication token from Supabase session
 * @returns The access token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data?.session) {
      return null;
    }

    return data.session.access_token;
  } catch (error) {
    throw new Error(
      `Error getting auth token: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
