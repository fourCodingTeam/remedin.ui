import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse } from "@/services/@types/baseResponse";
import type {
  RegisterBloodPressureRequest,
  RegisterBloodSugarRequest,
  RegisterHeightRequest,
  RegisterSymptomRequest,
  RegisterWeightRequest,
  SymptomRecordDto,
  VitalSignRecordDto,
} from "@/services/@types/health";

export async function registerBloodPressure(
  request: RegisterBloodPressureRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<VitalSignRecordDto>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/blood-pressure${memberIdParam}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao registrar pressão arterial: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<VitalSignRecordDto>;
    try {
      data = JSON.parse(responseText) as BaseResponse<VitalSignRecordDto>;
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
        message: data.message || `Erro ao registrar pressão arterial (${response.status})`,
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
          : "Erro ao registrar pressão arterial",
      data: undefined,
    };
  }
}

export async function registerBloodSugar(
  request: RegisterBloodSugarRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<VitalSignRecordDto>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/blood-sugar${memberIdParam}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao registrar glicose: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<VitalSignRecordDto>;
    try {
      data = JSON.parse(responseText) as BaseResponse<VitalSignRecordDto>;
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
        message: data.message || `Erro ao registrar glicose (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao registrar glicose",
      data: undefined,
    };
  }
}

export async function registerWeight(
  request: RegisterWeightRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<VitalSignRecordDto>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/weight${memberIdParam}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao registrar peso: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<VitalSignRecordDto>;
    try {
      data = JSON.parse(responseText) as BaseResponse<VitalSignRecordDto>;
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
        message: data.message || `Erro ao registrar peso (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao registrar peso",
      data: undefined,
    };
  }
}

export async function registerHeight(
  request: RegisterHeightRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<VitalSignRecordDto>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/height${memberIdParam}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao registrar altura: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<VitalSignRecordDto>;
    try {
      data = JSON.parse(responseText) as BaseResponse<VitalSignRecordDto>;
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
        message: data.message || `Erro ao registrar altura (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao registrar altura",
      data: undefined,
    };
  }
}

export async function registerSymptom(
  request: RegisterSymptomRequest,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<SymptomRecordDto>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/symptoms${memberIdParam}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao registrar sintomas: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<SymptomRecordDto>;
    try {
      data = JSON.parse(responseText) as BaseResponse<SymptomRecordDto>;
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
        message: data.message || `Erro ao registrar sintomas (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao registrar sintomas",
      data: undefined,
    };
  }
}

export async function getVitalSigns(
  token: string,
  memberId?: string | null
): Promise<BaseResponse<VitalSignRecordDto[]>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/vital-signs${memberIdParam}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao buscar sinais vitais: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<VitalSignRecordDto[]>;
    try {
      data = JSON.parse(responseText) as BaseResponse<VitalSignRecordDto[]>;
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
        message: data.message || `Erro ao buscar sinais vitais (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar sinais vitais",
      data: undefined,
    };
  }
}

export async function getLatestVitalSign(
  type: number,
  token: string,
  memberId?: string | null
): Promise<BaseResponse<VitalSignRecordDto | null>> {
  try {
    const memberIdParam = memberId
      ? `&memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/vital-signs/latest?type=${type}${memberIdParam}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao buscar sinal vital: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<VitalSignRecordDto | null>;
    try {
      data = JSON.parse(responseText) as BaseResponse<VitalSignRecordDto | null>;
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
        message: data.message || `Erro ao buscar sinal vital (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message:
        error instanceof Error ? error.message : "Erro ao buscar sinal vital",
      data: undefined,
    };
  }
}

export async function getSymptoms(
  token: string,
  memberId?: string | null
): Promise<BaseResponse<SymptomRecordDto[]>> {
  try {
    const memberIdParam = memberId
      ? `?memberId=${encodeURIComponent(memberId)}`
      : "";
    const url = `${API_BASE_URL}/Health/symptoms${memberIdParam}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    if (!responseText || responseText.trim() === "") {
      return {
        success: false,
        code: response.status,
        message: `Erro ao buscar sintomas: resposta vazia (${response.status})`,
        data: undefined,
      };
    }

    let data: BaseResponse<SymptomRecordDto[]>;
    try {
      data = JSON.parse(responseText) as BaseResponse<SymptomRecordDto[]>;
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
        message: data.message || `Erro ao buscar sintomas (${response.status})`,
        data: undefined,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      code: 0,
      message: error instanceof Error ? error.message : "Erro ao buscar sintomas",
      data: undefined,
    };
  }
}

