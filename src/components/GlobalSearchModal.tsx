"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FolderOpen, Briefcase, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

export function GlobalSearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery("");
      setResults([]);
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchSearch = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearch();
  }, [debouncedQuery]);

  if (!isOpen) return null;

  const getIconForType = (type: string) => {
    switch(type) {
      case 'biblioteca': return <FolderOpen className="w-5 h-5 text-[#2196F3]" />;
      case 'projetos': return <Briefcase className="w-5 h-5 text-[#4CAF50]" />;
      case 'sistemas': return <Bot className="w-5 h-5 text-[#9C27B0]" />;
      default: return <Search className="w-5 h-5 text-text-muted" />;
    }
  };

  const getLinkForType = (item: any) => {
    switch(item.type) {
      case 'biblioteca': return `/biblioteca`;
      case 'projetos': return `/projetos`;
      case 'sistemas': return `/sistemas`;
      default: return "#";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:px-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl bg-surface border border-primary/30 rounded-2xl shadow-[0_0_50px_rgba(245,138,31,0.15)] overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-4 fade-in duration-200">
        
        <div className="flex items-center px-4 py-3 border-b border-primary/20 bg-background/50">
          <Search className="w-6 h-6 text-primary mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar por IA, sistemas, conteúdos..."
            className="flex-1 bg-transparent border-none outline-none text-text text-lg placeholder:text-text-muted"
          />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5 text-text-muted hover:text-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 min-h-[100px]">
          {isLoading && (
            <div className="py-10 text-center text-text-muted flex flex-col items-center justify-center gap-2">
               <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
               <span className="text-xs">Buscando no GEDs Brasil...</span>
            </div>
          )}

          {!isLoading && query.trim().length >= 2 && results.length === 0 && (
            <div className="py-14 text-center text-text-muted text-sm">
              Nenhum resultado encontrado para "{query}"
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="py-2 flex flex-col gap-1">
              <div className="px-3 pb-2 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                Resultados
              </div>
              {results.map((item, idx) => (
                <Link
                  key={`${item.type}-${item.id}-${idx}`}
                  href={getLinkForType(item)}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors group"
                >
                  <div className="bg-background border border-primary/20 w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:border-primary/40 transition-colors shadow-inner">
                    {getIconForType(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-text font-bold text-sm truncate group-hover:text-primary transition-colors">{item.nome}</h4>
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-surface border border-white/5 text-text-muted uppercase tracking-wider">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-text-muted text-[11px] truncate mt-0.5">{item.descricao}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-12 flex flex-col items-center justify-center text-center opacity-50">
               <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 border border-primary/20 shadow-[0_0_15px_rgba(245,138,31,0.2)]">
                 <Search className="w-8 h-8 text-primary" />
               </div>
               <p className="text-text font-medium text-sm">O que você está procurando?</p>
               <p className="text-xs text-text-muted mt-1 max-w-[250px]">Busque por arquivos, ferramentas de Inteligência Artificial e projetos da base GEDs Brasil.</p>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-primary/20 bg-background/80 flex justify-between items-center text-[10px] text-text-muted">
          <div className="flex items-center gap-2">
            <span className="bg-surface border border-white/10 px-1.5 py-0.5 rounded font-mono shadow-inner text-text-muted/70">esc</span> para fechar
          </div>
          <div className="flex items-center gap-1 opacity-70">
            Pesquisa Global <span className="text-primary font-bold">GEDs Brasil</span>
          </div>
        </div>

      </div>
    </div>
  );
}
