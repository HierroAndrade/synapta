"use client";

import { motion } from "framer-motion";
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

type Resultado = {
  perfil: "conservador" | "moderado" | "arrojado";
  pontos: number;
  alocacao: { renda_fixa: number; acoes: number; fiis: number; reserva: number };
  alertas: string[];
};

const PERFIL_CONFIG = {
  conservador: {
    label: "Conservador",
    emoji: "🛡️",
    desc: "Você prioriza segurança e estabilidade. Sua carteira será composta majoritariamente de renda fixa.",
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    retorno: "10–14% a.a.",
    volatilidade: "6–10%",
  },
  moderado: {
    label: "Moderado",
    emoji: "⚖️",
    desc: "Você busca equilíbrio entre segurança e crescimento. Uma carteira diversificada é ideal para você.",
    color: "text-primary-400",
    border: "border-primary-500/30",
    bg: "bg-primary-500/10",
    retorno: "15–20% a.a.",
    volatilidade: "12–16%",
  },
  arrojado: {
    label: "Arrojado",
    emoji: "🚀",
    desc: "Você aceita maior risco em busca de retornos expressivos. Maior exposição em renda variável.",
    color: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/10",
    retorno: "22–30% a.a.",
    volatilidade: "18–25%",
  },
};

const ALOCACAO_LABELS: Record<string, string> = {
  renda_fixa: "Renda Fixa",
  acoes: "Ações",
  fiis: "FIIs",
  reserva: "Reserva",
};

const ALOCACAO_COLORS: Record<string, string> = {
  renda_fixa: "bg-blue-500",
  acoes: "bg-primary-500",
  fiis: "bg-emerald-500",
  reserva: "bg-zinc-500",
};

type Props = { resultado: Resultado };

export function Etapa6Resultado({ resultado }: Props) {
  const router = useRouter();
  const config = PERFIL_CONFIG[resultado.perfil];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Badge do perfil */}
      <div className={`flex flex-col items-center text-center px-6 py-6 rounded-2xl border ${config.border} ${config.bg}`}>
        <span className="text-4xl mb-2">{config.emoji}</span>
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Seu perfil de investidor</p>
        <h2 className={`text-2xl font-bold ${config.color} mb-2`}>{config.label}</h2>
        <p className="text-sm text-zinc-400 max-w-xs">{config.desc}</p>

        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="text-xs text-zinc-600 mb-0.5">Retorno esperado</p>
            <p className={`text-sm font-bold ${config.color}`}>{config.retorno}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-600 mb-0.5">Volatilidade est.</p>
            <p className="text-sm font-bold text-zinc-300">{config.volatilidade}</p>
          </div>
        </div>
      </div>

      {/* Barra de alocação */}
      <div>
        <p className="text-sm font-semibold text-zinc-300 mb-3">Alocação sugerida para você</p>
        <div className="flex rounded-full overflow-hidden h-4 mb-3">
          {Object.entries(resultado.alocacao).map(([key, val]) => (
            <motion.div
              key={key}
              initial={{ width: 0 }}
              animate={{ width: `${val}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`${ALOCACAO_COLORS[key]} h-full`}
              title={`${ALOCACAO_LABELS[key]}: ${val}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(resultado.alocacao).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${ALOCACAO_COLORS[key]} shrink-0`} />
              <span className="text-xs text-zinc-400">{ALOCACAO_LABELS[key]}: <strong className="text-zinc-300">{val}%</strong></span>
            </div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      {resultado.alertas.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-zinc-300 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-amber-400" /> Alertas prioritários
          </p>
          {resultado.alertas.map((alerta, i) => (
            <div key={i} className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" />
              {alerta}
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/dashboard")}
        className="w-full py-4 rounded-full font-bold text-sm bg-gradient-to-r from-primary-500 to-amber-400 text-black flex items-center justify-center gap-2 glow-effect cursor-pointer transition-all"
      >
        <Sparkles size={16} />
        Acessar minha plataforma
        <ArrowRight size={16} />
      </motion.button>
    </motion.div>
  );
}
