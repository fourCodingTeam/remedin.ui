# 📋 Planejamento: Implementação de Serviços de Relatórios

## 🎯 Objetivo

Implementar serviços de relatórios no backend (remedin.api) seguindo a arquitetura existente e integrar com o frontend (remedin.ui.v2).

---

## 📊 Análise da Estrutura Atual

### Backend (remedin.api)

- **Arquitetura**: Clean Architecture (Domain, Application, Infrastructure, Api)
- **Padrão**: Repository Pattern + Service Layer
- **Autenticação**: JWT Bearer (Supabase)
- **Banco de Dados**: PostgreSQL via Entity Framework Core

### Dados Disponíveis

- **Person**: weightKg, heightCm, birthDate, phone, email, name
- **Medicine**: Name, DosageValue, DosageUnit, StartDate, EndDate, Observations
- **Schedule**: ScheduledTime, FrequencyType, PreAlarmMinutes, PosAlarmMinutes
- **ScheduleWeekDay**: Dias da semana para cada schedule

### Frontend (remedin.ui.v2)

- **Modal existente**: `ReportsModal.tsx` com dados mock
- **Tipos de relatórios identificados**:
  1. Relatório de Medicações
  2. Relatório de Informações Vitais
  3. Relatório Completo

---

## 🏗️ Estrutura de Implementação

### Fase 1: Backend - Domain Layer

#### 1.1 Criar Enums (se necessário)

**Arquivo**: `src/Remedin.Domain/Enums/ReportType.cs`

```csharp
public enum ReportType
{
    Medicines = 1,
    VitalSigns = 2,
    Complete = 3
}
```

---

### Fase 2: Backend - Application Layer

#### 2.1 DTOs - Requests

**Arquivo**: `src/Remedin.Application/DTOs/Requests/Report/GenerateReportRequest.cs`

```csharp
public record GenerateReportRequest
{
    public List<ReportType> ReportTypes { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
}
```

#### 2.2 DTOs - Responses

**Arquivo**: `src/Remedin.Application/DTOs/Responses/ReportDtoResponse.cs`

```csharp
public record ReportDtoResponse
{
    public ReportType Type { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly EndDate { get; init; }
    public MedicinesReportData? MedicinesData { get; init; }
    public VitalSignsReportData? VitalSignsData { get; init; }
    public CompleteReportData? CompleteData { get; init; }
}

public record MedicinesReportData
{
    public List<MedicineReportItem> Medicines { get; init; }
    public int TotalMedicines { get; init; }
    public int ActiveMedicines { get; init; }
    public double AdherenceRate { get; init; } // Taxa de adesão
}

public record MedicineReportItem
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public float DosageValue { get; init; }
    public string DosageUnit { get; init; }
    public DateOnly StartDate { get; init; }
    public DateOnly? EndDate { get; init; }
    public string? Observations { get; init; }
    public List<ScheduleReportItem> Schedules { get; init; }
}

public record ScheduleReportItem
{
    public TimeOnly ScheduledTime { get; init; }
    public string FrequencyType { get; init; }
    public List<string> WeekDays { get; init; }
}

public record VitalSignsReportData
{
    public double? WeightKg { get; init; }
    public double? HeightCm { get; init; }
    public string? BloodPressure { get; init; } // Futuro
    public double? BloodSugar { get; init; } // Futuro
    public DateOnly? LastUpdated { get; init; }
}

public record CompleteReportData
{
    public MedicinesReportData Medicines { get; init; }
    public VitalSignsReportData VitalSigns { get; init; }
    public double OverallAdherenceRate { get; init; }
}
```

#### 2.3 Interface do Service

**Arquivo**: `src/Remedin.Application/Interfaces/IReportService.cs`

```csharp
public interface IReportService
{
    Task<BaseResponse<ReportDtoResponse>> GenerateReportAsync(
        Guid personId,
        GenerateReportRequest request);
}
```

#### 2.4 Implementação do Service

**Arquivo**: `src/Remedin.Application/Services/ReportService.cs`

- Dependências: `IMedicineRepository`, `IScheduleRepository`, `IPersonRepository`
- Lógica:
  - Buscar medicações no período
  - Buscar schedules relacionados
  - Calcular taxa de adesão (baseado em schedules vs medicações)
  - Buscar informações vitais da Person
  - Montar DTOs de resposta

---

### Fase 3: Backend - Infrastructure Layer

#### 3.1 Repository Extensions (se necessário)

- Adicionar métodos de consulta específicos para relatórios se necessário
- Exemplo: `GetMedicinesByPeriodAsync(Guid personId, DateOnly start, DateOnly end)`

---

### Fase 4: Backend - API Layer

#### 4.1 Controller

**Arquivo**: `src/Remedin.Api/Controllers/ReportController.cs`

```csharp
[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly IPersonService _personService;

    [HttpPost("generate")]
    public async Task<ActionResult<BaseResponse<ReportDtoResponse>>> GenerateReport(
        [FromBody] GenerateReportRequest request)
    {
        var person = await _personService.GetCurrentPerson();
        if (person?.Data == null)
            return Unauthorized("User is not authenticated.");

        var response = await _reportService.GenerateReportAsync(
            person.Data.Id,
            request);

        return Ok(response);
    }
}
```

#### 4.2 Dependency Injection

**Arquivo**: `src/Remedin.Api/Program.cs`

- Adicionar: `builder.Services.AddScoped<IReportService, ReportService>();`

---

### Fase 5: Frontend - Services

#### 5.1 Types

**Arquivo**: `services/@types/report/index.ts`

```typescript
export type ReportType = "medicines" | "vitalSigns" | "complete";

export type GenerateReportRequest = {
  reportTypes: ReportType[];
  startDate: string; // ISO date string
  endDate: string; // ISO date string
};

export type MedicineReportItem = {
  id: string;
  name: string;
  dosageValue: number;
  dosageUnit: string;
  startDate: string;
  endDate?: string;
  observations?: string;
  schedules: ScheduleReportItem[];
};

export type ScheduleReportItem = {
  scheduledTime: string;
  frequencyType: string;
  weekDays: string[];
};

export type VitalSignsReportData = {
  weightKg?: number;
  heightCm?: number;
  bloodPressure?: string;
  bloodSugar?: number;
  lastUpdated?: string;
};

export type MedicinesReportData = {
  medicines: MedicineReportItem[];
  totalMedicines: number;
  activeMedicines: number;
  adherenceRate: number;
};

export type CompleteReportData = {
  medicines: MedicinesReportData;
  vitalSigns: VitalSignsReportData;
  overallAdherenceRate: number;
};

export type ReportDtoResponse = {
  type: ReportType;
  startDate: string;
  endDate: string;
  medicinesData?: MedicinesReportData;
  vitalSignsData?: VitalSignsReportData;
  completeData?: CompleteReportData;
};
```

#### 5.2 API Service

**Arquivo**: `services/api/report/index.ts`

```typescript
import { API_BASE_URL } from "@/constants/apiConfig";
import type { BaseResponse } from "@/services/@types/baseResponse";
import type {
  GenerateReportRequest,
  ReportDtoResponse,
} from "@/services/@types/report";

export async function generateReport(
  request: GenerateReportRequest,
  token: string
): Promise<BaseResponse<ReportDtoResponse>> {
  try {
    const response = await fetch(`${API_BASE_URL}/Report/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

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
```

---

### Fase 6: Frontend - Integração com Modal

#### 6.1 Atualizar ReportsModal

**Arquivo**: `components/layout/Modals/ReportsModal/ReportsModal.tsx`

- Remover dados mock
- Adicionar seleção de período (DatePicker)
- Integrar com `generateReport` service
- Exibir loading state
- Tratar erros
- Exibir resultados do relatório (ou download/visualização)

#### 6.2 Componente de Visualização de Relatório (opcional)

- Criar componente para exibir dados do relatório formatados
- Opção de exportar para PDF/Excel (futuro)

---

## 📝 Ordem de Implementação

### Backend (remedin.api)

1. ✅ Criar DTOs (Requests e Responses)
2. ✅ Criar Interface IReportService
3. ✅ Implementar ReportService
4. ✅ Criar ReportController
5. ✅ Registrar no DependencyInjection
6. ✅ Testar endpoints

### Frontend (remedin.ui.v2)

1. ✅ Criar types em `services/@types/report`
2. ✅ Criar service em `services/api/report`
3. ✅ Atualizar ReportsModal para usar dados reais
4. ✅ Adicionar seleção de período
5. ✅ Implementar visualização de resultados
6. ✅ Tratamento de erros e loading states

---

## 🔍 Considerações Técnicas

### Taxa de Adesão

- **Cálculo**: (Número de schedules criados / Número de medicações) \* 100
- **Futuro**: Considerar histórico de tomadas registradas

### Informações Vitais

- **Atual**: weightKg e heightCm da Person
- **Futuro**: Criar entidades para histórico de pressão arterial e glicose

### Período de Relatório

- Validar que StartDate <= EndDate
- Validar que período não seja muito longo (ex: máximo 1 ano)
- Considerar timezone do usuário

### Performance

- Usar paginação se necessário
- Considerar cache para relatórios frequentes
- Otimizar queries com Include() para evitar N+1

---

## 🧪 Testes Sugeridos

### Backend

- Testar geração de relatório de medicações
- Testar geração de relatório completo
- Testar validação de período
- Testar autenticação/autorização
- Testar casos de erro (sem dados, período inválido)

### Frontend

- Testar integração com API
- Testar seleção de período
- Testar exibição de dados
- Testar tratamento de erros
- Testar loading states

---

## 📦 Arquivos a Criar/Modificar

### Backend

- ✅ `src/Remedin.Domain/Enums/ReportType.cs` (novo)
- ✅ `src/Remedin.Application/DTOs/Requests/Report/GenerateReportRequest.cs` (novo)
- ✅ `src/Remedin.Application/DTOs/Responses/ReportDtoResponse.cs` (novo)
- ✅ `src/Remedin.Application/Interfaces/IReportService.cs` (novo)
- ✅ `src/Remedin.Application/Services/ReportService.cs` (novo)
- ✅ `src/Remedin.Api/Controllers/ReportController.cs` (novo)
- ✅ `src/Remedin.Api/Program.cs` (modificar - adicionar DI)

### Frontend

- ✅ `services/@types/report/index.ts` (novo)
- ✅ `services/api/report/index.ts` (novo)
- ✅ `components/layout/Modals/ReportsModal/ReportsModal.tsx` (modificar)
- ✅ `components/layout/Modals/ReportsModal/ReportsModal.types.ts` (modificar se necessário)

---

## 🚀 Próximos Passos

1. Revisar e aprovar este planejamento
2. Implementar backend seguindo a ordem acima
3. Implementar frontend seguindo a ordem acima
4. Testar integração completa
5. Documentar endpoints no Swagger
6. Considerar melhorias futuras (exportação PDF, gráficos, etc.)

---

## 📌 Observações

- **Informações Vitais**: Por enquanto, apenas weightKg e heightCm estão disponíveis. Pressão arterial e glicose serão implementadas no futuro.
- **Taxa de Adesão**: Cálculo inicial será simples. Pode ser aprimorado com histórico de tomadas.
- **Exportação**: Não está no escopo inicial, mas pode ser adicionada futuramente.
- **Visualização**: Inicialmente, os dados serão exibidos no modal. Pode evoluir para uma página dedicada.
