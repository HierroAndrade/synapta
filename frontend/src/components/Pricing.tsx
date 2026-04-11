"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Análise de Carteira",
    subtitle: "Raio-X de Investimentos",
    price: "R$ 0", // Placeholder de preço
    features: [
      "Raio-X completo da carteira atual",
      "Identificação de gargalos e taxas",
      "Diagnóstico de risco e retorno"
    ],
    buttonText: "Pedir Análise",
    popular: false
  },
  {
    name: "Recomendações",
    subtitle: "Carteira Synapta",
    price: "R$ 49,90",
    period: "/mês",
    features: [
      "Tudo da Análise de Carteira",
      "Acesso à carteira recomendada",
      "Alertas de compra e venda",
      "Estratégia matemática e segura"
    ],
    buttonText: "Acessar Carteira",
    popular: true
  },
  {
    name: "Assessor Premium",
    subtitle: "Acompanhamento Especializado",
    price: "R$ 149,90",
    period: "/mês",
    features: [
      "Tudo de Recomendações",
      "Assessor financeiro dedicado",
      "Planejamento personalizado",
      "Reuniões de balanceamento"
    ],
    buttonText: "Quero um Assessor",
    popular: false
  }
];

export function Pricing() {
  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Sua passagem para a <span className="gradient-text">rota expressa.</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Não custa caro. Caro é o tempo que você perde tentando ir pelo caminho mais longo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className={`glass-panel p-8 rounded-3xl relative ${plan.popular ? 'border-primary-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] md:-translate-y-4 md:py-12' : 'border-border'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-black text-sm font-bold px-4 py-1 rounded-full">
                  Mais Escolhido
                </div>
              )}
              
              <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
              <p className="text-primary-500 text-sm font-medium mb-6">{plan.subtitle}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-zinc-500">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="text-primary-500 shrink-0 mt-0.5" size={18} />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-full font-semibold transition-all ${plan.popular ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-black hover:scale-105' : 'bg-surface-light text-white hover:bg-surface-light/80'}`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
