"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Sparkles, TrendingUp, CarFront, Home, Wallet, ChevronLeft, ChevronRight } from "lucide-react";

export function Hero() {
  const [activeGoal, setActiveGoal] = useState<"house" | "car" | "money">("house");

  const goals = {
    house: {
      title: "Casa Própria",
      img: "/dream_house.png",
      tradLabel: "Alvo: 2035",
      synaptaLabel: "Alvo: 2029",
      tradWidth: "25%",
      synaptaWidth: "85%",
    },
    car: {
      title: "Carro de Luxo",
      img: "/dream_car.png",
      tradLabel: "Alvo: 2032",
      synaptaLabel: "Alvo: 2028",
      tradWidth: "30%",
      synaptaWidth: "90%",
    },
    money: {
      title: "Patrimônio de R$ 1 Milhão",
      img: "/dream_wealth.png",
      tradLabel: "Em 2032: R$ 250k",
      synaptaLabel: "Em 2032: R$ 1.2M",
      tradWidth: "15%",
      synaptaWidth: "100%",
    }
  };

  const current = goals[activeGoal];

  const goalKeys = ["house", "car", "money"] as const;

  const handleNext = () => {
    const currentIndex = goalKeys.indexOf(activeGoal);
    setActiveGoal(goalKeys[(currentIndex + 1) % goalKeys.length]);
  };

  const handlePrev = () => {
    const currentIndex = goalKeys.indexOf(activeGoal);
    setActiveGoal(goalKeys[(currentIndex - 1 + goalKeys.length) % goalKeys.length]);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-12 lg:pt-24 lg:pb-20 overflow-hidden">
      {/* Mobile Background Context */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <Image src="/dream_wealth.png" fill alt="Wealth Background" className="object-cover opacity-[0.15] mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/80 to-background" />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >

            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-4 lg:mb-6 leading-tight">
              Acelere a conquista do seu <br className="hidden lg:block"/>
              <span className="gradient-text">próximo grande sonho.</span>
            </h1>
            
            <p className="text-base sm:text-lg text-zinc-400 mb-6 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Seu carro zero, a casa própria ou a aposentadoria antecipada não precisam ser uma realidade distante. A Inteligência Artificial da Synapta analisa sua vida, corrige seus investimentos e cria a rota otimizada para você multiplicar seu patrimônio em menos tempo.
            </p>

            {/* Mobile-Only Fast Track Visual */}
            <div className="lg:hidden mb-8 w-full max-w-sm mx-auto bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary-500/20 blur-xl rounded-full pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-primary-500" />
                <h3 className="text-sm font-semibold text-white">Comprovação Rápida</h3>
              </div>
              
              <div className="space-y-4">
                {/* Traditional Bar */}
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[11px] text-zinc-400 font-medium tracking-wide">Caminho Tradicional (Lento)</span>
                    <span className="text-[10px] font-mono text-zinc-500">Alvo: 2035</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-1.5">
                    <div className="bg-zinc-700 h-1.5 rounded-full w-[25%]" />
                  </div>
                </div>
                
                {/* Synapta Bar */}
                <div className="relative">
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-[12px] text-primary-400 font-bold">Rota Synapta</span>
                    <span className="text-[11px] font-mono font-bold text-primary-500">Alvo: 2029</span>
                  </div>
                  <div className="w-full bg-surface-light rounded-full h-2.5 shadow-inner">
                    <motion.div 
                      initial={{ width: "25%" }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1.5, delay: 0.3, type: "spring" }}
                      className="bg-gradient-to-r from-primary-700 via-primary-500 to-amber-300 h-2.5 rounded-full relative overflow-hidden"
                    >
                      <motion.div 
                        animate={{ x: ["-100%", "400%"] }} 
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                        className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-[30deg]"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-[92%] sm:w-auto justify-center px-4 py-3 md:px-8 md:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-orange-500 text-black text-sm md:text-base font-semibold rounded-full flex items-center gap-2 mx-auto lg:mx-0 glow-effect transition-all cursor-pointer"
            >
              Como eu posso alcançar meus objetivos em menos tempo?
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="glass-panel p-5 sm:p-8 rounded-3xl relative">
              <div className="mb-4 relative z-20 overflow-hidden rounded-2xl border border-white/5 group shadow-2xl">
                <div className="relative h-64 sm:h-80 w-full">
                  <Image 
                    key={current.img}
                    src={current.img} 
                    alt={current.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
                  
                  {/* Seletores Flutuantes (Desktop) */}
                  <div className="absolute top-4 left-4 hidden md:flex gap-2 z-20">
                    <button 
                      onClick={() => setActiveGoal("car")}
                      className={`p-2 backdrop-blur-md rounded-lg border transition-colors cursor-pointer ${activeGoal === "car" ? "bg-primary-500/30 border-primary-500/80 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]" : "bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-primary-500/50"}`}
                    >
                      <CarFront size={16} />
                    </button>
                    <button 
                      onClick={() => setActiveGoal("house")}
                      className={`p-2 backdrop-blur-md rounded-lg border transition-colors cursor-pointer ${activeGoal === "house" ? "bg-primary-500/30 border-primary-500/80 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]" : "bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-primary-500/50"}`}
                    >
                      <Home size={16} />
                    </button>
                    <button 
                      onClick={() => setActiveGoal("money")}
                      className={`p-2 backdrop-blur-md rounded-lg border transition-colors cursor-pointer ${activeGoal === "money" ? "bg-primary-500/30 border-primary-500/80 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]" : "bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-primary-500/50"}`}
                    >
                      <Wallet size={16} />
                    </button>
                  </div>

                  {/* Mobile Carousel Controls */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:hidden z-20 pointer-events-none">
                    <button onClick={handlePrev} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white pointer-events-auto active:bg-black/60 transition-colors shadow-lg">
                      <ChevronLeft size={28} />
                    </button>
                    <button onClick={handleNext} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white pointer-events-auto active:bg-black/60 transition-colors shadow-lg">
                      <ChevronRight size={28} />
                    </button>
                  </div>
                  
                  {/* Mobile Carousel Indicators */}
                  <div className="absolute top-4 right-4 flex gap-1.5 md:hidden z-20 items-center">
                    {goalKeys.map((key) => (
                      <button 
                        key={key} 
                        onClick={() => setActiveGoal(key)}
                        className={`block h-1.5 rounded-full transition-all ${activeGoal === key ? "bg-primary-500 w-4 shadow-[0_0_8px_rgba(245,158,11,0.8)]" : "bg-white/40 w-1.5"}`}
                      />
                    ))}
                  </div>
                  
                  {/* Título do Objetivo */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                    <div>
                      <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1 drop-shadow-md">Objetivo Mapeado</p>
                      <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{current.title}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 relative z-20">
                
                {/* Comparativo de Velocidade / Valor */}
                <div className="pt-0 min-h-[220px] flex flex-col justify-center gap-4">
                  
                  {activeGoal === "money" ? (
                    <div className="flex flex-col gap-3">
                      {/* Universal Time Reference */}
                      <div className="text-center pt-2">
                        <span className="text-[11px] font-mono text-zinc-400 tracking-[0.2em] uppercase border-b border-white/10 pb-1">Comparando o exato mesmo ano: <span className="text-white font-bold">2032</span></span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-2">
                        {/* Bloco Tradicional Money */}
                        <div className="p-4 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl border border-red-500/50 flex flex-col justify-center items-center text-center shadow-inner">
                          <span className="text-[11px] font-bold tracking-widest text-white/90 mb-2">CAMINHO TRADICIONAL</span>
                          <p className="text-red-200/80 text-xs mb-1">Patrimônio Acumulado</p>
                          <p className="text-xl md:text-2xl font-mono font-bold text-white drop-shadow-md">R$ 250<span className="text-red-200 md:text-lg">k</span></p>
                        </div>

                        {/* Bloco Synapta Money */}
                        <div className="relative h-full">
                          <div className="relative p-4 bg-gradient-to-br from-primary-400 via-primary-500 to-amber-500 rounded-2xl border border-amber-300 flex flex-col justify-center items-center text-center z-10 h-full shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                            <span className="text-[11px] font-extrabold tracking-widest text-black/80 mb-2 flex items-center gap-1"><Sparkles size={12}/> ROTA SYNAPTA</span>
                            <p className="text-black/70 text-xs mb-1 font-medium">Patrimônio Acumulado</p>
                            <p className="text-2xl md:text-3xl font-black text-black drop-shadow-md">R$ 1.2<span className="text-xl">M</span></p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-1">
                        <div className="w-full bg-primary-500/10 rounded-xl p-3 border border-primary-500/20 text-center shadow-inner">
                           <p className="text-sm font-medium text-zinc-300">A matemática a seu favor pode gerar <strong className="text-primary-500 text-base">quase 5x mais</strong> lucro investindo o mesmo tempo.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Caminho Tradicional (Barra) */}
                      <div className="relative">
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 font-medium tracking-wide">Caminho Tradicional</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest bg-red-500/10 text-red-500 px-2 py-0.5 rounded border border-red-500/20">Lento</span>
                          </div>
                          <span className="text-zinc-500 font-mono text-xs">{current.tradLabel}</span>
                        </div>
                        <div className="w-full bg-surface-light rounded-full h-2 overflow-hidden border border-border/30">
                          <motion.div 
                            key={`${activeGoal}-trad`}
                            initial={{ width: 0 }}
                            animate={{ width: current.tradWidth }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="h-full bg-zinc-700"
                          />
                        </div>
                      </div>

                      {/* Rota Synapta (Barra) */}
                      <div className="relative mt-6">
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-primary-500 font-bold flex items-center gap-1.5 text-[15px]">
                              <Sparkles size={14} className="animate-pulse" /> Rota Synapta
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-widest bg-primary-500/10 text-primary-500 px-2 py-0.5 rounded border border-primary-500/20">Velocidade</span>
                          </div>
                          <span className="text-primary-500 font-mono font-bold text-xs">{current.synaptaLabel}</span>
                        </div>
                        
                        {/* Barra de Progresso Turbo */}
                        <div className="w-full bg-surface-light rounded-full h-3 overflow-hidden border border-border/30 relative shadow-inner">
                          <motion.div 
                            key={`${activeGoal}-synapta`}
                            initial={{ width: 0 }}
                            animate={{ width: current.synaptaWidth }}
                            transition={{ duration: 1.5, delay: 0.2, type: "spring", stiffness: 45, damping: 15 }}
                            className="h-full bg-gradient-to-r from-primary-700 via-primary-500 to-amber-300 relative rounded-full"
                          >
                            {/* Efeito de Brilho Super Rápido Passando */}
                            <motion.div 
                              animate={{ x: ["-100%", "400%"] }} 
                              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[30deg]"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </>
                  )}
                  
                </div>

              </div>

              {/* Decorative graphic behind elements inside panel */}
              <div className="absolute bottom-0 right-0 left-0 h-1/2 bg-gradient-to-t from-primary-500/10 to-transparent pointer-events-none rounded-b-3xl"></div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
