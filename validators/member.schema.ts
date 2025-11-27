import { z } from "zod";

const phoneRegex = /^[0-9]{10,11}$/;
const today = new Date();

export const memberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  name: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(80, "Nome deve ter no máximo 80 caracteres"),
  userName: z
    .string()
    .trim()
    .min(3, "Apelido deve ter pelo menos 3 caracteres")
    .max(20, "Apelido deve ter no máximo 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Apelido pode conter apenas letras, números e underline"
    ),
  phone: z
    .string()
    .trim()
    .min(1, "Telefone é obrigatório")
    .refine(
      (val) => phoneRegex.test(val),
      "Telefone deve conter apenas números (10 ou 11 dígitos)"
    ),
  birthDate: z
    .date({
      required_error: "Data de nascimento é obrigatória",
      invalid_type_error: "Data de nascimento inválida",
    })
    .refine((date) => date === null || date <= today, {
      message: "Data de nascimento não pode estar no futuro",
    })
    .optional()
    .nullable(),
  weightKg: z.coerce
    .number({
      invalid_type_error: "Peso deve ser um número",
    })
    .positive("Peso deve ser positivo")
    .optional()
    .nullable(),
  heightCm: z.coerce
    .number({
      invalid_type_error: "Altura deve ser um número",
    })
    .positive("Altura deve ser positiva")
    .optional()
    .nullable(),
});

export type MemberFormData = z.infer<typeof memberSchema>;
