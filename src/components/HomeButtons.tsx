"use client";

import Link from "next/link";
import { Search, Camera, MessageCircle, Laptop, Globe, Briefcase, Copy, Code, FolderOpen, Diamond, Music2, Play, Link as LinkIcon } from "lucide-react";
import { trackEvent } from "@/lib/tracking";

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

export function HomeButtons({ config, fixedLinks }: { config: any, fixedLinks: any }) {
  
  const handleTrack = (eventName: string, alvo: string, url: string) => {
    trackEvent(eventName, { alvo, tipo: "botao", pagina: "home" });
  };

  return (
    <div className="w-full flex flex-col gap-3 pb-20">
      
      {/* Caixa de Pesquisa */}
      <div 
        onClick={() => handleTrack("Search", "Pesquisa Home", "/biblioteca")}
        className="bg-surface/80 backdrop-blur-md rounded-3xl p-3 flex items-start border border-primary/30 shadow-[0_0_25px_rgba(0,0,0,0.5)] mb-8 transition-all hover:border-primary/50 hover:shadow-[0_0_30px_rgba(245,138,31,0.15)] cursor-pointer"
      >
        <div className="bg-[#004d40] w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,77,64,0.6)]">
           <Search className="w-5 h-5 text-[#00e676]" />
        </div>
        <div className="ml-4 flex-1 pr-2">
          <h3 className="font-bold text-text text-sm">{fixedLinks.searchBox?.title || "Pesquise no Conecta FFR"}</h3>
          <p className="text-[10px] text-text-muted mt-0.5">{fixedLinks.searchBox?.subtitle || "Encontre materiais, repositórios, sistemas, projetos e links."}</p>
          <Link href="/biblioteca" className="block w-full">
            <input 
              type="text" 
              placeholder={fixedLinks.searchBox?.placeholder || "Pesquise por IA, agentes, SaaS, imagens..."}
              className="w-full mt-3 bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-xs text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner cursor-pointer pointer-events-none" 
              readOnly
            />
          </Link>
          <p className="text-[9px] text-text-muted mt-2">{fixedLinks.searchBox?.footer || "Digite para pesquisar em todo o site."}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#FFF9C4]/10 to-transparent border border-[#FFF9C4]/20 rounded-2xl p-4 flex items-center gap-3">
        <SparklesIcon className="w-5 h-5 text-[#FFF59D] shrink-0" />
        <div>
          <h3 className="font-bold text-[#FFF59D] text-sm">Siga nas redes sociais</h3>
          <p className="text-[10px] text-text-muted">Conteúdo sobre tecnologia, projetos e IA</p>
        </div>
      </div>

      <a href={config?.tiktokUrl || "#"} onClick={() => handleTrack("Contact", "TikTok", config?.tiktokUrl || "#")} className="bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <div className="bg-white rounded-full p-1.5"><Music2 className="w-5 h-5 text-black" /></div>
        <div>
          <h3 className="font-bold text-white text-sm">{fixedLinks.tiktok?.title || "TikTok"}</h3>
          <p className="text-[10px] text-gray-400">{fixedLinks.tiktok?.subtitle || "Conteúdo Rápido"}</p>
        </div>
      </a>

      <a href={config?.instagramUrl || "#"} onClick={() => handleTrack("Contact", "Instagram", config?.instagramUrl || "#")} className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(253,29,29,0.3)] border border-white/10">
        <div className="bg-white rounded-full p-1.5"><Camera className="w-5 h-5 text-[#E1306C]" /></div>
        <div>
          <h3 className="font-bold text-white text-sm">{fixedLinks.instagram?.title || "Instagram"}</h3>
          <p className="text-[10px] text-white/80">{fixedLinks.instagram?.subtitle || "Acompanhe meu dia a dia"}</p>
        </div>
      </a>

      <a href={config?.whatsappUrl || "#"} onClick={() => handleTrack("Contact", "WhatsApp", config?.whatsappUrl || "#")} className="bg-[#25D366] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(37,211,102,0.3)] border border-white/10">
        <div className="bg-white rounded-full p-1.5"><MessageCircle className="w-5 h-5 text-[#25D366]" /></div>
        <div>
          <h3 className="font-bold text-white text-sm">{fixedLinks.whatsapp?.title || "Falar comigo no WhatsApp"}</h3>
          <p className="text-[10px] text-white/90">{fixedLinks.whatsapp?.subtitle || "Converse diretamente comigo"}</p>
        </div>
      </a>

      {config?.youtubeUrl && (
        <a href={config.youtubeUrl} target="_blank" onClick={() => handleTrack("Contact", "YouTube", config.youtubeUrl)} className="bg-surface/40 hover:bg-surface/80 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,0,0,0.15)] group">
          <div className="bg-[#FF0000]/10 p-2 rounded-xl group-hover:bg-[#FF0000]/20 transition-colors"><Play className="w-5 h-5 text-[#FF0000]" /></div>
          <div>
            <h3 className="font-bold text-text group-hover:text-primary transition-colors text-sm">{fixedLinks.youtube?.title || "YouTube"}</h3>
            <p className="text-[10px] text-text-muted">{fixedLinks.youtube?.subtitle || "Acompanhe vídeos exclusivos"}</p>
          </div>
        </a>
      )}

      {Array.isArray(config?.customLinks) && config.customLinks.map((link: any) => (
        <a key={link.id} href={link.url} target="_blank" onClick={() => handleTrack("Lead", `Custom Link - ${link.title}`, link.url)} className="bg-surface/40 hover:bg-surface/80 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform group">
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
        </a>
      ))}

      <Link href={config?.orcamentoUrl || "/orcamento"} onClick={() => handleTrack("Lead", "Orçamento", config?.orcamentoUrl || "/orcamento")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-gold rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-gold/10 p-2 rounded-xl group-hover:bg-gold/20 transition-colors"><Laptop className="w-5 h-5 text-gold" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.orcamento?.title || "Orçamento para desenvolvimento de sistemas"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.orcamento?.subtitle || "Sites, sistemas, automações e soluções sob medida"}</p>
        </div>
      </Link>

      <a href={config?.siteOficialUrl || "#"} onClick={() => handleTrack("Lead", "Site Oficial", config?.siteOficialUrl || "#")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#00A859] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-[#00A859]/10 p-2 rounded-xl group-hover:bg-[#00A859]/20 transition-colors"><Globe className="w-5 h-5 text-[#00A859]" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.siteOficial?.title || "Conhecer a FFR do Brasil"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.siteOficial?.subtitle || "Acesse nosso site oficial"}</p>
        </div>
      </a>

      <Link href={config?.sistemasUrl || "/sistemas"} onClick={() => handleTrack("ViewContent", "Sistemas", config?.sistemasUrl || "/sistemas")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#8D6E63] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-[#8D6E63]/10 p-2 rounded-xl group-hover:bg-[#8D6E63]/20 transition-colors"><Briefcase className="w-5 h-5 text-[#8D6E63]" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.sistemas?.title || "9 sistemas prontos para personalizar e revender"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.sistemas?.subtitle || "Só R$ 19,90 • 7 dias de garantia"}</p>
        </div>
      </Link>

      <Link href={config?.siteGenUrl || "/projetos/sitegenclone"} onClick={() => handleTrack("ViewContent", "SiteGenClone", config?.siteGenUrl || "/projetos/sitegenclone")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#E91E63] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-[#E91E63]/10 p-2 rounded-xl group-hover:bg-[#E91E63]/20 transition-colors"><Copy className="w-5 h-5 text-[#E91E63]" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.siteGenClone?.title || "SiteGenClone"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.siteGenClone?.subtitle || "Clonador de sites para projetos autorizados"}</p>
        </div>
      </Link>

      <Link href={config?.githubUrl || "/biblioteca"} onClick={() => handleTrack("ViewContent", "GitHub", config?.githubUrl || "/biblioteca")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#9E9E9E] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-[#9E9E9E]/10 p-2 rounded-xl group-hover:bg-[#9E9E9E]/20 transition-colors"><Code className="w-5 h-5 text-[#9E9E9E]" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.github?.title || "Repositórios GitHub Premium Free"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.github?.subtitle || "Recursos gratuitos organizados por categoria"}</p>
        </div>
      </Link>

      <Link href={config?.projetosUrl || "/projetos"} onClick={() => handleTrack("ViewContent", "Projetos", config?.projetosUrl || "/projetos")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#4CAF50] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-[#4CAF50]/10 p-2 rounded-xl group-hover:bg-[#4CAF50]/20 transition-colors"><FolderOpen className="w-5 h-5 text-[#4CAF50]" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.projetos?.title || "Ver projetos desenvolvidos"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.projetos?.subtitle || "Sistemas, produtos e projetos em evolução"}</p>
        </div>
      </Link>

      <Link href={config?.dicasUrl || "/biblioteca"} onClick={() => handleTrack("ViewContent", "Dicas", config?.dicasUrl || "/biblioteca")} className="bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#2196F3] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group">
        <div className="bg-[#2196F3]/10 p-2 rounded-xl group-hover:bg-[#2196F3]/20 transition-colors"><Diamond className="w-5 h-5 text-[#2196F3]" /></div>
        <div>
          <h3 className="font-bold text-text text-sm">{fixedLinks.dicas?.title || "Dicas grátis de IA, automações e ferramentas"}</h3>
          <p className="text-[10px] text-text-muted">{fixedLinks.dicas?.subtitle || "Aprenda com conteúdos práticos e links úteis"}</p>
        </div>
      </Link>
      
    </div>
  );
}
