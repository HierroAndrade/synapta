"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDiagnostico } from "@/hooks/useDiagnostico";
import { Etapa1Form } from "./wizard/Etapa1Form";
import { Etapa2Form } from "./wizard/Etapa2Form";
import { Etapa3Form } from "./wizard/Etapa3Form";
import { Etapa4Form } from "./wizard/Etapa4Form";
import { Etapa5Form } from "./wizard/Etapa5Form";
import { Etapa6Resultado } from "./wizard/Etapa6Resultado";

const ETAPAS = [
  { num: 1, label: "Renda & Gastos" },
  { num: 2, label: "Patrimônio" },
  { num: 3, label: "Objetivos" },
  { num: 4, label: "Perfil de Risco" },
  { num: 5, label: "Proteção" },
  { num: 6, label: "Resultado" },
];

export function DiagnosticoWizard() {
  const {
    etapaAtual,
    isLoading,
    error,
    resultado,
    avancarEtapa,
    voltarEtapa,
    submeter,
    dados,
  } = useDiagnostico();

  const progressoPercent = ((etapaAtual - 1) / 5) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Cabeçalho */}
      {etapaAtual < 6 && (
        <div className="mb-8">
          {/* Barra de progresso */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
              Etapa {etapaAtual} de 5
            </p>
            <p className="text-xs font-bold text-primary-400">{Math.round(progressoPercent)}% completo</p>
          </div>
          <div className="w-full bg-surface-light rounded-full h-1.5 overflow-hidden border border-border/30">
            <motion.div
              animate={{ width: `${progressoPercent}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-amber-400 rounded-full"
            />
          </div>

          {/* Steps */}
          <div className="flex gap-1 mt-3">
            {ETAPAS.filter((e) => e.num < 6).map((etapa) => (
              <div
                key={etapa.num}
                className={`flex-1 text-center text-[10px] font-medium transition-colors ${
                  etapa.num < etapaAtual
                    ? "text-primary-500"
                    : etapa.num === etapaAtual
                    ? "text-zinc-300"
                    : "text-zinc-700"
                }`}
              >
                {etapa.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Título da Etapa */}
      {etapaAtual < 6 && (
        <motion.div
          key={`title-${etapaAtual}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-xl font-bold text-white">
            {etapaAtual === 1 && "Vamos começar pelo básico 💰"}
            {etapaAtual === 2 && "Onde você está agora? 📊"}
            {etapaAtual === 3 && "Para onde você quer ir? 🎯"}
            {etapaAtual === 4 && "Como você lida com risco? 🧠"}
            {etapaAtual === 5 && "Sua segurança financeira 🛡️"}
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            {etapaAtual === 1 && "Precisamos entender sua renda e gastos para montar sua rota."}
            {etapaAtual === 2 && "Seu ponto de partida define a estratégia ideal."}
            {etapaAtual === 3 && "Seus sonhos são o destino. A Synapta trará a rota."}
            {etapaAtual === 4 && "Sua psicologia com investimentos determina a alocação certa."}
            {etapaAtual === 5 && "A base de qualquer estratégia sólida é a proteção."}
          </p>
        </motion.div>
      )}

      {/* Conteúdo das Etapas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={etapaAtual}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {etapaAtual === 1 && <Etapa1Form onNext={avancarEtapa} />}
          {etapaAtual === 2 && <Etapa2Form onNext={avancarEtapa} onBack={voltarEtapa} />}
          {etapaAtual === 3 && <Etapa3Form onNext={avancarEtapa} onBack={voltarEtapa} />}
          {etapaAtual === 4 && <Etapa4Form onNext={avancarEtapa} onBack={voltarEtapa} />}
          {etapaAtual === 5 && <Etapa5Form onNext={submeter} onBack={voltarEtapa} isLoading={isLoading} gastosMensais={dados.gastos_mensais || 0} />}
          {etapaAtual === 6 && resultado && <Etapa6Resultado resultado={resultado} />}
        </motion.div>
      </AnimatePresence>

      {/* Erro global */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}
