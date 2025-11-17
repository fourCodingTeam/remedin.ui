import { z } from "zod";
import { DosageUnit, FrequencyType, WeekDay } from "@/services/@types/enums";

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

export const createScheduleSchema = z.object({
  medicineId: z.string().uuid("ID da medicação inválido"),
  scheduledTime: z.date({
    required_error: "Horário é obrigatório",
    invalid_type_error: "Horário inválido",
  }),
  frequencyType: z.nativeEnum(FrequencyType, {
    required_error: "Tipo de frequência é obrigatório",
    invalid_type_error: "Tipo de frequência inválido",
  }),
  preAlarmMinutes: z.coerce
    .number({
      required_error: "Minutos de alarme antes é obrigatório",
      invalid_type_error: "Minutos de alarme antes deve ser um número",
    })
    .int("Minutos de alarme antes deve ser um número inteiro")
    .min(0, "Minutos de alarme antes não pode ser negativo"),
  posAlarmMinutes: z.coerce
    .number({
      required_error: "Minutos de alarme depois é obrigatório",
      invalid_type_error: "Minutos de alarme depois deve ser um número",
    })
    .int("Minutos de alarme depois deve ser um número inteiro")
    .min(0, "Minutos de alarme depois não pode ser negativo"),
  weekDays: z.array(z.nativeEnum(WeekDay)).nullable().optional(),
});

export const updateScheduleSchema = createScheduleSchema.extend({
  id: z.string().uuid("ID inválido"),
});

export const medicineWithScheduleUpdateSchema = updateMedicineSchema
  .merge(updateScheduleSchema.omit({ medicineId: true }))
  .refine(
    (data) => {
      if (data.frequencyType === FrequencyType.Weekly) {
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

export const medicineWithScheduleSchema = createMedicineSchema
  .merge(createScheduleSchema.omit({ medicineId: true }))
  .refine(
    (data) => {
      if (data.frequencyType === FrequencyType.Weekly) {
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
