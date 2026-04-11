"use client";

import { motion } from "framer-motion";
import { AlertCircle, Map } from "lucide-react";
import Image from "next/image";

export function Problem() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Image Container (Left) */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:flex-[1.4] flex-1 w-full relative"
          >
            <div className="relative h-[400px] lg:h-[600px] w-full rounded-3xl overflow-hidden glass-panel border border-white/5">
              <Image 
                src="/tired_worker.png" 
                alt="Profissional frustrado com os resultados financeiros" 
                fill 
                className="object-cover object-center filter grayscale-[30%] contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-surface/80 lg:from-transparent via-transparent to-surface/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
            </div>
            
            {/* Callout Box over Image */}
            <div className="absolute -bottom-6 -right-6 lg:-bottom-10 lg:-right-10 glass-panel p-6 rounded-2xl border border-red-500/20 max-w-[280px] shadow-2xl hidden md:block backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 p-3 rounded-full flex-shrink-0">
                  <AlertCircle className="text-red-500" size={24} />
                </div>
                <div>
                  <p className="text-sm text-zinc-300 font-medium">Anos de trabalho, e a sensação constante de andar em círculos?</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content Container (Right) */}
          <div className="flex-1 w-full lg:pl-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Você trabalha duro, mas sente que seus objetivos estão <span className="text-red-500/90">sempre longe?</span>
              </h2>
              
              <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
                O problema não é o quanto você se esforça, é que seu dinheiro está com o <strong className="text-zinc-200">"freio de mão" puxado</strong> em investimentos ruins ou dívidas invisíveis. A conta simplesmente não fecha com o método tradicional.
              </p>
            </motion.div>


          </div>

        </div>
      </div>
    </section>
  );
}
