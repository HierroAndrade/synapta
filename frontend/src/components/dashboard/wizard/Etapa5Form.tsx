"use client";
 
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Loader2, Info } from "lucide-react";
import { Etapa5Schema, Etapa5Data } from "@/schemas/diagnosticoSchemas";

const TOGGLES = [
  { campo: "tem_seguro_vida" as const, label: "Você tem seguro de vida?" },
  { campo: "tem_plano_saude" as const, label: "Você tem plano de saúde?" },
  { campo: "familia_depende" as const, label: "Sua família depende da sua renda?" },
];

const formatToBRL = (value: any) => {
  if (value === undefined || value === null || value === "" || isNaN(value)) return "";
  return new Intl.NumberFormat("pt-BR").format(value);
};

const parseBRL = (value: string) => {
  const cleanValue = value.replace(/\D/g, "");
  return cleanValue === "" ? undefined : Number(cleanValue);
};

type Props = {
  onNext: (data: Etapa5Data) => void;
  onBack: () => void;
  isLoading: boolean;
  gastosMensais: number;
};

export function Etapa5Form({ onNext, onBack, isLoading, gastosMensais }: Props) {
  const { handleSubmit, watch, setValue, register, control, formState: { errors } } = useForm<Etapa5Data>({
    resolver: zodResolver(Etapa5Schema),
    defaultValues: {
      tem_seguro_vida: false,
      tem_plano_saude: false,
      familia_depende: false,
      valor_reserva: 0,
      meses_reserva: 0,
    },
  });

  const values = watch();
  const valorReserva = watch("valor_reserva") || 0;

  // Cálculo automático dos meses de reserva
  useEffect(() => {
    if (gastosMensais > 0) {
      const meses = valorReserva / gastosMensais;
      setValue("meses_reserva", Number(meses.toFixed(1)));
    }
  }, [valorReserva, gastosMensais, setValue]);

  const mesesCalculados = watch("meses_reserva");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {/* Toggles */}
      <div className="space-y-4">
        {TOGGLES.map(({ campo, label }) => (
          <div key={campo} className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-light border border-border">
            <p className="text-sm font-medium text-zinc-300">{label}</p>
            <button
              type="button"
              onClick={() => setValue(campo, !values[campo])}
              className={`relative w-12 h-6 rounded-full transition-all cursor-pointer shrink-0 ${values[campo] ? "bg-primary-500" : "bg-zinc-700"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${values[campo] ? "translate-x-6" : ""}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Meses sem renda */}
      <div>
        <label htmlFor="meses_sem_renda" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Se você perdesse sua renda hoje, por quantos meses conseguiria se manter?
        </label>
        <div className="relative">
          <input
            id="meses_sem_renda"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            {...register("meses_sem_renda", { valueAsNumber: true })}
            className="w-full px-4 py-3 rounded-xl bg-surface-light border border-border text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
            placeholder="Ex: 3"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">meses</span>
        </div>
        {errors.meses_sem_renda && <p className="mt-1.5 text-xs text-red-400">{errors.meses_sem_renda.message}</p>}
      </div>

      {/* Reserva de emergência */}
      <div>
        <label htmlFor="valor_reserva" className="block text-sm font-medium text-zinc-300 mb-1.5">
          Qual o valor total da sua reserva de emergência hoje?
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-medium">R$</span>
          <Controller
            name="valor_reserva"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <input
                id="valor_reserva"
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
        
        {/* Feedback do cálculo em tempo real */}
        {valorReserva > 0 && gastosMensais > 0 && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary-500/5 border border-primary-500/10">
            <Info size={14} className="text-primary-400" />
            <p className="text-xs text-zinc-400">
              Isso equivale a aproximadamente <span className="text-primary-400 font-bold">{mesesCalculados} meses</span> das suas despesas.
            </p>
          </div>
        )}
        
        {errors.valor_reserva && <p className="mt-1.5 text-xs text-red-400">{errors.valor_reserva.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex-1 py-3 rounded-full text-sm font-medium border border-border text-zinc-400 hover:border-zinc-500 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ArrowLeft size={16} /> Voltar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-[2] py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-black flex items-center justify-center gap-2 glow-effect cursor-pointer hover:from-primary-600 hover:to-orange-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <><Loader2 size={16} className="animate-spin" /> Calculando sua rota...</>
          ) : (
            <>Gerar meu diagnóstico <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </form>
  );
}
