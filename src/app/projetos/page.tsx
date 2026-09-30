import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const projetos = [
  { nome: "GranjaFlow", slug: "granjaflow", status: "Em validação", desc: "Gestão inteligente para o agronegócio." },
  { nome: "Papuga", slug: "papuga", status: "Disponível", desc: "Plataforma de automação e comunicação." },
  { nome: "Agência de Agentes de IA", slug: "agencia-ia", status: "Em desenvolvimento", desc: "Força de trabalho autônoma sob demanda." },
  { nome: "SiteGenClone", slug: "sitegenclone", status: "Disponível", desc: "Copie qualquer site em segundos." },
  { nome: "Conecta", slug: "conecta", status: "Disponível", desc: "Hub inteligente e link na bio." },
];

export default function ProjetosPage() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-20 px-4 flex flex-col items-center">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none -z-10" />

      <div className="w-full max-w-4xl text-center mb-16">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,138,31,0.6)]" />
        <h1 className="font-title text-4xl md:text-5xl font-bold text-text mb-4 italic">Nossos Projetos</h1>
        <p className="text-text-muted text-lg">Soluções proprietárias que estamos desenvolvendo e escalando.</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {projetos.map(proj => (
          <Link href={`/projetos/${proj.slug}`} key={proj.slug} className="group flex flex-col bg-surface border border-primary/20 rounded-3xl p-8 hover:border-primary hover:shadow-[0_0_30px_rgba(245,138,31,0.2)] transition-all duration-300 hover:-translate-y-1">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-title text-2xl font-bold text-text group-hover:text-primary transition-colors">{proj.nome}</h2>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${proj.status === "Disponível" ? "bg-gold/10 border-gold/40 text-gold shadow-[0_0_10px_rgba(255,185,46,0.3)]" : "bg-primary/10 border-primary/30 text-primary"}`}>
                {proj.status}
              </span>
            </div>
            <p className="text-text-muted mb-8 flex-1">{proj.desc}</p>
            <div className="flex items-center gap-2 text-sm font-bold text-text-muted group-hover:text-primary transition-colors">
              Explorar <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
