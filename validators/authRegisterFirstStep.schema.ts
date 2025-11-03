import { z } from "zod";

export const registerFirstStepSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email é obrigatório")
});

export type RegisterFirstStepFormData = z.infer<typeof registerFirstStepSchema>;
