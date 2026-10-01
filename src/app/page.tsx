import Link from "next/link";
import { Search, Camera, MessageCircle, Laptop, Globe, Briefcase, Copy, Code, FolderOpen, Diamond, Music2, Play, Link as LinkIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { FloatingChat } from "@/components/FloatingChat";
import { HomeButtons } from "@/components/HomeButtons";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let config = null;
  let fixedLinks: any = {};
  try {
    config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    fixedLinks = (config?.fixedLinksConfig as any) || {};
  } catch (e) {
    console.error('DB error:', e);
  }


  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex justify-center lg:justify-start max-w-7xl mx-auto">
      
      {/* Coluna Esquerda: O Link na Bio */}
      <div className="w-full max-w-xl flex flex-col py-12 px-4 lg:pl-12 lg:pr-8 relative z-10 overflow-y-auto hide-scrollbar">
        
        {/* Header Profile */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 rounded-full border-2 border-primary/50 overflow-hidden bg-surface flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,138,31,0.2)] relative">
            {config?.logoUrl ? (
               <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
               <span className="font-title font-bold text-primary text-xl">FFR</span>
            )}
          </div>
          <div>
            <h2 className="text-[10px] font-bold text-[#00A859] tracking-widest uppercase mb-1 drop-shadow-[0_0_8px_rgba(0,168,89,0.5)]">
              {config?.siteTitle || "FFR DO BRASIL TECHNOLOGY"}
            </h2>
            <h1 className="text-3xl font-bold text-text leading-none mb-2">
              {config?.siteSubtitle || "Flávio Rodrigues"}
            </h1>
            <p className="text-sm text-text-muted leading-snug font-medium">
              {config?.siteDescription || "Soluções digitais para empresas que querem vender mais, reduzir custos e crescer."}
            </p>
          </div>
        </div>



        {/* Personagem (Visível apenas no Mobile) */}
        <div className="flex lg:hidden w-full justify-center mb-8 relative">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-[#00A859]/20 rounded-full blur-[80px] pointer-events-none" />
           
           {config?.characterUrl ? (
             config.characterUrl.endsWith('.mp4') ? (
               <div className="relative z-10 w-full max-w-[260px] aspect-[9/16] rounded-3xl overflow-hidden drop-shadow-[0_0_30px_rgba(0,168,89,0.3)]">
                 <video src={config.characterUrl} autoPlay loop muted playsInline className="w-full h-full object-cover pointer-events-none scale-[1.05]" />
               </div>
             ) : (
               <img src={config.characterUrl} alt="Personagem" className="relative z-10 w-full max-w-[250px] object-contain drop-shadow-[0_0_30px_rgba(0,168,89,0.3)]" />
             )
           ) : (
             <div className="relative z-10 w-full max-w-[250px] h-[350px] bg-surface/20 border border-primary/10 rounded-3xl backdrop-blur-sm flex flex-col items-center justify-center text-center p-4 shadow-[0_0_30px_rgba(0,168,89,0.15)]">
               <h3 className="text-xl font-bold text-text mb-2">Seu Personagem</h3>
               <p className="text-text-muted text-[10px]">Acesse o painel Admin &gt; Personalização para fazer o upload.</p>
             </div>
           )}
        </div>

        {/* Componente de Botões com Tracking (Client Side) */}
        <HomeButtons config={config} fixedLinks={fixedLinks} />

        {/* Rodapé Premium */}
        <footer className="mt-6 pt-6 border-t border-primary/10">
          <div className="flex flex-col items-center gap-3 text-center">
            
            {/* Linha de Identidade */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-primary tracking-widest uppercase">@glauberads</span>
            </div>

            {/* Divider decorativo */}
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-primary/20" />
              <div className="w-1 h-1 rounded-full bg-primary/40" />
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-primary/20" />
            </div>

            {/* Info empresarial */}
            <div className="flex flex-col gap-1">
              <a href="mailto:contato@glauberads.com.br" className="text-[10px] text-text-muted hover:text-primary transition-colors">
                contato@glauberads.com.br
              </a>
              <p className="text-[9px] text-text-muted/60 tracking-wider">
                CNPJ: 31.097.622/0001-03
              </p>
            </div>

            {/* Crédito */}
            <p className="text-[9px] text-text-muted/50 flex items-center gap-1 mt-1">
              Desenvolvido com <span className="text-red-500 text-xs">❤</span> <span className="font-bold text-text-muted/70">G-ADS</span>
            </p>

          </div>
        </footer>
      </div>

      {/* Coluna Direita: Personagem (Oculto no Mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative min-h-screen">
        {/* Neon Glows behind character */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00A859]/20 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
        
        {config?.characterUrl ? (
          config.characterUrl.endsWith('.mp4') ? (
            <div className="relative z-10 w-full max-w-[380px] aspect-[9/16] rounded-[2.5rem] overflow-hidden drop-shadow-[0_0_40px_rgba(0,168,89,0.4)]">
              <video src={config.characterUrl} autoPlay loop muted playsInline className="w-full h-full object-cover pointer-events-none scale-[1.05]" />
            </div>
          ) : (
            <img src={config.characterUrl} alt="Hero" className="relative z-10 w-full max-w-lg max-h-[85vh] object-contain drop-shadow-[0_0_30px_rgba(0,168,89,0.3)]" />
          )
        ) : (
          <div className="relative z-10 w-full max-w-lg h-[80vh] bg-surface/20 border border-primary/10 rounded-3xl backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 shadow-[0_0_50px_rgba(0,168,89,0.1)]">
             <h3 className="text-2xl font-bold text-text mb-4">Seu Personagem Aqui</h3>
             <p className="text-text-muted text-sm">Acesse o painel Admin &gt; Personalização para fazer o upload.</p>
          </div>
        )}
      </div>

      {config?.agentEnabled && <FloatingChat />}
    </main>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
