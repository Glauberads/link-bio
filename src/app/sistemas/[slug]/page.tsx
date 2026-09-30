"use client";
import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle2, PlayCircle, MonitorPlay } from "lucide-react";

export default function SistemaNichoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const nichoName = slug.replace("-", " ");

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-20 px-4 flex flex-col items-center">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none -z-10" />

      <div className="w-full max-w-5xl">
        <Link href="/sistemas" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Catálogo
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16">
          <div className="flex-1 text-center lg:text-left">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary mb-6 shadow-inner">
               <MonitorPlay className="w-4 h-4" />
               <span className="text-xs font-bold uppercase tracking-widest">Sistema Pronto</span>
             </div>
             
             <h1 className="font-title text-4xl md:text-6xl font-bold text-text mb-6 capitalize italic">
               Sistema para <span className="text-primary drop-shadow-[0_0_15px_rgba(245,138,31,0.6)]">{nichoName}</span>
             </h1>
             
             <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto lg:mx-0">
               Solução completa e personalizável para o nicho de {nichoName}. Receba o código fonte, instale e revenda para seus clientes hoje mesmo.
             </p>
             
             <Link href="https://www.asaas.com/c/seu-link-aqui">
               <Button size="lg" className="text-lg font-bold px-12 shadow-[0_0_30px_rgba(245,138,31,0.5)] hover:scale-105 transition-transform">
                 Comprar Pacote Completo (R$ 19,90)
               </Button>
             </Link>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-video bg-surface border border-primary/30 rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)] group flex items-center justify-center cursor-pointer">
               <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
               <PlayCircle className="w-20 h-20 text-primary/80 group-hover:text-primary transition-colors group-hover:scale-110 duration-300" />
               <span className="absolute bottom-4 left-4 text-xs font-bold text-primary bg-background/80 px-3 py-1 rounded-full border border-primary/20 backdrop-blur-md">
                 Demonstração (Em breve)
               </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-surface/50 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-text mb-6">Funcionalidades</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-text-muted">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" /> Dashboard administrativo completo e responsivo.
              </li>
              <li className="flex items-start gap-3 text-text-muted">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" /> Gestão de clientes e integrações nativas.
              </li>
              <li className="flex items-start gap-3 text-text-muted">
                <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" /> Código limpo em React e Node.js.
              </li>
            </ul>
          </div>
          
          <div className="bg-surface/50 border border-primary/20 rounded-3xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-text mb-6">FAQ</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-text">Terei suporte na instalação?</h4>
                <p className="text-sm text-text-muted mt-1">Acompanha manual completo de instalação e deploy na Vercel.</p>
              </div>
              <div>
                <h4 className="font-bold text-text">Posso remover a marca de vocês?</h4>
                <p className="text-sm text-text-muted mt-1">Sim, o sistema é White Label. Você personaliza 100%.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
