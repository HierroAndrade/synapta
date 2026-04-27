"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Etapa3Schema, Etapa3Data } from "@/schemas/diagnosticoSchemas";

const OBJETIVOS = [
  { id: "reserva_emergencia", label: "Reserva de Emergência", emoji: "🛡️" },
  { id: "aposentadoria", label: "Aposentadoria", emoji: "🌅" },
  { id: "renda_passiva", label: "Renda Passiva", emoji: "💰" },
  { id: "crescer_patrimonio", label: "Crescer Patrimônio", emoji: "📈" },
  { id: "comprar_imovel", label: "Comprar Imóvel", emoji: "🏠" },
  { id: "educacao", label: "Educação", emoji: "🎓" },
  { id: "viagem", label: "Viagem", emoji: "✈️" },
  { id: "negocio_proprio", label: "Negócio Próprio", emoji: "🚀" },
];

type Props = { onNext: (data: Etapa3Data) => void; onBack: () => void };

export function Etapa3Form({ onNext, onBack }: Props) {
  const { handleSubmit, watch, setValue, formState: { errors } } = useForm<Etapa3Data>({
    resolver: zodResolver(Etapa3Schema),
    defaultValues: { objetivos: [], objetivo_principal: "", horizonte_anos: 5 },
  });

  const objetivos = watch("objetivos") || [];
  const objetivoPrincipal = watch("objetivo_principal");
  const horizonte = watch("horizonte_anos") || 5;

  const toggleObjetivo = (id: string) => {
    const updated = objetivos.includes(id)
      ? objetivos.filter((v) => v !== id)
      : [...objetivos, id];
    setValue("objetivos", updated);
    // Se desmarcou o principal, limpa
    if (objetivoPrincipal === id) setValue("objetivo_principal", "");
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Seleção de objetivos */}
      <div>
        <p className="text-sm font-medium text-zinc-300 mb-3">Quais são seus objetivos financeiros?</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {OBJETIVOS.map((obj) => (
            <button
              key={obj.id}
              type="button"
              onClick={() => toggleObjetivo(obj.id)}
              className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-medium transition-all cursor-pointer text-center ${
                objetivos.includes(obj.id)
                  ? "bg-primary-500/15 border-primary-500/40 text-primary-400"
                  : "bg-surface-light border-border text-zinc-400 hover:border-zinc-500"
              }`}
            >
              <span className="text-xl">{obj.emoji}</span>
              <span>{obj.label}</span>
            </button>
          ))}
        </div>
        {errors.objetivos && <p className="mt-1.5 text-xs text-red-400">{errors.objetivos.message}</p>}
      </div>

      {/* Objetivo principal */}
      {objetivos.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium text-zinc-300 mb-2">Qual é o mais importante para você agora?</p>
          <div className="flex flex-wrap gap-2">
            {objetivos.map((id) => {
              const obj = OBJETIVOS.find((o) => o.id === id)!;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setValue("objetivo_principal", id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                    objetivoPrincipal === id
                      ? "bg-primary-500 border-primary-500 text-black font-bold"
                      : "bg-surface-light border-border text-zinc-400 hover:border-zinc-500"
                  }`}
                >
                  {obj.emoji} {obj.label}
                </button>
              );
            })}
          </div>
          {errors.objetivo_principal && <p className="mt-1.5 text-xs text-red-400">{errors.objetivo_principal.message}</p>}
        </motion.div>
      )}

      {/* Horizonte de investimento */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-zinc-300">Horizonte de investimento</p>
          <span className="text-sm font-bold text-primary-400">{horizonte} {horizonte === 1 ? "ano" : "anos"}</span>
        </div>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={horizonte}
          onChange={(e) => setValue("horizonte_anos", Number(e.target.value))}
          className="w-full h-2 bg-surface-light rounded-full appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-zinc-600 mt-1">
          <span>1 ano</span>
          <span>30 anos</span>
        </div>
        {errors.horizonte_anos && <p className="mt-1.5 text-xs text-red-400">{errors.horizonte_anos.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack} className="flex-1 py-3 rounded-full text-sm font-medium border border-border text-zinc-400 hover:border-zinc-500 transition-all cursor-pointer flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Voltar
        </button>
        <button type="submit" className="flex-[2] py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-black flex items-center justify-center gap-2 glow-effect cursor-pointer hover:from-primary-600 hover:to-orange-500 transition-all">
          Continuar <ArrowRight size={16} />
        </button>
      </div>
    </form>
  );
}
