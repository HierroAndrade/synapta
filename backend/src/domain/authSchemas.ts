import { z } from "zod";

// Mesmo formato das exigências do front, mas garantindo que um atacante não burle a API diretamente
export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

export const CadastroSchema = z.object({
  nome: z.string().min(3, "Nome é obrigatório."),
  email: z.string().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "Senha muito curta.")
    .regex(/[a-zA-Z]/, "Falta Letra.")
    .regex(/[0-9]/, "Falta Número."),
});

export const AssinaturaSchema = z.object({
  plan: z.enum(["free", "pro"]).default("free")
});
