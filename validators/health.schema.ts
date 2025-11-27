import { z } from "zod";

export const bloodPressureSchema = z.object({
  systolicValue: z.coerce
    .number({
      invalid_type_error: "Valor sistólico deve ser um número",
    })
    .positive("Valor sistólico deve ser positivo")
    .max(300, "Valor sistólico muito alto"),
  diastolicValue: z.coerce
    .number({
      invalid_type_error: "Valor diastólico deve ser um número",
    })
    .positive("Valor diastólico deve ser positivo")
    .max(200, "Valor diastólico muito alto"),
  recordedAt: z.date({
    required_error: "Data e horário da medição são obrigatórios",
    invalid_type_error: "Data e horário inválidos",
  }),
  notes: z.string().optional().nullable(),
});

export type BloodPressureFormData = z.infer<typeof bloodPressureSchema>;

export const bloodSugarSchema = z.object({
  value: z.coerce
    .number({
      invalid_type_error: "Valor da glicose deve ser um número",
    })
    .positive("Valor da glicose deve ser positivo")
    .max(1000, "Valor da glicose muito alto"),
  recordedAt: z.date({
    required_error: "Data e horário da medição são obrigatórios",
    invalid_type_error: "Data e horário inválidos",
  }),
  notes: z.string().optional().nullable(),
});

export type BloodSugarFormData = z.infer<typeof bloodSugarSchema>;

export const weightSchema = z.object({
  weightKg: z.coerce
    .number({
      invalid_type_error: "Peso deve ser um número",
    })
    .positive("Peso deve ser positivo")
    .max(500, "Peso muito alto"),
  recordedAt: z.date({
    required_error: "Data e horário da medição são obrigatórios",
    invalid_type_error: "Data e horário inválidos",
  }),
  notes: z.string().optional().nullable(),
});

export type WeightFormData = z.infer<typeof weightSchema>;

export const heightSchema = z.object({
  heightCm: z.coerce
    .number({
      invalid_type_error: "Altura deve ser um número",
    })
    .int("Altura deve ser um número inteiro")
    .positive("Altura deve ser positiva")
    .max(300, "Altura muito alta"),
  recordedAt: z.date({
    required_error: "Data e horário da medição são obrigatórios",
    invalid_type_error: "Data e horário inválidos",
  }),
  notes: z.string().optional().nullable(),
});

export type HeightFormData = z.infer<typeof heightSchema>;

export const symptomsSchema = z.object({
  symptoms: z
    .string()
    .trim()
    .min(1, "Descrição dos sintomas é obrigatória")
    .max(500, "Descrição dos sintomas deve ter no máximo 500 caracteres"),
  recordedAt: z.date({
    required_error: "Data e horário são obrigatórios",
    invalid_type_error: "Data e horário inválidos",
  }),
  severity: z
    .number({
      invalid_type_error: "Severidade deve ser um número",
    })
    .int("Severidade deve ser um número inteiro")
    .min(1, "Severidade deve ser entre 1 e 10")
    .max(10, "Severidade deve ser entre 1 e 10")
    .optional()
    .nullable(),
  notes: z.string().optional().nullable(),
});

export type SymptomsFormData = z.infer<typeof symptomsSchema>;

