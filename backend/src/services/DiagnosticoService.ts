import { DiagnosticoInput } from "../domain/diagnosticoSchemas";
import { DiagnosticoRepository } from "../repositories/DiagnosticoRepository";

type Perfil = "conservador" | "moderado" | "arrojado";

type ResultadoDiagnostico = {
  perfil: Perfil;
  pontos: number;
  alocacao: { renda_fixa: number; acoes: number; fiis: number; reserva: number };
  alertas: string[];
};

const ALOCACAO: Record<Perfil, ResultadoDiagnostico["alocacao"]> = {
  conservador: { renda_fixa: 60, acoes: 25, fiis: 10, reserva: 5 },
  moderado:    { renda_fixa: 30, acoes: 50, fiis: 15, reserva: 5 },
  arrojado:    { renda_fixa: 10, acoes: 70, fiis: 15, reserva: 5 },
};

const PONTOS_REACAO: Record<string, number> = {
  vender_tudo: 0, espera_preocupado: 1, mantenho_tranquilo: 2, compra_mais: 3,
};
const PONTOS_EXPERIENCIA: Record<string, number> = {
  nunca: 0, pouca: 1, media: 2, experiente: 3,
};
const PONTOS_RISCO: Record<string, number> = {
  ate_10: 0, ate_30: 1, ate_60: 2, mais_60: 3,
};

/**
 * DiagnosticoService (Camada 2 - Use Case)
 * Toda a inteligência de negócio fica aqui, isolada do banco e da HTTP layer.
 */
export class DiagnosticoService {
  private repo: DiagnosticoRepository;

  constructor() {
    this.repo = new DiagnosticoRepository();
  }

  /**
   * Calcula o perfil de risco e persiste os dados.
   * Algoritmo definido em produtos/02-onboarding-diagnostico-financeiro.md
   */
  async processar(userId: string, dados: DiagnosticoInput, token: string): Promise<ResultadoDiagnostico> {
    // 1. Calcular pontos base
    let pontos =
      PONTOS_REACAO[dados.reacao_queda] +
      PONTOS_EXPERIENCIA[dados.experiencia_rv] +
      PONTOS_RISCO[dados.percentual_risco];

    // 2. Bônus por horizonte longo
    if (dados.horizonte_anos >= 15) pontos += 2;
    else if (dados.horizonte_anos >= 8) pontos += 1;

    // 3. Penalidade por dívidas caras
    if (dados.tem_dividas && dados.taxa_juros_dividas && dados.taxa_juros_dividas > 15) {
      pontos -= 2;
    }

    // 4. Penalidade por reserva insuficiente (< 3 meses)
    if (dados.meses_reserva < 3) pontos -= 1;

    // 5. Determinar perfil
    const perfil: Perfil =
      pontos <= 3 ? "conservador" : pontos <= 7 ? "moderado" : "arrojado";

    // 6. Gerar alertas personalizados
    const alertas: string[] = [];
    if (dados.meses_reserva < 6) {
      alertas.push("Sua reserva de emergência está abaixo de 6 meses de gastos. Esse é o primeiro passo antes de investir em renda variável.");
    }
    if (dados.tem_dividas && dados.taxa_juros_dividas && dados.taxa_juros_dividas > 15) {
      alertas.push("Você possui dívidas com juros altos (acima de 15% a.a.). Quitar essas dívidas primeiro pode ter melhor retorno que qualquer investimento.");
    }
    if (dados.familia_depende && !dados.tem_seguro_vida) {
      alertas.push("Sua família depende da sua renda, mas você não tem seguro de vida. Isso é um risco crítico de proteção patrimonial.");
    }
    if (!dados.tem_plano_saude) {
      alertas.push("Não ter plano de saúde pode comprometer sua reserva em uma emergência médica.");
    }

    // 7. Persistir no banco passando o token JWT para passar no RLS
    await this.repo.upsert(userId, dados, perfil, token);
    await this.repo.marcarOnboardingCompleto(userId, perfil, token);

    return {
      perfil,
      pontos,
      alocacao: ALOCACAO[perfil],
      alertas,
    };
  }
}
