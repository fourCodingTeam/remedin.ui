import type { PersonRequest } from "@/services/@types/person";
import { registerPerson } from "@/services/api/person";
import { supabase } from "@/services/supabase/supabaseClient";

export async function signUp(
  email: string,
  password: string,
  name: string,
  userName: string,
  birthDate: Date,
  phone: string,
  weightKg?: number | null,
  heightCm?: number | null
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
      birthDate,
      weightKg,
      heightCm,
    };

    const personResponse = await registerPerson(person);

    return personResponse;
  } catch (err) {
    if (err instanceof Error) {
      if (
        err.message.includes("Network request failed") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        throw new Error(
          "Erro de conexão. Verifique sua internet e tente novamente."
        );
      }
      throw err;
    }
    throw new Error("Erro desconhecido ao criar conta. Tente novamente.");
  }
}
