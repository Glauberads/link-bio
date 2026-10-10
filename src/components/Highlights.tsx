"use client";

import { trackEvent } from "@/lib/tracking";
import { Laptop, Briefcase, Code, FolderOpen, Diamond, Music2, Camera, MessageCircle, Play } from "lucide-react";

export function Highlights({ fixedLinks }: { fixedLinks: any }) {
  // Configuração padrão dos destaques, ligada aos botões existentes
  const allHighlights = [
    { id: "orcamento", icon: Laptop, label: "Orçamento", color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
    { id: "sistemas", icon: Briefcase, label: "Sistemas", color: "text-[#8D6E63]", bg: "bg-[#8D6E63]/10", border: "border-[#8D6E63]/20" },
    { id: "siteGenClone", icon: Code, label: "SiteGenClone", color: "text-[#E91E63]", bg: "bg-[#E91E63]/10", border: "border-[#E91E63]/20" },
    { id: "projetos", icon: FolderOpen, label: "Projetos", color: "text-[#4CAF50]", bg: "bg-[#4CAF50]/10", border: "border-[#4CAF50]/20" },
    { id: "github", icon: Code, label: "GitHub", color: "text-[#9E9E9E]", bg: "bg-[#9E9E9E]/10", border: "border-[#9E9E9E]/20" },
    { id: "dicas", icon: Diamond, label: "Dicas IA", color: "text-[#2196F3]", bg: "bg-[#2196F3]/10", border: "border-[#2196F3]/20" },
  ];

  // Filtra os destaques para não mostrar se o botão foi oculto no Admin
  const highlights = allHighlights.filter(h => {
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
      {highlights.map((item) => (
        <button
          key={item.id}
          onClick={() => handleScroll(item.id, item.label)}
          className="flex flex-col items-center gap-2 group flex-shrink-0"
        >
          <div className={`w-[70px] h-[70px] rounded-full border-2 ${item.border} ${item.bg} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform shadow-lg`}>
            {/* Anel animado simulando stories */}
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent group-hover:border-primary/50 transition-colors" />
            <item.icon className={`w-7 h-7 ${item.color}`} />
          </div>
          <span className="text-[11px] font-bold text-text-muted group-hover:text-primary transition-colors tracking-wide">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}
