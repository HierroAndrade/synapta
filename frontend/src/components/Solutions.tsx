"use client";

import { motion } from "framer-motion";
import { Brain, Compass, Users, Crown } from "lucide-react";
import Image from "next/image";

const solutions = [
  {
    icon: <Brain size={24} className="text-primary-500" />,
    image: "/card1.png",
    title: "Análise da sua Carteira",
    subtitle: "Raio-X de Investimentos",
    description: "Sua carteira atual está atrasando seus sonhos? Fazemos um diagnóstico completo dos seus investimentos para mostrar exatamente o que está funcionando e o que precisa mudar.",
    isMain: true
  },
  {
    icon: <Compass size={24} className="text-orange-400" />,
    image: "/card2.png",
    title: "Recomendações Synapta",
    subtitle: "A Carteira Ideal",
    description: "Tenha acesso à nossa carteira recomendada. Estratégias montadas matematicamente para acelerar seus resultados e blindar seu patrimônio.",
    isMain: false
  },
  {
    icon: <Users size={24} className="text-orange-400" />,
    image: "/card3.png",
    title: "Assessor Financeiro",
    subtitle: "Acompanhamento Especializado",
    description: "Não caminhe sozinho. Tenha um planejador financeiro dedicado para guiar suas decisões, tirar dúvidas e ajustar sua rota sempre que necessário.",
    isMain: false
  }
];

export function Solutions() {
  return (
    <section className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            O Arsenal <span className="gradient-text">Synapta</span>
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            A tecnologia mais avançada do mercado e expertise humana, traduzidos em realizadores de sonhos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`glass-panel rounded-3xl overflow-hidden flex flex-col relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.15)] ${item.isMain ? 'md:col-span-2 lg:col-span-1 border-primary-500/40 ring-1 ring-primary-500/20' : 'border-border'}`}
            >
              {/* Image Header */}
              <div className="relative h-56 w-full overflow-hidden border-b border-white/5">
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-light via-transparent to-transparent opacity-90" />
                
                {/* Overlay Badge */}
                {item.isMain && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-primary-500 to-primary-600 text-black text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                    <Crown size={14} /> Produto Principal
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="relative p-8 flex-1 flex flex-col bg-surface-light/30">
                {/* Floating Icon */}
                <div className="absolute -top-7 left-8 w-14 h-14 rounded-2xl bg-surface border border-white/10 shadow-xl flex items-center justify-center z-10">
                  {item.icon}
                </div>

                <div className="mt-6 flex-1">
                  <h3 className="text-2xl font-bold mb-1 group-hover:text-primary-400 transition-colors">{item.title}</h3>
                  <p className="text-sm font-medium text-primary-500 mb-4">{item.subtitle}</p>
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
                
                {/* Interactive bottom edge highlight */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r transition-all duration-500 ${item.isMain ? 'from-primary-600 to-orange-400 w-full' : 'from-primary-500/50 to-orange-400/50 w-0 group-hover:w-full'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
