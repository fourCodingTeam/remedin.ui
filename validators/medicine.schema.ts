import { z } from "zod";
import { DosageUnit, MedicineScheduleType } from "@/services/@types/enums";

export const createMedicineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nome da medicação é obrigatório")
    .max(200, "Nome da medicação deve ter no máximo 200 caracteres"),
  dosageValue: z.coerce
    .number({
      required_error: "Dosagem é obrigatória",
      invalid_type_error: "Dosagem deve ser um número",
    })
    .positive("Dosagem deve ser maior que zero"),
  dosageUnit: z.nativeEnum(DosageUnit, {
    required_error: "Unidade de dosagem é obrigatória",
    invalid_type_error: "Unidade de dosagem inválida",
  }),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
    invalid_type_error: "Data de início inválida",
  }),
  endDate: z.date().nullable().optional(),
  observations: z
    .string()
    .trim()
    .max(1000, "Observações devem ter no máximo 1000 caracteres")
    .nullable()
    .optional(),
});

export const updateMedicineSchema = createMedicineSchema.extend({
  id: z.string().uuid("ID inválido"),
});

export const createScheduleSchema = z
  .object({
    medicineId: z.string().uuid("ID da medicação inválido"),
    scheduleType: z.nativeEnum(MedicineScheduleType, {
      required_error: "Tipo de agendamento é obrigatório",
      invalid_type_error: "Tipo de agendamento inválido",
    }),
    // OncePerDay e SpecificWeekDays
    timeOfDay: z.string().nullable().optional(),
    // MultipleFixedTimesPerDay
    timesOfDay: z.array(z.string()).nullable().optional(),
    // EveryXHours
    intervalInHours: z.number().int().positive().nullable().optional(),
    firstDoseAt: z.string().nullable().optional(), // ISO 8601
    // SpecificWeekDays
    weekDays: z.array(z.number().int().min(1).max(7)).nullable().optional(), // 1=Monday ... 7=Sunday
    preAlarmMinutes: z.coerce
      .number()
      .int()
      .min(0, "Minutos de alarme antes não pode ser negativo")
      .nullable()
      .optional(),
    posAlarmMinutes: z.coerce
      .number()
      .int()
      .min(0, "Minutos de alarme depois não pode ser negativo")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // OncePerDay: precisa de timeOfDay
      if (data.scheduleType === MedicineScheduleType.OncePerDay) {
        return !!data.timeOfDay;
      }
      // MultipleFixedTimesPerDay: precisa de timesOfDay com pelo menos 1 horário
      if (data.scheduleType === MedicineScheduleType.MultipleFixedTimesPerDay) {
        return (
          !!data.timesOfDay &&
          data.timesOfDay.length > 0 &&
          data.timesOfDay.every((time) => !!time)
        );
      }
      // EveryXHours: precisa de intervalInHours e firstDoseAt
      if (data.scheduleType === MedicineScheduleType.EveryXHours) {
        return (
          !!data.intervalInHours &&
          data.intervalInHours > 0 &&
          !!data.firstDoseAt
        );
      }
      // SpecificWeekDays: precisa de timeOfDay e weekDays
      if (data.scheduleType === MedicineScheduleType.SpecificWeekDays) {
        return !!data.timeOfDay && !!data.weekDays && data.weekDays.length > 0;
      }
      // AsNeeded: não precisa de nenhum campo de horário
      return true;
    },
    {
      message:
        "Campos obrigatórios não preenchidos para o tipo de agendamento selecionado",
    }
  );

export const updateScheduleSchema = z
  .object({
    id: z.string().uuid("ID inválido"),
    medicineId: z.string().uuid("ID da medicação inválido"),
    scheduleType: z.nativeEnum(MedicineScheduleType, {
      required_error: "Tipo de agendamento é obrigatório",
      invalid_type_error: "Tipo de agendamento inválido",
    }),
    timeOfDay: z.string().nullable().optional(),
    timesOfDay: z.array(z.string()).nullable().optional(),
    intervalInHours: z.number().int().positive().nullable().optional(),
    firstDoseAt: z.string().nullable().optional(),
    weekDays: z.array(z.number().int().min(1).max(7)).nullable().optional(),
    preAlarmMinutes: z.coerce.number().int().min(0).nullable().optional(),
    posAlarmMinutes: z.coerce.number().int().min(0).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.scheduleType === MedicineScheduleType.OncePerDay) {
        return !!data.timeOfDay;
      }
      if (data.scheduleType === MedicineScheduleType.MultipleFixedTimesPerDay) {
        return (
          !!data.timesOfDay &&
          data.timesOfDay.length > 0 &&
          data.timesOfDay.every((time) => !!time)
        );
      }
      if (data.scheduleType === MedicineScheduleType.EveryXHours) {
        return (
          !!data.intervalInHours &&
          data.intervalInHours > 0 &&
          !!data.firstDoseAt
        );
      }
      if (data.scheduleType === MedicineScheduleType.SpecificWeekDays) {
        return !!data.timeOfDay && !!data.weekDays && data.weekDays.length > 0;
      }
      return true;
    },
    {
      message:
        "Campos obrigatórios não preenchidos para o tipo de agendamento selecionado",
    }
  );

// Schema simplificado para compatibilidade com formulário atual
// Mapeia para o novo formato
export const medicineWithScheduleSchema = createMedicineSchema
  .extend({
    scheduleType: z.nativeEnum(MedicineScheduleType, {
      required_error: "Tipo de agendamento é obrigatório",
    }),
    timeOfDay: z.string().nullable().optional(),
    timesOfDay: z.array(z.string()).nullable().optional(),
    intervalInHours: z.number().int().positive().nullable().optional(),
    firstDoseAt: z.string().nullable().optional(),
    weekDays: z.array(z.number().int().min(1).max(7)).nullable().optional(),
    preAlarmMinutes: z.coerce.number().int().min(0).nullable().optional(),
    posAlarmMinutes: z.coerce.number().int().min(0).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.scheduleType === MedicineScheduleType.SpecificWeekDays) {
        return (
          data.weekDays !== null &&
          data.weekDays !== undefined &&
          data.weekDays.length > 0
        );
      }
      return true;
    },
    {
      message: "Selecione pelo menos um dia da semana para frequência semanal",
      path: ["weekDays"],
    }
  );

export const medicineWithScheduleUpdateSchema = updateMedicineSchema
  .extend({
    scheduleType: z
      .nativeEnum(MedicineScheduleType)
      .default(MedicineScheduleType.OncePerDay),
    timeOfDay: z.string().nullable().optional(),
    timesOfDay: z.array(z.string()).nullable().optional(),
    intervalInHours: z.number().int().positive().nullable().optional(),
    firstDoseAt: z.string().nullable().optional(),
    weekDays: z.array(z.number().int().min(1).max(7)).nullable().optional(),
    preAlarmMinutes: z.coerce
      .number()
      .int()
      .min(0)
      .default(15)
      .nullable()
      .optional(),
    posAlarmMinutes: z.coerce
      .number()
      .int()
      .min(0)
      .default(15)
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.scheduleType === MedicineScheduleType.SpecificWeekDays) {
        return (
          data.weekDays !== null &&
          data.weekDays !== undefined &&
          data.weekDays.length > 0
        );
      }
      return true;
    },
    {
      message: "Selecione pelo menos um dia da semana para frequência semanal",
      path: ["weekDays"],
    }
  );

export type CreateMedicineFormData = z.infer<typeof createMedicineSchema>;
export type UpdateMedicineFormData = z.infer<typeof updateMedicineSchema>;
export type CreateScheduleFormData = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleFormData = z.infer<typeof updateScheduleSchema>;
export type MedicineWithScheduleFormData = z.infer<
  typeof medicineWithScheduleSchema
>;
export type MedicineWithScheduleUpdateFormData = z.infer<
  typeof medicineWithScheduleUpdateSchema
>;
