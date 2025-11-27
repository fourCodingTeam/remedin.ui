import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse } from "@/services/@types/baseResponse";
import type {
  GenerateReportRequest,
  ReportDtoResponse,
} from "@/services/@types/report";

export async function generateReport(
  request: GenerateReportRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<ReportDtoResponse>> {
  try {
    const memberIdParam = memberId ? `?memberId=${memberId}` : "";
    const response = await fetch(
      `${API_BASE_URL}/Report/generate${memberIdParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(request),
      }
    );

    const data = (await response.json()) as BaseResponse<ReportDtoResponse>;

    if (!response.ok) {
      return {
        success: false,
        code: response.status,
        message: data.message || `Erro ao gerar relatório (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao gerar relatório",
      data: undefined,
    };
  }
}
