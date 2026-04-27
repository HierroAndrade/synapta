import { z } from "zod";

// ── Etapa 1: Renda & Gastos ──────────────────────────────────────────────────
export const Etapa1Schema = z.object({
  renda_mensal: z
    .number({ invalid_type_error: "Informe sua renda mensal." })
    .positive("A renda deve ser maior que zero."),
  gastos_mensais: z
    .number({ invalid_type_error: "Informe seus gastos mensais." })
    .positive("Os gastos devem ser maior que zero."),
  outras_rendas: z.array(z.string()).optional().default([]),
  maiores_gastos: z.array(z.string()).optional().default([]),
});

// ── Etapa 2: Patrimônio & Dívidas ────────────────────────────────────────────
export const Etapa2Schema = z.object({
  patrimonio_total: z
    .number({ invalid_type_error: "Informe seu patrimônio atual." })
    .min(0, "O patrimônio não pode ser negativo."),
  tipos_ativos: z.array(z.string()).optional().default([]),
  tem_dividas: z.boolean().default(false),
  total_dividas: z.number().min(0).optional(),
  taxa_juros_dividas: z.number().min(0).optional(),
  prazo_dividas: z.number().min(0).optional(),
});

// ── Etapa 3: Objetivos ────────────────────────────────────────────────────────
export const Etapa3Schema = z.object({
  objetivos: z
    .array(z.string())
    .min(1, "Selecione ao menos um objetivo."),
  objetivo_principal: z.string().min(1, "Selecione seu objetivo principal."),
  horizonte_anos: z
    .number()
    .min(1, "Mínimo 1 ano.")
    .max(30, "Máximo 30 anos."),
});

// ── Etapa 4: Perfil de Risco ──────────────────────────────────────────────────
export const Etapa4Schema = z.object({
  reacao_queda: z.string().min(1, "Selecione sua reação a quedas."),
  experiencia_rv: z.string().min(1, "Selecione seu nível de experiência."),
  percentual_risco: z.string().min(1, "Selecione o percentual aceitável em risco."),
});

// ── Etapa 5: Proteção & Reserva ───────────────────────────────────────────────
export const Etapa5Schema = z.object({
  tem_seguro_vida: z.boolean().default(false),
  tem_plano_saude: z.boolean().default(false),
  familia_depende: z.boolean().default(false),
  meses_sem_renda: z
    .number({ invalid_type_error: "Informe quantos meses conseguiria viver." })
    .min(0),
  valor_reserva: z
    .number({ invalid_type_error: "Informe o valor total da sua reserva." })
    .min(0),
  meses_reserva: z.number().min(0),
});

// ── Schema completo (enviado ao backend) ──────────────────────────────────────
export const DiagnosticoCompletoSchema = Etapa1Schema
  .merge(Etapa2Schema)
  .merge(Etapa3Schema)
  .merge(Etapa4Schema)
  .merge(Etapa5Schema);

export type Etapa1Data = z.infer<typeof Etapa1Schema>;
export type Etapa2Data = z.infer<typeof Etapa2Schema>;
export type Etapa3Data = z.infer<typeof Etapa3Schema>;
export type Etapa4Data = z.infer<typeof Etapa4Schema>;
export type Etapa5Data = z.infer<typeof Etapa5Schema>;
export type DiagnosticoCompleto = z.infer<typeof DiagnosticoCompletoSchema>;
