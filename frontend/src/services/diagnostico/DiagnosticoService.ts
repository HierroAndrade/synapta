import { DiagnosticoCompleto } from "@/schemas/diagnosticoSchemas";

/**
 * DiagnosticoService (Camada 2 - Serviço)
 * Ponte entre o Wizard do frontend e a API do Backend.
 * NÃO conhece o Supabase. NÃO calcula o perfil. Só transporta dados.
 */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

export const DiagnosticoService = {
  /**
   * Envia todos os dados das 5 etapas para o backend calcular o perfil
   * e persistir no banco de dados.
   */
  async salvar(dados: DiagnosticoCompleto) {
    const response = await fetch(`${BACKEND_URL}/api/user/diagnostico`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || "Não foi possível salvar seu diagnóstico. Tente novamente."
      );
    }

    // Retorna o perfil calculado pelo backend (conservador, moderado, arrojado)
    return result as {
      perfil: "conservador" | "moderado" | "arrojado";
      pontos: number;
      alocacao: {
        renda_fixa: number;
        acoes: number;
        fiis: number;
        reserva: number;
      };
      alertas: string[];
    };
  },
};
