"use client";
import { useState, useEffect } from "react";
import { Search, Library, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  type: string;
}

export default function BibliotecaPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(res => res.json())
      .then(data => {
        if (data.results) setResults(data.results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden py-20 px-4 flex flex-col items-center">
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="w-full max-w-4xl mb-12 text-center">
        <Library className="w-12 h-12 text-primary mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,138,31,0.6)]" />
        <h1 className="font-title text-4xl md:text-5xl font-bold text-text mb-4 italic">Biblioteca Premium</h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Explore nossos repositórios, sistemas, projetos e materiais exclusivos. Tudo centralizado e indexado para você.
        </p>
      </div>

      <div className="w-full max-w-2xl relative mb-12">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-primary" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="block w-full rounded-2xl border border-primary/40 bg-surface/80 backdrop-blur-xl py-5 pl-14 pr-6 text-lg text-text placeholder-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-[0_0_30px_rgba(245,138,31,0.15)]"
          placeholder="Busque por IA, agentes, SaaS, design..."
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {query.length >= 2 && !loading && results.length === 0 && (
        <div className="text-center text-text-muted mt-8">
          Nenhum resultado encontrado para &quot;{query}&quot;.
        </div>
      )}

      <div className="w-full max-w-4xl flex flex-col gap-4">
        {results.map((item) => (
          <Link href={`/${item.type}/${item.slug}`} key={item.id} className="group flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-surface border border-primary/20 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30 px-2 py-0.5 rounded-full bg-primary/10">
                  {item.type}
                </span>
                <h3 className="text-xl font-bold text-text group-hover:text-primary transition-colors">{item.nome}</h3>
              </div>
              <p className="text-sm text-text-muted">{item.descricao}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-primary mt-4 md:mt-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
          </Link>
        ))}
      </div>
    </main>
  );
}
