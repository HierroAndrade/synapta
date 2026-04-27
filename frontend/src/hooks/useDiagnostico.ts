"use client";

import { useState } from "react";
import { DiagnosticoService } from "@/services/diagnostico/DiagnosticoService";
import {
  Etapa1Data,
  Etapa2Data,
  Etapa3Data,
  Etapa4Data,
  Etapa5Data,
  DiagnosticoCompleto,
} from "@/schemas/diagnosticoSchemas";

type DiagnosticoState = Partial<DiagnosticoCompleto>;

type ResultadoDiagnostico = {
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

/**
 * useDiagnostico (Camada 2 - Hook)
 * Orquestra o estado das 6 etapas do wizard e a submissão ao backend.
 * O componente de tela só chama os métodos deste hook.
 */
export function useDiagnostico() {
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [dados, setDados] = useState<DiagnosticoState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<ResultadoDiagnostico | null>(null);

  const avancarEtapa = (dadosEtapa: Partial<DiagnosticoCompleto>) => {
    setDados((prev) => ({ ...prev, ...dadosEtapa }));
    setEtapaAtual((prev) => Math.min(prev + 1, 6));
  };

  const voltarEtapa = () => {
    setEtapaAtual((prev) => Math.max(prev - 1, 1));
  };

  const submeter = async (dadosEtapa5: Etapa5Data) => {
    setIsLoading(true);
    setError(null);

    const dadosCompletos = { ...dados, ...dadosEtapa5 } as DiagnosticoCompleto;

    try {
      const res = await DiagnosticoService.salvar(dadosCompletos);
      setResultado(res);
      setEtapaAtual(6); // Etapa 6 = Resultado
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    etapaAtual,
    dados,
    resultado,
    isLoading,
    error,
    avancarEtapa,
    voltarEtapa,
    submeter,
  };
}
