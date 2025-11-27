import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse, PagedResult } from "@/services/@types/baseResponse";
import type {
  CreateMedicineRequest,
  MedicineDtoResponse,
  UpdateMedicineRequest,
} from "@/services/@types/medicine";
import { convertDosageUnitFromBackend } from "@/utils/medicine/dosageUnitConverter";

export async function getAllMedicines(
  token: string,
  page: number,
  pageSize: number,
  memberId?: string | null
): Promise<BaseResponse<PagedResult<MedicineDtoResponse>>> {
  try {
    const memberIdParam = memberId ? `&memberId=${memberId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/Medicine?page=${page}&pageSize=${pageSize}${memberIdParam}`,
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

    // Converter dosageUnit de string para número se necessário
    if (data.data?.items) {
      data.data.items = data.data.items.map((medicine) => ({
        ...medicine,
        dosageUnit: convertDosageUnitFromBackend(medicine.dosageUnit),
      }));
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
  token: string,
  memberId?: string | null
): Promise<BaseResponse<MedicineDtoResponse>> {
  try {
    const memberIdParam = memberId ? `?memberId=${memberId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/Medicine/${id}${memberIdParam}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

    // Converter dosageUnit de string para número se necessário
    if (data.data) {
      data.data = {
        ...data.data,
        dosageUnit: convertDosageUnitFromBackend(data.data.dosageUnit),
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
  token: string,
  memberId?: string | null
): Promise<BaseResponse<MedicineDtoResponse>> {
  try {
    const memberIdParam = memberId ? `?memberId=${memberId}` : "";
    const response = await fetch(`${API_BASE_URL}/Medicine${memberIdParam}`, {
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

    // Converter dosageUnit de string para número se necessário
    if (data.data) {
      data.data = {
        ...data.data,
        dosageUnit: convertDosageUnitFromBackend(data.data.dosageUnit),
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
  token: string,
  memberId?: string | null
): Promise<BaseResponse<MedicineDtoResponse>> {
  try {
    const memberIdParam = memberId ? `?memberId=${memberId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/Medicine/${id}${memberIdParam}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

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

    // Converter dosageUnit de string para número se necessário
    if (data.data) {
      data.data = {
        ...data.data,
        dosageUnit: convertDosageUnitFromBackend(data.data.dosageUnit),
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

export async function softDeleteMedicine(
  id: string,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<boolean>> {
  try {
    const memberIdParam = memberId ? `?memberId=${memberId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/Medicine/${id}${memberIdParam}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = (await response.json()) as BaseResponse<boolean>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao deletar medicação (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao deletar medicação",
      data: undefined,
    };
  }
}
