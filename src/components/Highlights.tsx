"use client";

import { trackEvent } from "@/lib/tracking";
import { Laptop, Briefcase, Code, FolderOpen, Diamond, Music2, Camera, MessageCircle, Play, Star, Heart, Zap, Globe, ShoppingCart, Video } from "lucide-react";

export const ICON_MAP: Record<string, any> = { Laptop, Briefcase, Code, FolderOpen, Diamond, Music2, Camera, MessageCircle, Play, Star, Heart, Zap, Globe, ShoppingCart, Video };

export function Highlights({ fixedLinks }: { fixedLinks: any }) {
  const DEFAULT_HIGHLIGHTS = [
    { id: "orcamento", iconName: 'Laptop', label: "Orçamento", color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
    { id: "sistemas", iconName: 'Briefcase', label: "Sistemas", color: "text-[#8D6E63]", bg: "bg-[#8D6E63]/10", border: "border-[#8D6E63]/20" },
    { id: "siteGenClone", iconName: 'Code', label: "SiteGenClone", color: "text-[#E91E63]", bg: "bg-[#E91E63]/10", border: "border-[#E91E63]/20" },
    { id: "projetos", iconName: 'FolderOpen', label: "Projetos", color: "text-[#4CAF50]", bg: "bg-[#4CAF50]/10", border: "border-[#4CAF50]/20" },
    { id: "github", iconName: 'Code', label: "GitHub", color: "text-[#9E9E9E]", bg: "bg-[#9E9E9E]/10", border: "border-[#9E9E9E]/20" },
    { id: "dicas", iconName: 'Diamond', label: "Dicas IA", color: "text-[#2196F3]", bg: "bg-[#2196F3]/10", border: "border-[#2196F3]/20" },
  ];

  const allHighlights = fixedLinks?.highlights || DEFAULT_HIGHLIGHTS;

  const highlights = allHighlights.filter((h: any) => {
     if (fixedLinks && fixedLinks[h.id] && fixedLinks[h.id].visible === false) return false;
     return true;
  });

  const handleScroll = (id: string, label: string) => {
    trackEvent("Click", { alvo: `Destaque - ${label}`, tipo: "highlight", pagina: "home" });
    const el = document.getElementById(`btn-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Efeito visual no botão ao rolar
      el.style.transition = "all 0.5s";
      el.style.transform = "scale(1.03)";
      el.style.boxShadow = "0 0 30px rgba(245,138,31,0.4)";
      setTimeout(() => {
        el.style.transform = "";
        el.style.boxShadow = "";
      }, 1000);
    }
  };

  if (highlights.length === 0) return null;

  return (
    <div className="w-full flex items-start gap-4 overflow-x-auto hide-scrollbar py-4 mb-2 px-1">
      {highlights.map((item: any, idx: number) => {
        const Icon = ICON_MAP[item.iconName] || ICON_MAP.Star;
        return (
          <button
            key={`${item.id}-${idx}`}
            onClick={() => handleScroll(item.id, item.label)}
            className="flex flex-col items-center gap-2 group flex-shrink-0"
          >
            <div className={`w-[70px] h-[70px] rounded-full border-2 ${item.border} ${item.bg} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform shadow-lg`}>
              {/* Anel animado simulando stories */}
              <div className="absolute inset-0 rounded-full border-[3px] border-transparent group-hover:border-primary/50 transition-colors z-20 pointer-events-none" />
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.label} className="w-[58px] h-[58px] rounded-full object-cover z-10" />
              ) : (
                <Icon className={`w-7 h-7 ${item.color} z-10`} />
              )}
            </div>
            <span className="text-[11px] font-bold text-text-muted group-hover:text-primary transition-colors tracking-wide">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
