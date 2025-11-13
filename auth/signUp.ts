import type { PersonRequest } from "@/services/@types/person";
import { registerPerson } from "@/services/api/person";
import { supabase } from "@/services/supabase/supabaseClient";

export async function signUp(
  email: string,
  password: string,
  name: string,
  userName: string,
  phone: string,
  birthDate: string,
  weightKg?: string | null,
  heightCm?: string | null
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    const access_token = data.session?.access_token;

    if (error || !access_token) {
      throw error;
    }

    const person: PersonRequest = {
      token: access_token,
      email,
      name,
      userName,
      phone,
      birthDate: new Date(birthDate),
      weightKg,
      heightCm,
    };

    const personResponse = await registerPerson(person);

    return personResponse;
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
