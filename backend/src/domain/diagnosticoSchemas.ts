import { z } from "zod";

// ── Schema completo de validação do payload ──────────────────────────────────
export const DiagnosticoSchema = z.object({
  // Etapa 1
  renda_mensal: z.number().positive(),
  gastos_mensais: z.number().positive(),
  outras_rendas: z.array(z.string()).optional().default([]),
  maiores_gastos: z.array(z.string()).optional().default([]),

  // Etapa 2
  patrimonio_total: z.number().min(0),
  tipos_ativos: z.array(z.string()).optional().default([]),
  tem_dividas: z.boolean().default(false),
  total_dividas: z.number().min(0).optional(),
  taxa_juros_dividas: z.number().min(0).optional(),
  prazo_dividas: z.number().min(0).optional(),

  // Etapa 3
  objetivos: z.array(z.string()).min(1),
  objetivo_principal: z.string().min(1),
  horizonte_anos: z.number().min(1).max(30),

  // Etapa 4
  reacao_queda: z.enum(["vender_tudo", "espera_preocupado", "mantenho_tranquilo", "compra_mais"]),
  experiencia_rv: z.enum(["nunca", "pouca", "media", "experiente"]),
  percentual_risco: z.enum(["ate_10", "ate_30", "ate_60", "mais_60"]),

  // Etapa 5
  tem_seguro_vida: z.boolean().default(false),
  tem_plano_saude: z.boolean().default(false),
  familia_depende: z.boolean().default(false),
  meses_sem_renda: z.number().min(0),
  valor_reserva: z.number().min(0),
  meses_reserva: z.number().min(0),
});

export type DiagnosticoInput = z.infer<typeof DiagnosticoSchema>;
