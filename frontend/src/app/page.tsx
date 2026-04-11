import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Solutions } from "@/components/Solutions";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { CTA } from "@/components/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar Placeholder (could be a separate component but simple enough here) */}
      <header className="fixed top-0 inset-x-0 h-20 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-orange-600 rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl leading-none">S</span>
           </div>
           <span className="font-bold text-xl tracking-tight">Synapta<span className="text-primary-500">Invest</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Produtos</a>
          <a href="#" className="hover:text-white transition-colors">Depoimentos</a>
          <a href="#" className="hover:text-white transition-colors">Planos</a>
        </nav>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium hover:text-white transition-colors hidden sm:block">Entrar</a>
          <button className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-black text-sm font-semibold rounded-full transition-colors">
            Cadastre-se
          </button>
        </div>
      </header>

      <Hero />
      <Problem />
      <Solutions />
      <Testimonials />
      <Pricing />
      <CTA />

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-background text-center text-zinc-500">
        <p className="mb-4">Synapta Invest © {new Date().getFullYear()}. Todos os direitos reservados.</p>
        <p className="text-sm max-w-lg mx-auto">
          A Synapta não é uma corretora, mas a ponte tecnológica inteligente entre você e seu sucesso financeiro.
        </p>
      </footer>
    </main>
  );
}
