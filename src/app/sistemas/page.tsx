import { MonitorPlay, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const sistemas = [
  { nicho: "PetShop", slug: "petshop" },
  { nicho: "Imobiliária", slug: "imobiliaria" },
  { nicho: "Academia", slug: "academia" },
  { nicho: "Delivery", slug: "delivery" },
  { nicho: "Clínicas", slug: "clinicas" },
  { nicho: "Odontologia", slug: "odontologia" },
  { nicho: "Oficina", slug: "oficina" },
  { nicho: "Salão de Beleza", slug: "salao-de-beleza" },
  { nicho: "Restaurantes", slug: "restaurantes" },
];

export default function SistemasPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      {/* Futuristic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-5xl px-4 py-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary mb-6 shadow-[0_0_15px_rgba(245,138,31,0.3)]">
          <MonitorPlay className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Pacote Exclusivo</span>
        </div>

        <h1 className="font-title text-4xl md:text-6xl font-bold text-text mb-6 italic tracking-tight">
          TENHA SEU PRÓPRIO <span className="text-primary drop-shadow-[0_0_15px_rgba(245,138,31,0.8)]">SaaS</span>
        </h1>
        
        <p className="text-text-muted max-w-2xl text-lg mb-12">
          Leve 9 sistemas prontos de altíssima conversão para personalizar e revender para negócios locais. O atalho perfeito para escalar o seu faturamento.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mb-16">
          {sistemas.map((sys) => (
            <Link href={`/sistemas/${sys.slug}`} key={sys.slug} className="group relative bg-surface border border-primary/20 rounded-2xl p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(245,138,31,0.2)] hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex flex-col items-start text-left">
                <h3 className="font-title text-2xl font-bold text-text mb-2">{sys.nicho}</h3>
                <p className="text-sm text-text-muted mb-4">Sistema completo e personalizável.</p>
                <span className="text-primary text-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver detalhes <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-surface to-background border border-gold/30 rounded-3xl p-8 md:p-12 w-full max-w-3xl relative overflow-hidden shadow-[0_0_50px_rgba(255,185,46,0.15)]">
           <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/20 blur-[50px] rounded-full" />
           <h2 className="text-3xl font-bold text-text mb-4">Acesso Imediato aos 9 Sistemas</h2>
           <p className="text-text-muted mb-8 max-w-xl mx-auto">
             Por apenas <span className="text-gold font-bold text-2xl">R$ 19,90</span> você leva todos os códigos fonte, direito de revenda e atualizações.
           </p>
           
           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
             <div className="flex items-center gap-2 text-sm text-text-muted">
               <CheckCircle2 className="w-5 h-5 text-gold" /> Pagamento Único
             </div>
             <div className="flex items-center gap-2 text-sm text-text-muted">
               <CheckCircle2 className="w-5 h-5 text-gold" /> Código Fonte Completo
             </div>
             <div className="flex items-center gap-2 text-sm text-text-muted">
               <CheckCircle2 className="w-5 h-5 text-gold" /> 7 Dias de Garantia
             </div>
           </div>

           <Link href="https://www.asaas.com/c/seu-link-aqui">
             <Button size="lg" className="w-full sm:w-auto text-lg font-bold px-12 shadow-[0_0_30px_rgba(245,138,31,0.6)] hover:scale-105 transition-transform">
               Quero meu Pacote Agora
             </Button>
           </Link>
        </div>
      </div>
    </main>
  );
}
