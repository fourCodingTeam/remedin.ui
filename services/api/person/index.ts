import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse } from "@/services/@types/baseResponse";
import type { PersonRequest, PersonResponse } from "@/services/@types/person";

export async function registerPerson(
  request: PersonRequest
): Promise<BaseResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/Person`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${request.token}`,
      },
      body: JSON.stringify({
        email: request.email,
        name: request.name,
        userName: request.userName,
        phone: request.phone,
        birthDate: request.birthDate,
        weightKg: request.weightKg,
        heightCm: request.heightCm,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create resident: ${response.status}`);
    }

    const data = await response.json();
    return data as BaseResponse;
  } catch (error) {
    throw new Error(`Failed to create resident ${error}`);
  }
}

export async function GetCurrentPerson(
  token: string
): Promise<BaseResponse<PersonResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Person`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as BaseResponse<PersonResponse>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message ||
          `Erro ao buscar dados do usuário (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao buscar dados do usuário",
      data: undefined,
    };
  }
}
