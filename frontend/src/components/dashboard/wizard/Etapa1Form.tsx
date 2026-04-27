"use client";

import { useForm, Controller, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { Etapa1Schema, Etapa1Data } from "@/schemas/diagnosticoSchemas";

const OUTRAS_RENDAS = ["Aluguéis", "Dividendos", "Freelas", "Pensão", "Aposentadoria", "Negócio próprio"];
const MAIORES_GASTOS = ["Moradia", "Alimentação", "Transporte", "Saúde", "Educação", "Lazer", "Dívidas", "Outros"];

type Props = { onNext: (data: Etapa1Data) => void };

const formatToBRL = (value: any) => {
  if (value === undefined || value === null || value === "" || isNaN(value)) return "";
  return new Intl.NumberFormat("pt-BR").format(value);
};

const parseBRL = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue === "" ? undefined : Number(cleanValue);
};

function CurrencyInput({ id, label, control, name, error }: { id: string; label: string; control: Control<any>; name: string; error?: any }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">R$</span>
        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <input
              id={id}
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
      {error && <p className="mt-1.5 text-xs text-red-400">{error.message}</p>}
    </div>
  );
}

export function Etapa1Form({ onNext }: Props) {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<Etapa1Data>({
    resolver: zodResolver(Etapa1Schema),
    defaultValues: { outras_rendas: [], maiores_gastos: [] },
  });

  const renda = watch("renda_mensal") || 0;
  const gastos = watch("gastos_mensais") || 0;
  const sobra = renda - gastos;
  const outrasRendas = watch("outras_rendas") || [];
  const maioresGastos = watch("maiores_gastos") || [];

  const toggleItem = (field: "outras_rendas" | "maiores_gastos", value: string) => {
    const arr = field === "outras_rendas" ? outrasRendas : maioresGastos;
    const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    setValue(field, updated);
  };

  const onSubmit = (data: Etapa1Data) => onNext(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrencyInput
          id="renda_mensal"
          label="Renda mensal líquida"
          name="renda_mensal"
          control={control}
          error={errors.renda_mensal}
        />
        <CurrencyInput
          id="gastos_mensais"
          label="Gastos mensais totais"
          name="gastos_mensais"
          control={control}
          error={errors.gastos_mensais}
        />
      </div>

      {/* Sobra mensal em tempo real */}
      {renda > 0 && gastos > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`px-4 py-3 rounded-xl border text-sm font-medium ${
            sobra >= 0
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {sobra >= 0
            ? `✓ Você tem R$ ${sobra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} disponíveis para investir por mês.`
            : `⚠ Seus gastos superam sua renda em R$ ${Math.abs(sobra).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`}
        </motion.div>
      )}

      {/* Outras fontes de renda */}
      <div>
        <p className="text-sm font-medium text-zinc-300 mb-2">Outras fontes de renda <span className="text-zinc-600">(opcional)</span></p>
        <div className="flex flex-wrap gap-2">
          {OUTRAS_RENDAS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem("outras_rendas", item)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                outrasRendas.includes(item)
                  ? "bg-primary-500/20 border-primary-500/40 text-primary-400"
                  : "bg-surface-light border-border text-zinc-500 hover:border-zinc-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Maiores gastos */}
      <div>
        <p className="text-sm font-medium text-zinc-300 mb-2">Maiores categorias de gasto <span className="text-zinc-600">(opcional)</span></p>
        <div className="flex flex-wrap gap-2">
          {MAIORES_GASTOS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => toggleItem("maiores_gastos", item)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                maioresGastos.includes(item)
                  ? "bg-primary-500/20 border-primary-500/40 text-primary-400"
                  : "bg-surface-light border-border text-zinc-500 hover:border-zinc-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 rounded-full font-semibold text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-black flex items-center justify-center gap-2 glow-effect cursor-pointer hover:from-primary-600 hover:to-orange-500 transition-all"
      >
        Continuar <ArrowRight size={16} />
      </button>
    </form>
  );
}
