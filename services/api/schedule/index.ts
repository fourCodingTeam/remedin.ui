import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse, PagedResult } from "@/services/@types/baseResponse";
import type {
  CreateScheduleRequest,
  ScheduleDtoResponse,
  UpdateScheduleRequest,
} from "@/services/@types/schedule";

export async function getAllSchedules(
  token: string,
  page: number,
  pageSize: number
): Promise<BaseResponse<PagedResult<ScheduleDtoResponse>>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/Schedule?page=${page}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = (await response.json()) as BaseResponse<
      PagedResult<ScheduleDtoResponse>
    >;

    // Check if backend returned an error (even if HTTP status is 200)
    const hasError = !data.success;
    const httpError = !response.ok;
    if (hasError || httpError) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao buscar agendamentos (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar agendamentos",
      data: undefined,
    };
  }
}

export async function getScheduleById(
  id: string,
  token: string
): Promise<BaseResponse<ScheduleDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Schedule/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = (await response.json()) as BaseResponse<ScheduleDtoResponse>;

    // If response is not ok, return the error response from backend
    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message ||
          (response.status === 404
            ? "Agendamento não encontrado"
            : `Erro ao buscar agendamento (${response.status})`),
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar agendamento",
      data: undefined,
    };
  }
}

export async function createSchedule(
  request: CreateScheduleRequest,
  token: string
): Promise<BaseResponse<ScheduleDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = (await response.json()) as BaseResponse<ScheduleDtoResponse>;

    // If response is not ok, return the error response from backend
    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao criar agendamento (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao criar agendamento",
      data: undefined,
    };
  }
}

export async function updateSchedule(
  id: string,
  request: UpdateScheduleRequest,
  token: string
): Promise<BaseResponse<ScheduleDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Schedule/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const data = (await response.json()) as BaseResponse<ScheduleDtoResponse>;

    // If response is not ok, return the error response from backend
    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message || `Erro ao atualizar agendamento (${response.status})`,
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
          : "Erro ao atualizar agendamento",
      data: undefined,
    };
  }
}
