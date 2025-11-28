import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse } from "@/services/@types/baseResponse";

// GUID regex pattern (defined at module level for performance)
const GUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface MarkDoseTakenRequest {
  takenAt: string; // ISO string
}

export interface MarkDoseSkippedRequest {
  reason?: string | null;
}

export interface SnoozeDoseRequest {
  delayInMinutes: number;
}

export async function markDoseTaken(
  doseId: string,
  request: MarkDoseTakenRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<boolean>> {
  try {
    const memberIdParam = memberId ? `?memberId=${encodeURIComponent(memberId)}` : "";
    const response = await fetch(
      `${API_BASE_URL}/MedicineAdherence/${doseId}/taken${memberIdParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    // Get response text first
    const responseText = await response.text();

    // Try to parse as JSON
    let data: BaseResponse<boolean>;
    try {
      if (!responseText || responseText.trim() === "") {
        // Empty response but status is OK
        if (response.ok) {
          return {
            success: true,
            code: response.status,
            message: undefined,
            data: true,
          };
        }
        return {
          success: false,
          code: response.status,
          message: `Erro ao marcar dose como tomada (${response.status})`,
          data: undefined,
        };
      }
      data = JSON.parse(responseText) as BaseResponse<boolean>;
    } catch {
      // Response is not JSON
      return {
        success: false,
        code: response.status,
        message: `Resposta inválida do servidor: ${responseText.substring(0, 100)}`,
        data: undefined,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message ||
          `Erro ao marcar dose como tomada (${response.status})`,
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
          : "Erro ao marcar dose como tomada",
      data: undefined,
    };
  }
}

export async function markDoseSkipped(
  doseId: string,
  request: MarkDoseSkippedRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<boolean>> {
  try {
    const memberIdParam = memberId ? `?memberId=${encodeURIComponent(memberId)}` : "";
    const response = await fetch(
      `${API_BASE_URL}/MedicineAdherence/${doseId}/skip${memberIdParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    const data = (await response.json()) as BaseResponse<boolean>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message: data.message || `Erro ao pular dose (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao pular dose",
      data: undefined,
    };
  }
}

export async function snoozeDose(
  doseId: string,
  request: SnoozeDoseRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<boolean>> {
  try {
    const memberIdParam = memberId ? `?memberId=${encodeURIComponent(memberId)}` : "";
    const response = await fetch(
      `${API_BASE_URL}/MedicineAdherence/${doseId}/snooze${memberIdParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    const data = (await response.json()) as BaseResponse<boolean>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message: data.message || `Erro ao adiar dose (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao adiar dose",
      data: undefined,
    };
  }
}

export interface DoseOccurrenceDto {
  id: string;
  medicineId: string;
  scheduleId: string;
  medicineName: string;
  dosageValue: number;
  dosageUnit: string;
  scheduledAt: string; // ISO string
  status: string;
  takenAt?: string | null; // ISO string
  snoozedUntil?: string | null; // ISO string
}

export async function getDailyHistory(
  date: Date,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<DoseOccurrenceDto[]>> {
  try {
    // Validate date before formatting
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return {
        success: false,
        code: 400,
        message: "Data inválida fornecida",
        data: undefined,
      };
    }

    // Format date as YYYY-MM-DD (local date, not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const urlParams = new URLSearchParams({
      date: dateStr,
    });

    if (memberId) {
      urlParams.append("memberId", memberId);
    }

    const url = `${API_BASE_URL}/MedicineAdherence/history/daily?${urlParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data: BaseResponse<DoseOccurrenceDto[]>;
    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        return {
          success: false,
          code: response.status,
          message: `Erro ao buscar histórico diário: resposta vazia (${response.status})`,
          data: undefined,
        };
      }
      data = JSON.parse(responseText) as BaseResponse<DoseOccurrenceDto[]>;
    } catch {
      return {
        success: false,
        code: response.status,
        message: `Erro ao processar resposta do servidor (${response.status})`,
        data: undefined,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message ||
          `Erro ao buscar histórico diário (${response.status})`,
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
          : "Erro ao buscar histórico diário",
      data: undefined,
    };
  }
}

export async function getDoseOccurrenceByMedicineScheduleAndDate(
  medicineId: string,
  scheduleId: string,
  date: Date,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<DoseOccurrenceDto | null>> {
  try {
    // Validate date before formatting
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      return {
        success: false,
        code: 400,
        message: "Data inválida fornecida",
        data: undefined,
      };
    }

    // Format date as YYYY-MM-DD (local date, not UTC)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    // Validate GUIDs format
    if (!GUID_REGEX.test(medicineId)) {
      return {
        success: false,
        code: 400,
        message: `medicineId inválido: ${medicineId}`,
        data: undefined,
      };
    }
    if (!GUID_REGEX.test(scheduleId)) {
      return {
        success: false,
        code: 400,
        message: `scheduleId inválido: ${scheduleId}`,
        data: undefined,
      };
    }

    const memberIdParam = memberId ? `&memberId=${encodeURIComponent(memberId)}` : "";
    const url = `${API_BASE_URL}/MedicineAdherence/by-medicine-schedule-date?medicineId=${encodeURIComponent(medicineId)}&scheduleId=${encodeURIComponent(scheduleId)}&date=${encodeURIComponent(dateStr)}${memberIdParam}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data: BaseResponse<DoseOccurrenceDto | null>;
    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === "") {
        return {
          success: false,
          code: response.status,
          message: `Erro ao buscar ocorrência de dose: resposta vazia (${response.status})`,
          data: undefined,
        };
      }
      data = JSON.parse(responseText) as BaseResponse<DoseOccurrenceDto | null>;
    } catch {
      return {
        success: false,
        code: response.status,
        message: `Erro ao processar resposta do servidor (${response.status})`,
        data: undefined,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message:
          data.message ||
          `Erro ao buscar ocorrência de dose (${response.status})`,
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
          : "Erro ao buscar ocorrência de dose",
      data: undefined,
    };
  }
}
