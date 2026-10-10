import Link from "next/link";
import { Sparkles, ArrowRight, Rocket, Code2, Cpu, MessageCircle, ChevronRight, Hexagon, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";

const projetos = [
  { nome: "GranjaFlow", slug: "granjaflow", status: "Em validação", desc: "Gestão inteligente para o agronegócio.", icon: Hexagon, color: "from-amber-400 to-orange-600" },
  { nome: "Papuga", slug: "papuga", status: "Disponível", desc: "Plataforma de automação e comunicação.", icon: MessageCircle, color: "from-blue-400 to-indigo-600" },
  { nome: "Agência de Agentes de IA", slug: "agencia-ia", status: "Em desenvolvimento", desc: "Força de trabalho autônoma sob demanda.", icon: Cpu, color: "from-primary to-gold" },
  { nome: "SiteGenClone", slug: "sitegenclone", status: "Disponível", desc: "Copie qualquer site em segundos.", icon: Zap, color: "from-pink-500 to-rose-600" },
  { nome: "Conecta", slug: "conecta", status: "Disponível", desc: "Hub inteligente e link na bio.", icon: Code2, color: "from-emerald-400 to-teal-600" },
];

export default async function ProjetosPage() {
  let whatsappUrl = "https://wa.me/";
  try {
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    if (config?.whatsappUrl) {
      whatsappUrl = config.whatsappUrl;
    }
  } catch (e) {
    console.error(e);
  }

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center font-sans selection:bg-primary/30">
      
      {/* Background Gradients (Futuristic) */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1200px] h-[400px] bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-[80px] -z-10 pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="w-full max-w-6xl px-6 pt-32 pb-16 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Innovation Labs</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          O Futuro, <br className="md:hidden" /> Construído Hoje.
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted max-w-2xl font-light leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Explore as soluções proprietárias que estamos desenvolvendo. Sistemas robustos, inteligência artificial e automações projetadas para escalar operações ao máximo.
        </p>

        {/* Primary CTA */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-in fade-in zoom-in duration-700 delay-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#25D366]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          Falar com um Especialista no WhatsApp
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </a>
      </section>

      {/* Projects Grid */}
      <section className="w-full max-w-6xl px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projetos.map((proj, idx) => {
            const Icon = proj.icon;
            const delay = 400 + (idx * 100);
            
            return (
              <Link 
                href={`/projetos/${proj.slug}`} 
                key={proj.slug} 
                className="group relative bg-surface/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:border-white/20 hover:-translate-y-2 hover:bg-surface/80"
                style={{ animationDelay: `${delay}ms` }}
              >
                {/* Glow Effect inside card */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${proj.color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border backdrop-blur-md ${
                      proj.status === "Disponível" 
                        ? "bg-[#00A859]/10 border-[#00A859]/30 text-[#00A859]" 
                        : proj.status === "Em validação"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                        : "bg-primary/10 border-primary/30 text-primary"
                    }`}>
                      {proj.status}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{proj.nome}</h3>
                  <p className="text-text-muted text-sm font-light leading-relaxed flex-1 mb-8">{proj.desc}</p>
                  
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest mt-auto">
                    Explorar Projeto 
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="w-full max-w-4xl px-6 py-24 relative z-10">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-b from-surface/80 to-surface/40 backdrop-blur-xl border border-white/10 p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
           
           <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Pronto para transformar sua ideia em software?</h2>
           <p className="text-text-muted text-lg max-w-xl mx-auto mb-10">Não fique para trás. A inteligência artificial e a automação estão redefinindo o mercado. Construa com a gente.</p>
           
           <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#00A859] hover:bg-[#00c266] text-white font-bold text-lg rounded-full transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,168,89,0.4)]"
          >
            <Rocket className="w-6 h-6" />
            Iniciar Projeto Agora
          </a>
        </div>
      </section>

    </main>
  );
}
