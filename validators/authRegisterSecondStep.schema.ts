import { z } from "zod";

export const registerSecondStepSchema = z.object({
  username: z
    .string()
    .min(3, "Usuário deve ter pelo menos 3 caracteres")
    .max(20, "Usuário deve ter no máximo 20 caracteres")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Usuário pode conter apenas letras, números e underline"
    ),
});

export type RegisterSecondStepFormData = z.infer<
  typeof registerSecondStepSchema
>;
