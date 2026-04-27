"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react";
import { Etapa2Schema, Etapa2Data } from "@/schemas/diagnosticoSchemas";

const TIPOS_ATIVOS = ["Poupança", "Renda Fixa", "Ações", "Fundos", "Imóveis", "Cripto", "Previdência"];

const formatToBRL = (value: any) => {
  if (value === undefined || value === null || value === "" || isNaN(value)) return "";
  return new Intl.NumberFormat("pt-BR").format(value);
};

const parseBRL = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue === "" ? undefined : Number(cleanValue);
};

type Props = { onNext: (data: Etapa2Data) => void; onBack: () => void };

export function Etapa2Form({ onNext, onBack }: Props) {
  const { register, handleSubmit, watch, setValue, clearErrors, control, formState: { errors } } = useForm<Etapa2Data>({
    resolver: zodResolver(Etapa2Schema),
    defaultValues: { tem_dividas: false, tipos_ativos: [] },
  });

  const temDividas = watch("tem_dividas");
  const tiposAtivos = watch("tipos_ativos") || [];
  const taxaJuros = watch("taxa_juros_dividas") || 0;

  const toggleAtivo = (value: string) => {
    const updated = tiposAtivos.includes(value)
      ? tiposAtivos.filter((v) => v !== value)
      : [...tiposAtivos, value];
    setValue("tipos_ativos", updated);
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Patrimônio */}
      <div>
        <label htmlFor="patrimonio_total" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Total guardado ou investido hoje
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">R$</span>
          <Controller
            name="patrimonio_total"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <input
                id="patrimonio_total"
                ref={ref}
                type="text"
                inputMode="numeric"
                value={formatToBRL(value)}
                onChange={(e) => onChange(parseBRL(e.target.value))}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-light border border-border text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                placeholder="0"
              />
            )}
          />
        </div>
        {errors.patrimonio_total && <p className="mt-1.5 text-xs text-red-400">{errors.patrimonio_total.message}</p>}
      </div>

      {/* Tipos de ativos */}
      <div>
        <p className="text-sm font-medium text-zinc-300 mb-2">Tipos de ativos que você já possui <span className="text-zinc-600">(opcional)</span></p>
        <div className="flex flex-wrap gap-2">
          {TIPOS_ATIVOS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleAtivo(item)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                tiposAtivos.includes(item)
                  ? "bg-primary-500/20 border-primary-500/40 text-primary-400"
                  : "bg-surface-light border-border text-zinc-500 hover:border-zinc-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Dívidas */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-zinc-300">Você possui dívidas ativas?</p>
          <button
            type="button"
            onClick={() => {
              const newValue = !temDividas;
              setValue("tem_dividas", newValue);
              if (!newValue) {
                setValue("total_dividas", undefined);
                setValue("taxa_juros_dividas", undefined);
                setValue("prazo_dividas", undefined);
                clearErrors(["total_dividas", "taxa_juros_dividas", "prazo_dividas"]);
              }
            }}
            className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${temDividas ? "bg-primary-500" : "bg-zinc-700"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${temDividas ? "translate-x-6" : ""}`} />
          </button>
        </div>
      </div>

      {/* Campos de dívida */}
      {temDividas && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-4 overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="total_dividas" className="block text-xs font-medium text-zinc-400 mb-1.5">Valor total das dívidas</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">R$</span>
                <Controller
                  name="total_dividas"
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <input
                      id="total_dividas"
                      ref={ref}
                      type="text"
                      inputMode="numeric"
                      value={formatToBRL(value)}
                      onChange={(e) => onChange(parseBRL(e.target.value))}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-surface-light border border-border text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                      placeholder="0"
                    />
                  )}
                />
              </div>
            </div>
            <div>
              <label htmlFor="taxa_juros_dividas" className="block text-xs font-medium text-zinc-400 mb-1.5">Taxa de juros (% a.a.)</label>
              <input
                id="taxa_juros_dividas"
                type="number"
                min="0"
                step="0.1"
                {...register("taxa_juros_dividas", { setValueAs: (v) => v === "" || isNaN(Number(v)) ? undefined : Number(v) })}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-light border border-border text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                placeholder="0,0"
              />
            </div>
            <div>
              <label htmlFor="prazo_dividas" className="block text-xs font-medium text-zinc-400 mb-1.5">Prazo para quitar (meses)</label>
              <input
                id="prazo_dividas"
                type="number"
                min="0"
                {...register("prazo_dividas", { setValueAs: (v) => v === "" || isNaN(Number(v)) ? undefined : Number(v) })}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-light border border-border text-white text-sm focus:outline-none focus:border-primary-500 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {taxaJuros > 15 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">
                <strong>Atenção:</strong> Juros acima de 15% a.a. são considerados dívidas caras. Isso pode impactar significativamente sua estratégia de investimentos.
              </p>
            </motion.div>
          )}
        </motion.div>
      )}

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
