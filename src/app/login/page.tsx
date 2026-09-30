"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <main className="min-h-screen bg-background relative flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -z-10" />
      
      <div className="w-full max-w-md bg-surface/80 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,138,31,0.15)] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/20 blur-[40px] rounded-full" />
        
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(245,138,31,0.3)] mb-6">
          <Lock className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold text-text mb-2">Acesso Restrito</h1>
        <p className="text-text-muted mb-8">Faça login para gerenciar a plataforma.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="text-text-muted text-sm ml-1 font-medium">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner transition-all" 
            />
          </div>
          <div>
            <label className="text-text-muted text-sm ml-1 font-medium">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-inner transition-all" 
            />
          </div>
          
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          
          <Button type="submit" disabled={loading} className="w-full mt-2 text-base font-bold shadow-[0_0_20px_rgba(245,138,31,0.4)]">
            {loading ? "Entrando..." : "Acessar Painel"}
          </Button>
        </form>
      </div>
    </main>
  );
}
