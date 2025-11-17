import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse, PagedResult } from "@/services/@types/baseResponse";
import type {
  CreateMedicineRequest,
  MedicineDtoResponse,
  UpdateMedicineRequest,
} from "@/services/@types/medicine";

export async function getAllMedicines(
  token: string,
  page: number,
  pageSize: number
): Promise<BaseResponse<PagedResult<MedicineDtoResponse>>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Medicine?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = (await response.json()) as BaseResponse<
      PagedResult<MedicineDtoResponse>
    >;

    // Check if backend returned an error (even if HTTP status is 200)
    const hasError = !data.success;
    const httpError = !response.ok;
    if (hasError || httpError) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao buscar medicações (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar medicações",
      data: undefined,
    };
  }
}

export async function getMedicineById(
  id: string,
  token: string
): Promise<BaseResponse<MedicineDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Medicine/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as BaseResponse<MedicineDtoResponse>;

    const hasError = !data.success;
    const httpError = !response.ok;
    if (hasError || httpError) {
      const errorMessage =
        response.status === 404
          ? "Medicação não encontrada"
          : `Erro ao buscar medicação (${response.status})`;
      return {
        success: false,
        code: response.status,
        message: data.message || errorMessage,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar medicação",
      data: undefined,
    };
  }
}

export async function createMedicine(
  request: CreateMedicineRequest,
  token: string
): Promise<BaseResponse<MedicineDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Medicine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = (await response.json()) as BaseResponse<MedicineDtoResponse>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message: data.message || `Erro ao criar medicação (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao criar medicação",
      data: undefined,
    };
  }
}

export async function updateMedicine(
  id: string,
  request: UpdateMedicineRequest,
  token: string
): Promise<BaseResponse<MedicineDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Medicine/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = (await response.json()) as BaseResponse<MedicineDtoResponse>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao atualizar medicação (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar medicação",
      data: undefined,
    };
  }
}
