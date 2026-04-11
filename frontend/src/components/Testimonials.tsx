"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcos",
    age: "32",
    dream: "Jeep Renegade",
    quote: "A IA da Synapta reorganizou minha carteira e antecipou muito a compra do meu Jeep. Cheguei lá antes do que imaginava!"
  },
  {
    name: "Camila",
    age: "28",
    dream: "Aposentadoria Antecipada",
    quote: "Eu não sabia por onde começar. Hoje tenho uma rota clara de como construir a renda passiva que preciso para poder parar de trabalhar."
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-surface text-center relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Não é só sobre números, <br/>
            <span className="gradient-text">é sobre a nova chave na sua mão.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="glass-panel p-10 rounded-3xl text-left relative"
            >
              <Quote className="text-primary-500/20 absolute top-8 right-8" size={64} />
              <div className="relative z-10">
                <p className="text-xl text-zinc-300 italic mb-8 leading-relaxed">
                  "{testi.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-black font-bold text-xl">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{testi.name}, {testi.age}</h4>
                    <p className="text-primary-500 text-sm font-medium">Sonho: {testi.dream}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
