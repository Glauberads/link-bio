import Link from "next/link";
import { Search, Camera, MessageCircle, Laptop, Globe, Briefcase, Copy, Code, FolderOpen, Diamond, Music2, Play, Link as LinkIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { FloatingChat } from "@/components/FloatingChat";

export default async function Home() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  const fixedLinks = (config?.fixedLinksConfig as any) || {};

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

        {/* Caixa de Pesquisa (Estilo Original) */}
        <div className="bg-surface/80 backdrop-blur-md rounded-3xl p-3 flex items-start border border-primary/30 shadow-[0_0_25px_rgba(0,0,0,0.5)] mb-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(245,138,31,0.15)]">
          <div className="bg-[#004d40] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,77,64,0.6)]">
             <Search className="w-5 h-5 text-[#00e676]" />
          </div>
          <div className="ml-4 flex-1 pr-2">
            <h3 className="font-bold text-text text-sm">Pesquise no Conecta FFR</h3>
            <p className="text-[10px] text-text-muted mt-0.5">Encontre materiais, repositórios, sistemas, projetos e links.</p>
            <Link href="/biblioteca">
              <input 
                type="text" 
                placeholder="Pesquise por IA, agentes, SaaS, imagens..." 
                className="w-full mt-3 bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-xs text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner cursor-pointer" 
                readOnly
              />
            </Link>
            <p className="text-[9px] text-text-muted mt-2">Digite para pesquisar em todo o site.</p>
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

        {/* Lista de Botões */}
        <div className="w-full flex flex-col gap-3 pb-20">
          
          {/* Tag de Redes Sociais */}
          <div className="bg-gradient-to-r from-[#FFF9C4]/10 to-transparent border border-[#FFF9C4]/20 rounded-2xl p-4 flex items-center gap-3">
            <SparklesIcon className="w-5 h-5 text-[#FFF59D] shrink-0" />
            <div>
              <h3 className="font-bold text-[#FFF59D] text-sm">Siga nas redes sociais</h3>
              <p className="text-[10px] text-text-muted">Conteúdo sobre tecnologia, projetos e IA</p>
            </div>
          </div>

          <a href={config?.tiktokUrl || "#"} className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <div className="bg-white rounded-full p-1.5"><Music2 className="w-5 h-5 text-black" /></div>
            <div>
              <h3 className="font-bold text-white text-sm">{fixedLinks.tiktok?.title || "TikTok"}</h3>
              <p className="text-[10px] text-gray-400">{fixedLinks.tiktok?.subtitle || "Conteúdo Rápido"}</p>
            </div>
          </a>

          <a href={config?.instagramUrl || "#"} className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(253,29,29,0.3)] border border-white/10">
            <div className="bg-white rounded-full p-1.5"><Camera className="w-5 h-5 text-[#E1306C]" /></div>
            <div>
              <h3 className="font-bold text-white text-sm">{fixedLinks.instagram?.title || "Instagram"}</h3>
              <p className="text-[10px] text-white/80">{fixedLinks.instagram?.subtitle || "Acompanhe meu dia a dia"}</p>
            </div>
          </a>

          <a href={config?.whatsappUrl || "#"} className="bg-[#25D366] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(37,211,102,0.3)] border border-white/10">
            <div className="bg-white rounded-full p-1.5"><MessageCircle className="w-5 h-5 text-[#25D366]" /></div>
            <div>
              <h3 className="font-bold text-white text-sm">{fixedLinks.whatsapp?.title || "Falar comigo no WhatsApp"}</h3>
              <p className="text-[10px] text-white/90">{fixedLinks.whatsapp?.subtitle || "Converse diretamente comigo"}</p>
            </div>
          </a>

          {config?.youtubeUrl && (
            <Link href={config.youtubeUrl} target="_blank" className="bg-surface/40 hover:bg-surface/80 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,0,0,0.15)] group">
              <div className="bg-[#FF0000]/10 p-2 rounded-xl group-hover:bg-[#FF0000]/20 transition-colors"><Play className="w-5 h-5 text-[#FF0000]" /></div>
              <div>
                <h3 className="font-bold text-text group-hover:text-primary transition-colors text-sm">{fixedLinks.youtube?.title || "YouTube"}</h3>
                <p className="text-[10px] text-text-muted">{fixedLinks.youtube?.subtitle || "Acompanhe vídeos exclusivos"}</p>
              </div>
            </Link>
          )}

          {Array.isArray(config?.customLinks) && config.customLinks.map((link: any) => (
            <Link key={link.id} href={link.url} target="_blank" className="bg-surface/40 hover:bg-surface/80 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform group">
              {link.iconUrl ? (
                link.iconUrl.endsWith('.mp4') ? (
                  <video src={link.iconUrl} autoPlay loop muted playsInline className="w-9 h-9 object-cover rounded-xl" />
                ) : (
                  <img src={link.iconUrl} alt={link.title} className="w-9 h-9 object-cover rounded-xl" />
                )
              ) : (
                <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors"><LinkIcon className="w-5 h-5 text-primary" /></div>
              )}
              <div>
                <h3 className="font-bold text-text group-hover:text-primary transition-colors text-sm">{link.title}</h3>
                <p className="text-[10px] text-text-muted">Acessar link</p>
              </div>
            </Link>
          ))}

          <Link href="/orcamento" className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-gold rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-gold/10 p-2 rounded-xl group-hover:bg-gold/20 transition-colors"><Laptop className="w-5 h-5 text-gold" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.orcamento?.title || "Orçamento para desenvolvimento de sistemas"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.orcamento?.subtitle || "Sites, sistemas, automações e soluções sob medida"}</p>
            </div>
          </Link>

          <a href={config?.siteOficialUrl || "#"} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#00A859] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-[#00A859]/10 p-2 rounded-xl group-hover:bg-[#00A859]/20 transition-colors"><Globe className="w-5 h-5 text-[#00A859]" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.siteOficial?.title || "Conhecer a FFR do Brasil"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.siteOficial?.subtitle || "Acesse nosso site oficial"}</p>
            </div>
          </a>

          <Link href="/sistemas" className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#8D6E63] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-[#8D6E63]/10 p-2 rounded-xl group-hover:bg-[#8D6E63]/20 transition-colors"><Briefcase className="w-5 h-5 text-[#8D6E63]" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.sistemas?.title || "9 sistemas prontos para personalizar e revender"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.sistemas?.subtitle || "Só R$ 19,90 • 7 dias de garantia"}</p>
            </div>
          </Link>

          <Link href="/projetos/sitegenclone" className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#E91E63] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-[#E91E63]/10 p-2 rounded-xl group-hover:bg-[#E91E63]/20 transition-colors"><Copy className="w-5 h-5 text-[#E91E63]" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.siteGenClone?.title || "SiteGenClone"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.siteGenClone?.subtitle || "Clonador de sites para projetos autorizados"}</p>
            </div>
          </Link>

          <Link href="/biblioteca" className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#9E9E9E] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-[#9E9E9E]/10 p-2 rounded-xl group-hover:bg-[#9E9E9E]/20 transition-colors"><Code className="w-5 h-5 text-[#9E9E9E]" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.github?.title || "Repositórios GitHub Premium Free"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.github?.subtitle || "Recursos gratuitos organizados por categoria"}</p>
            </div>
          </Link>

          <Link href="/projetos" className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#4CAF50] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-[#4CAF50]/10 p-2 rounded-xl group-hover:bg-[#4CAF50]/20 transition-colors"><FolderOpen className="w-5 h-5 text-[#4CAF50]" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.projetos?.title || "Ver projetos desenvolvidos"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.projetos?.subtitle || "Sistemas, produtos e projetos em evolução"}</p>
            </div>
          </Link>

          <Link href="/biblioteca" className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#2196F3] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
            <div className="bg-[#2196F3]/10 p-2 rounded-xl group-hover:bg-[#2196F3]/20 transition-colors"><Diamond className="w-5 h-5 text-[#2196F3]" /></div>
            <div>
              <h3 className="font-bold text-text text-sm">{fixedLinks.dicas?.title || "Dicas grátis de IA, automações e ferramentas"}</h3>
              <p className="text-[10px] text-text-muted">{fixedLinks.dicas?.subtitle || "Aprenda com conteúdos práticos e links úteis"}</p>
            </div>
          </Link>
          
        </div>
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
