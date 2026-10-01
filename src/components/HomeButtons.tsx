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

function BannerButton({ href, isExternal, onClick, bannerUrl, fraseDestaque, title }: any) {
  const content = (
    <div className="flex flex-col gap-2 hover:scale-[1.02] transition-transform group">
      <img src={bannerUrl} alt={title} className="w-full h-auto rounded-2xl object-cover shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
      {fraseDestaque && (
        <div className="bg-gradient-to-r from-primary/90 to-primary text-background font-black text-center py-2.5 px-4 rounded-xl text-xs md:text-sm shadow-[0_0_20px_rgba(245,138,31,0.5)] border border-white/30 uppercase tracking-wider relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(245,138,31,0.8)] transition-shadow">
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          {fraseDestaque}
        </div>
      )}
    </div>
  );

  return isExternal ? (
    <a href={href} target="_blank" onClick={onClick} className="block w-full">{content}</a>
  ) : (
    <Link href={href} onClick={onClick} className="block w-full">{content}</Link>
  );
}

function FixedButton({ id, href, onClick, fixedLinks, wrapperClassName, iconWrapperClassName, icon: Icon, iconClassName, titleClassName, subtitleClassName, defaultTitle, defaultSubtitle, isExternal }: any) {
  const linkData = fixedLinks[id];
  if (linkData?.visible === false) return null;

  const bannerUrl = linkData?.bannerUrl;
  const fraseDestaque = linkData?.fraseDestaque;
  const title = linkData?.title || defaultTitle;

  if (bannerUrl) {
    return <BannerButton href={href} isExternal={isExternal} onClick={onClick} bannerUrl={bannerUrl} fraseDestaque={fraseDestaque} title={title} />;
  }

  const content = (
    <div className={wrapperClassName}>
      <div className={iconWrapperClassName}><Icon className={iconClassName} /></div>
      <div>
        <h3 className={titleClassName}>{title}</h3>
        <p className={subtitleClassName}>{linkData?.subtitle || defaultSubtitle}</p>
      </div>
    </div>
  );

  return isExternal ? (
    <a href={href} target="_blank" onClick={onClick} className="block w-full">{content}</a>
  ) : (
    <Link href={href} onClick={onClick} className="block w-full">{content}</Link>
  );
}

function CustomLinkButton({ link, onClick }: { link: any; onClick: () => void }) {
  if (link.visible === false) return null;

  const bannerUrl = link.bannerUrl;
  const fraseDestaque = link.fraseDestaque;

  if (bannerUrl) {
    return <BannerButton href={link.url} isExternal onClick={onClick} bannerUrl={bannerUrl} fraseDestaque={fraseDestaque} title={link.title} />;
  }

  return (
    <a href={link.url} target="_blank" onClick={onClick} className="bg-surface/40 hover:bg-surface/80 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform group">
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
        <p className="text-[10px] text-text-muted">{link.subtitle || 'Acessar link'}</p>
      </div>
    </a>
  );
}

export function HomeButtons({ config, fixedLinks }: { config: any; fixedLinks: any }) {
  const handleTrack = (eventName: string, alvo: string, url: string) => {
    trackEvent(eventName, { alvo, tipo: "botao", pagina: "home" });
  };

  const FIXED_IDS = ['tiktok', 'instagram', 'whatsapp', 'youtube', 'orcamento', 'siteOficial', 'sistemas', 'siteGenClone', 'github', 'projetos', 'dicas'];

  const BUTTON_CONFIGS: Record<string, any> = {
    tiktok: {
      href: config?.tiktokUrl || "#", isExternal: true, onClick: () => handleTrack("Contact", "TikTok", config?.tiktokUrl || "#"),
      wrapperClassName: "bg-[#111111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(255,255,255,0.05)]",
      iconWrapperClassName: "bg-white rounded-full p-1.5", icon: Music2, iconClassName: "w-5 h-5 text-black",
      titleClassName: "font-bold text-white text-sm", subtitleClassName: "text-[10px] text-gray-400",
      defaultTitle: "TikTok", defaultSubtitle: "Conteúdo Rápido"
    },
    instagram: {
      href: config?.instagramUrl || "#", isExternal: true, onClick: () => handleTrack("Contact", "Instagram", config?.instagramUrl || "#"),
      wrapperClassName: "bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(253,29,29,0.3)] border border-white/10",
      iconWrapperClassName: "bg-white rounded-full p-1.5", icon: Camera, iconClassName: "w-5 h-5 text-[#E1306C]",
      titleClassName: "font-bold text-white text-sm", subtitleClassName: "text-[10px] text-white/80",
      defaultTitle: "Instagram", defaultSubtitle: "Acompanhe meu dia a dia"
    },
    whatsapp: {
      href: config?.whatsappUrl || "#", isExternal: true, onClick: () => handleTrack("Contact", "WhatsApp", config?.whatsappUrl || "#"),
      wrapperClassName: "bg-[#25D366] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(37,211,102,0.3)] border border-white/10",
      iconWrapperClassName: "bg-white rounded-full p-1.5", icon: MessageCircle, iconClassName: "w-5 h-5 text-[#25D366]",
      titleClassName: "font-bold text-white text-sm", subtitleClassName: "text-[10px] text-white/90",
      defaultTitle: "Falar comigo no WhatsApp", defaultSubtitle: "Converse diretamente comigo"
    },
    youtube: {
      href: config?.youtubeUrl || "#", isExternal: true, onClick: () => handleTrack("Contact", "YouTube", config?.youtubeUrl || "#"),
      wrapperClassName: "bg-surface/40 hover:bg-surface/80 border border-primary/20 rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,0,0,0.15)] group",
      iconWrapperClassName: "bg-[#FF0000]/10 p-2 rounded-xl group-hover:bg-[#FF0000]/20 transition-colors", icon: Play, iconClassName: "w-5 h-5 text-[#FF0000]",
      titleClassName: "font-bold text-text group-hover:text-primary transition-colors text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "YouTube", defaultSubtitle: "Acompanhe vídeos exclusivos",
      condition: () => !!config?.youtubeUrl
    },
    orcamento: {
      href: config?.orcamentoUrl || "/orcamento", isExternal: false, onClick: () => handleTrack("Lead", "Orçamento", config?.orcamentoUrl || "/orcamento"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-gold rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-gold/10 p-2 rounded-xl group-hover:bg-gold/20 transition-colors", icon: Laptop, iconClassName: "w-5 h-5 text-gold",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "Orçamento para desenvolvimento de sistemas", defaultSubtitle: "Sites, sistemas, automações e soluções sob medida"
    },
    siteOficial: {
      href: config?.siteOficialUrl || "#", isExternal: true, onClick: () => handleTrack("Lead", "Site Oficial", config?.siteOficialUrl || "#"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#00A859] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-[#00A859]/10 p-2 rounded-xl group-hover:bg-[#00A859]/20 transition-colors", icon: Globe, iconClassName: "w-5 h-5 text-[#00A859]",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "Conhecer a FFR do Brasil", defaultSubtitle: "Acesse nosso site oficial"
    },
    sistemas: {
      href: config?.sistemasUrl || "/sistemas", isExternal: false, onClick: () => handleTrack("ViewContent", "Sistemas", config?.sistemasUrl || "/sistemas"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#8D6E63] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-[#8D6E63]/10 p-2 rounded-xl group-hover:bg-[#8D6E63]/20 transition-colors", icon: Briefcase, iconClassName: "w-5 h-5 text-[#8D6E63]",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "9 sistemas prontos para personalizar e revender", defaultSubtitle: "Só R$ 19,90 • 7 dias de garantia"
    },
    siteGenClone: {
      href: config?.siteGenUrl || "/projetos/sitegenclone", isExternal: false, onClick: () => handleTrack("ViewContent", "SiteGenClone", config?.siteGenUrl || "/projetos/sitegenclone"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#E91E63] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-[#E91E63]/10 p-2 rounded-xl group-hover:bg-[#E91E63]/20 transition-colors", icon: Copy, iconClassName: "w-5 h-5 text-[#E91E63]",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "SiteGenClone", defaultSubtitle: "Clonador de sites para projetos autorizados"
    },
    github: {
      href: config?.githubUrl || "/biblioteca", isExternal: false, onClick: () => handleTrack("ViewContent", "GitHub", config?.githubUrl || "/biblioteca"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#9E9E9E] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-[#9E9E9E]/10 p-2 rounded-xl group-hover:bg-[#9E9E9E]/20 transition-colors", icon: Code, iconClassName: "w-5 h-5 text-[#9E9E9E]",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "Repositórios GitHub Premium Free", defaultSubtitle: "Recursos gratuitos organizados por categoria"
    },
    projetos: {
      href: config?.projetosUrl || "/projetos", isExternal: false, onClick: () => handleTrack("ViewContent", "Projetos", config?.projetosUrl || "/projetos"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#4CAF50] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-[#4CAF50]/10 p-2 rounded-xl group-hover:bg-[#4CAF50]/20 transition-colors", icon: FolderOpen, iconClassName: "w-5 h-5 text-[#4CAF50]",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "Ver projetos desenvolvidos", defaultSubtitle: "Sistemas, produtos e projetos em evolução"
    },
    dicas: {
      href: config?.dicasUrl || "/biblioteca", isExternal: false, onClick: () => handleTrack("ViewContent", "Dicas", config?.dicasUrl || "/biblioteca"),
      wrapperClassName: "bg-surface border-y border-r border-primary/20 border-l-4 border-l-[#2196F3] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform hover:bg-surface/80 group",
      iconWrapperClassName: "bg-[#2196F3]/10 p-2 rounded-xl group-hover:bg-[#2196F3]/20 transition-colors", icon: Diamond, iconClassName: "w-5 h-5 text-[#2196F3]",
      titleClassName: "font-bold text-text text-sm", subtitleClassName: "text-[10px] text-text-muted",
      defaultTitle: "Dicas grátis de IA, automações e ferramentas", defaultSubtitle: "Aprenda com conteúdos práticos e links úteis"
    }
  };

  const customLinks: any[] = Array.isArray(config?.customLinks) ? config.customLinks : [];
  const currentOrder: (string | number)[] = fixedLinks?.order || FIXED_IDS;

  // Build a unified ordered list
  const allIds = [
    ...FIXED_IDS,
    ...customLinks.map((l: any) => l.id)
  ];

  const orderedIds = [
    ...currentOrder.filter(id => allIds.includes(id as any)),
    ...allIds.filter(id => !currentOrder.includes(id as any))
  ];

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
          <div className="block w-full">
            <input
              type="text"
              placeholder={fixedLinks.searchBox?.placeholder || "Pesquise por IA, agentes, SaaS, imagens..."}
              className="w-full mt-3 bg-background border border-primary/20 rounded-xl px-4 py-2.5 text-xs text-text outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-inner cursor-pointer pointer-events-none"
              readOnly
            />
          </div>
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

      {orderedIds.map((id) => {
        // Fixed button
        if (typeof id === 'string' && FIXED_IDS.includes(id)) {
          const btnConfig = BUTTON_CONFIGS[id];
          if (!btnConfig) return null;
          if (btnConfig.condition && !btnConfig.condition()) return null;
          return (
            <FixedButton
              key={id}
              id={id}
              fixedLinks={fixedLinks}
              {...btnConfig}
            />
          );
        }

        // Custom link button
        const customLink = customLinks.find((l: any) => String(l.id) === String(id));
        if (!customLink) return null;
        return (
          <CustomLinkButton
            key={customLink.id}
            link={customLink}
            onClick={() => handleTrack("Lead", `Custom - ${customLink.title}`, customLink.url)}
          />
        );
      })}

    </div>
  );
}
