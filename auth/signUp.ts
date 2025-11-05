import { supabase } from "@/services/supabase/supabaseClient";

export async function signUp(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    // Handle network errors and other exceptions
    if (err instanceof Error) {
      // Check if it's a network error
      if (
        err.message.includes("Network request failed") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        throw new Error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      }
      // Re-throw Supabase errors with their message
      throw err;
    }
    // Handle unknown errors
    throw new Error("Erro desconhecido ao criar conta. Tente novamente.");
  }
}
