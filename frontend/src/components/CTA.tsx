"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] bg-primary-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center mb-8 border border-primary-500/20 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <Clock className="text-primary-500" size={32} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Seu eu do futuro está te agradecendo pela decisão de <span className="gradient-text">hoje.</span>
          </h2>
          
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Quanto mais você adia sua organização, mais distante fica o seu sonho. O tempo não para. <strong>Você vai acelerar ou ficar para trás?</strong>
          </p>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-orange-500 text-black text-lg font-bold rounded-full inline-flex items-center gap-3 glow-effect transition-all"
          >
            Traçar a Rota do Meu Sonho Agora
            <ArrowRight size={24} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
