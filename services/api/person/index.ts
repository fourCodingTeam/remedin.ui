import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse } from "@/services/@types/baseResponse";
import type { PersonRequest, PersonResponse } from "@/services/@types/person";

/**
 * Safely parses JSON response, handling empty responses and parse errors
 */
async function safeJsonParse<T>(
  response: Response
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // Clone the response to avoid consuming the body
    const contentType = response.headers.get("content-type");
    const hasJsonContent = contentType?.includes("application/json");

    // Read the text once
    const text = await response.text();
    
    if (!hasJsonContent) {
      return {
        success: false,
        error: `Resposta inválida do servidor: ${text.substring(0, 100)}`,
      };
    }

    if (!text || text.trim() === "") {
      return {
        success: false,
        error: "Resposta vazia do servidor",
      };
    }

    // Try to parse as JSON
    try {
      const data = JSON.parse(text) as T;
      return {
        success: true,
        data,
      };
    } catch (parseError) {
      return {
        success: false,
        error: `Erro ao processar JSON: ${parseError instanceof Error ? parseError.message : "Resposta inválida"}. Texto: ${text.substring(0, 200)}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: `Erro ao ler resposta: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    };
  }
}

export async function registerPerson(
  request: PersonRequest
): Promise<BaseResponse<PersonResponse>> {
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
        isMember: false,
      }),
    });

    const parseResult =
      await safeJsonParse<BaseResponse<PersonResponse>>(response);

    if (!parseResult.success) {
      return {
        success: false,
        code: response.status,
        message: parseResult.error || "Erro ao processar resposta",
        data: undefined,
      };
    }

    if (!parseResult.data) {
      return {
        success: false,
        code: response.status,
        message: "Dados não encontrados na resposta",
        data: undefined,
      };
    }

    const data = parseResult.data;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao completar cadastro (${response.status})`,
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
          : "Erro ao completar cadastro",
      data: undefined,
    };
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

    // Parse the response (works for both success and error cases)
    const parseResult =
      await safeJsonParse<BaseResponse<PersonResponse>>(response);

    // 404 means person not found - this is expected for new users
    if (response.status === 404) {
      if (parseResult.success && parseResult.data) {
        return {
          success: false,
          code: response.status,
          message: parseResult.data.message || "Person not found. Please complete your registration.",
          data: undefined,
        };
      }
      // If parsing failed, return default message
      return {
        success: false,
        code: response.status,
        message: parseResult.error || "Person not found. Please complete your registration.",
        data: undefined,
      };
    }

    if (!parseResult.success) {
      return {
        success: false,
        code: response.status,
        message: parseResult.error || "Erro ao processar resposta",
        data: undefined,
      };
    }

    if (!parseResult.data) {
      return {
        success: false,
        code: response.status,
        message: "Dados não encontrados na resposta",
        data: undefined,
      };
    }

    const data = parseResult.data;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data?.message ||
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

export type MemberResponse = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
};

// Backend response format (PersonResponseDTO from API - camelCase due to JsonNamingPolicy)
type BackendPersonResponseDTO = {
  id: string;
  name: string;
  email: string;
  username?: string;
  birthDate?: string | null;
  phone?: string | null;
  weightKg?: number | null;
  heightCm?: number | null;
  createdAt?: string;
  updatedAt?: string;
  supabaseUserId?: string | null;
};

// Backend response format (with uppercase fields - from direct DB query - fallback)
type BackendMemberResponse = {
  Id?: string;
  Name?: string;
  Email?: string;
  id?: string;
  name?: string;
  email?: string;
  BirthDate?: string | null;
  Phone?: string | null;
  WeightKg?: number | null;
  HeightCm?: number | null;
  CreatedAt?: string | null;
  SupabaseUserId?: string | null;
  UpdatedAt?: string | null;
  Username?: string | null;
  Member?: boolean | null;
  SupabaseUserSponsorId?: string | null;
};

// Convert backend format to frontend format
function mapBackendMemberToFrontend(
  backend: BackendPersonResponseDTO | BackendMemberResponse
): MemberResponse {
  // Handle both camelCase (from API) and PascalCase (fallback)
  const backendAny = backend as BackendPersonResponseDTO &
    BackendMemberResponse;
  const id = backendAny.id || backendAny.Id;
  const name = backendAny.name || backendAny.Name;
  const email = backendAny.email || backendAny.Email;
  const phoneNumber = backendAny.phone || backendAny.Phone;

  return {
    id: id?.toString() || "",
    name: name || "",
    email: email || "",
    phoneNumber: phoneNumber || "",
  };
}

// Parse members array from backend response
async function parseMembersResponse(
  response: Response
): Promise<BaseResponse<MemberResponse[]>> {
  try {
    const text = await response.text();
    if (!text || text.trim() === "") {
      return {
        success: true,
        code: response.status,
        message: undefined,
        data: [],
      };
    }

    const parsed = JSON.parse(text);

    // Check if it's BaseResponse format with data array (most common)
    if (parsed && typeof parsed === "object") {
      // BaseResponse format: { success: true, message: "...", data: [...] }
      if (parsed.data && Array.isArray(parsed.data)) {
        const members = parsed.data.map(
          (item: BackendPersonResponseDTO | BackendMemberResponse) =>
            mapBackendMemberToFrontend(item)
        );
        return {
          success: parsed.success ?? true,
          code: response.status,
          message: parsed.message,
          data: members,
        };
      }

      // Direct array response
      if (Array.isArray(parsed)) {
        const members = parsed.map(
          (item: BackendPersonResponseDTO | BackendMemberResponse) =>
            mapBackendMemberToFrontend(item)
        );
        return {
          success: true,
          code: response.status,
          message: undefined,
          data: members,
        };
      }

      // Single object with Id field
      if (parsed.Id) {
        return {
          success: true,
          code: response.status,
          message: undefined,
          data: [
            mapBackendMemberToFrontend(
              parsed as BackendPersonResponseDTO | BackendMemberResponse
            ),
          ],
        };
      }
    }

    return {
      success: false,
      code: response.status,
      message: `Formato de resposta inesperado do servidor. Resposta: ${text.substring(0, 200)}`,
      data: undefined,
    };
  } catch (parseError) {
    return {
      success: false,
      code: response.status,
      message: `Erro ao processar resposta: ${parseError instanceof Error ? parseError.message : "Resposta inválida"}`,
      data: undefined,
    };
  }
}

export type RegisterMemberRequest = {
  email: string;
  name: string;
  userName: string;
  phone: string;
  birthDate?: Date | null;
  weightKg?: number | null;
  heightCm?: number | null;
  supabaseUserId?: string | null;
};

export async function getMembersByOwner(
  token: string
): Promise<BaseResponse<MemberResponse[]>> {
  try {
    // O backend já busca o ownerId do usuário autenticado
    const response = await fetch(`${API_BASE_URL}/Person/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        code: response.status,
        message: `Erro ao buscar membros (${response.status}): ${errorText.substring(0, 100)}`,
        data: undefined,
      };
    }

    return await parseMembersResponse(response);
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar membros",
      data: undefined,
    };
  }
}

/**
 * Carrega todos os membros com dados completos
 */
export async function loadAllMembersWithFullData(
  token: string
): Promise<BaseResponse<PersonResponse[]>> {
  try {
    // Primeiro, busca a lista de membros
    const membersResponse = await getMembersByOwner(token);
    if (!membersResponse.success || !membersResponse.data) {
      return {
        success: false,
        code: membersResponse.code || 0,
        message: membersResponse.message || "Erro ao buscar membros",
        data: undefined,
      };
    }

    // Para cada membro, busca os dados completos
    const membersWithFullData: PersonResponse[] = [];
    for (const member of membersResponse.data) {
      const fullDataResponse = await getMemberById(member.id, token);
      if (fullDataResponse.success && fullDataResponse.data) {
        membersWithFullData.push(fullDataResponse.data);
      }
    }

    return {
      success: true,
      code: 200,
      message: undefined,
      data: membersWithFullData,
    };
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados completos dos membros",
      data: undefined,
    };
  }
}

export async function getMemberById(
  id: string,
  token: string
): Promise<BaseResponse<PersonResponse>> {
  if (!id) {
    throw new Error("ID do membro não encontrado");
  }
  try {
    const response = await fetch(`${API_BASE_URL}/Person/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const parseResult =
      await safeJsonParse<BaseResponse<PersonResponse>>(response);

    if (!parseResult.success) {
      return {
        success: false,
        code: response.status,
        message:
          response.status === 404
            ? "Membro não encontrado"
            : parseResult.error || "Erro ao processar resposta",
        data: undefined,
      };
    }

    if (!parseResult.data) {
      return {
        success: false,
        code: response.status,
        message:
          response.status === 404
            ? "Membro não encontrado"
            : "Dados não encontrados na resposta",
        data: undefined,
      };
    }

    const data = parseResult.data;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message ||
          (response.status === 404
            ? "Membro não encontrado"
            : `Erro ao buscar membro (${response.status})`),
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao buscar membro",
      data: undefined,
    };
  }
}

export type UpdatePersonRequest = {
  name?: string;
  phone?: string;
  email?: string;
  weightKg?: number;
  heightCm?: number;
};

export async function updatePerson(
  personId: string,
  request: UpdatePersonRequest,
  token: string
): Promise<BaseResponse<PersonResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Person/${personId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const parseResult =
      await safeJsonParse<BaseResponse<PersonResponse>>(response);

    if (!parseResult.success) {
      return {
        success: false,
        code: response.status,
        message: parseResult.error || "Erro ao processar resposta",
        data: undefined,
      };
    }

    if (!parseResult.data) {
      return {
        success: false,
        code: response.status,
        message: "Dados não encontrados na resposta",
        data: undefined,
      };
    }

    const data = parseResult.data;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao atualizar informações (${response.status})`,
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
          : "Erro ao atualizar informações",
      data: undefined,
    };
  }
}

export async function registerMember(
  request: RegisterMemberRequest,
  token: string
): Promise<BaseResponse<MemberResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Person`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: request.email,
        name: request.name,
        userName: request.userName,
        phone: request.phone,
        birthDate: request.birthDate,
        weightKg: request.weightKg,
        heightCm: request.heightCm,
        isMember: true,
        supabaseUserId: request.supabaseUserId,
      }),
    });

    const parseResult =
      await safeJsonParse<BaseResponse<MemberResponse>>(response);

    if (!parseResult.success) {
      return {
        success: false,
        code: response.status,
        message: parseResult.error || "Erro ao processar resposta",
        data: undefined,
      };
    }

    if (!parseResult.data) {
      return {
        success: false,
        code: response.status,
        message: "Dados não encontrados na resposta",
        data: undefined,
      };
    }

    const data = parseResult.data;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message: data.message || `Erro ao criar membro (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao criar membro",
      data: undefined,
    };
  }
}
