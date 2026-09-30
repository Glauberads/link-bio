"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MessageCircle, Send } from "lucide-react";

export default function OrcamentoPage() {
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex justify-center py-20 px-4">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[150px] -z-10" />
      
      <div className="w-full max-w-xl h-fit bg-surface/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(245,138,31,0.3)]">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Solicitar Orçamento</h1>
            <p className="text-sm text-text-muted">Desenvolvimento de soluções sob medida</p>
          </div>
        </div>

        {status === "success" ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Send className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-text mb-2">Solicitação Enviada!</h2>
            <p className="text-text-muted">Entraremos em contato em breve pelo WhatsApp ou e-mail.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />
            <input type="hidden" name="origem" value="Formulário Orçamento" />

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 ml-1">Nome Completo</label>
              <input required type="text" name="nome" className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 ml-1">E-mail</label>
              <input required type="email" name="email" className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 ml-1">WhatsApp</label>
              <input required type="tel" name="telefone" className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-inner" />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1 ml-1">Conte-me sobre o seu projeto</label>
              <textarea required name="mensagem" rows={4} className="w-full bg-background border border-primary/20 rounded-xl px-4 py-3 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none shadow-inner"></textarea>
            </div>

            <Button type="submit" disabled={status === "loading"} className="w-full mt-4 text-base font-bold shadow-[0_0_20px_rgba(245,138,31,0.4)]">
              {status === "loading" ? "Enviando..." : "Enviar Solicitação"}
            </Button>

            {status === "error" && (
              <p className="text-red-400 text-sm text-center mt-2">Ocorreu um erro. Tente novamente.</p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}
