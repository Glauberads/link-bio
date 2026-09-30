"use client";
import { useState, use } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default function ProjetoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [email, setEmail] = useState("");

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectSlug: slug, email }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-20 px-4 flex flex-col items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none -z-10" />

      <div className="w-full max-w-2xl">
        <Link href="/projetos" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Voltar para Projetos
        </Link>
        
        <div className="bg-surface/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(245,138,31,0.15)] text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/20 blur-[50px] rounded-full" />
          
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,138,31,0.6)]" />
          <h1 className="font-title text-3xl md:text-5xl font-bold text-text mb-4 italic capitalize">
            {slug.replace("-", " ")}
          </h1>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary mb-8 shadow-inner">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Em Desenvolvimento</span>
          </div>

          <p className="text-text-muted text-lg mb-8 max-w-lg mx-auto">
            Este projeto ainda não está liberado ao público. Junte-se à lista de espera VIP e seja avisado em primeira mão quando lançarmos!
          </p>

          {status === "success" ? (
             <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
               <h3 className="text-green-400 font-bold text-xl mb-2">Você está na lista!</h3>
               <p className="text-text-muted text-sm">Fique de olho no seu e-mail, enviaremos as novidades por lá.</p>
             </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail" 
                className="flex-1 bg-background border border-primary/30 rounded-xl px-4 py-3 text-text focus:border-primary focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner" 
              />
              <Button type="submit" disabled={status === "loading"} className="whitespace-nowrap px-8 shadow-[0_0_20px_rgba(245,138,31,0.4)] hover:scale-105 transition-transform">
                {status === "loading" ? "Aguarde..." : "Entrar na Lista"}
              </Button>
            </form>
          )}
          {status === "error" && <p className="text-red-400 mt-4 text-sm">Ocorreu um erro. Tente novamente.</p>}
        </div>
      </div>
    </main>
  );
}
