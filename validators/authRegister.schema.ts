import { z } from "zod";

const specialCharacterRegex = /[^A-Za-z0-9]/;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;
const phoneRegex = /^[0-9]{10,11}$/;

const today = new Date();

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "Email é obrigatório")
      .email("Email inválido"),
    userName: z
      .string()
      .trim()
      .min(3, "Seu apelido deve ter pelo menos 3 caracteres")
      .max(20, "Seu apelido deve ter no máximo 20 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Seu apelido pode conter apenas letras, números e underline"
      ),
    password: z
      .string()
      .trim()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres")
      .regex(uppercaseRegex, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(lowercaseRegex, "Senha deve conter pelo menos uma letra minúscula")
      .regex(numberRegex, "Senha deve conter pelo menos um número")
      .regex(
        specialCharacterRegex,
        "Senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string().trim(),
    name: z
      .string()
      .trim()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(80, "Nome deve ter no máximo 80 caracteres"),
    phone: z
      .string()
      .trim()
      .refine(
        (val) => !val || phoneRegex.test(val),
        "Telefone deve conter apenas números (10 ou 11 dígitos)"
      ),
    birthDate: z
      .date({
        required_error: "Data de nascimento é obrigatória",
        invalid_type_error: "Data de nascimento inválida",
      })
      .refine((date) => date === null || date <= today, {
        message: "Data de nascimento não pode estar no futuro",
        path: ["birthDate"],
      }),
    weightKg: z.coerce
      .number({
        invalid_type_error: "Peso deve ser um número",
      })
      .optional(),
    heightCm: z.coerce
      .number({
        invalid_type_error: "Altura deve ser um número",
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
