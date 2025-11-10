import { z } from "zod";

const specialCharacterRegex = /[^A-Za-z0-9]/;
const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const numberRegex = /\d/;

export const registerSchema = z
  .object({
    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),
    username: z
      .string()
      .min(3, "Usuário deve ter pelo menos 3 caracteres")
      .max(20, "Usuário deve ter no máximo 20 caracteres")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Usuário pode conter apenas letras, números e underline"
      ),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(50, "Senha deve ter no máximo 50 caracteres")
      .regex(uppercaseRegex, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(lowercaseRegex, "Senha deve conter pelo menos uma letra minúscula")
      .regex(numberRegex, "Senha deve conter pelo menos um número")
      .regex(
        specialCharacterRegex,
        "Senha deve conter pelo menos um caractere especial"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
