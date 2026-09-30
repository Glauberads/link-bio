"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Plus, Edit2, Trash2, Link as LinkIcon, Star, Eye, EyeOff } from "lucide-react";

type Resource = {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tags: string[];
  url: string;
  destaque: boolean;
  ativo: boolean;
  createdAt: string;
};

export default function ConteudoPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "Geral",
    tags: "",
    url: "",
    destaque: false,
    ativo: true,
  });

  const fetchResources = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      setResources(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openNew = () => {
    setFormData({
      titulo: "",
      descricao: "",
      categoria: "Geral",
      tags: "",
      url: "",
      destaque: false,
      ativo: true,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: Resource) => {
    setFormData({
      titulo: item.titulo,
      descricao: item.descricao,
      categoria: item.categoria,
      tags: item.tags.join(", "),
      url: item.url,
      destaque: item.destaque,
      ativo: item.ativo,
    });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const saveResource = async () => {
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/resources/${editingId}` : "/api/resources";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      setIsModalOpen(false);
      fetchResources();
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar recurso.");
    }
  };

  const deleteResource = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await fetch(`/api/resources/${id}`, { method: "DELETE" });
      fetchResources();
    } catch (e) {
      console.error(e);
      alert("Erro ao excluir recurso.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text">Gestão de Biblioteca</h2>
          <p className="text-text-muted mt-1">Gerencie os repositórios, sistemas e conteúdos.</p>
        </div>
        <Button onClick={openNew} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Novo Recurso
        </Button>
      </div>

      {loading ? (
        <div className="text-text-muted py-10 text-center">Carregando...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-primary/20">
          <span className="text-4xl block mb-4">📚</span>
          <h3 className="text-xl font-bold text-text">Nenhum recurso cadastrado</h3>
          <p className="text-text-muted mb-6">Comece adicionando seu primeiro conteúdo para a biblioteca.</p>
          <Button onClick={openNew}>Adicionar Agora</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {resources.map(item => (
            <div key={item.id} className={`bg-surface p-5 rounded-2xl border ${item.destaque ? 'border-gold shadow-[0_0_15px_rgba(255,185,46,0.1)]' : 'border-primary/20'} flex items-start gap-4 transition-all hover:border-primary/50`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-text text-lg">{item.titulo}</h3>
                  {item.destaque && <span className="bg-gold/20 text-gold text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-gold/30 flex items-center gap-1"><Star className="w-3 h-3" /> Destaque</span>}
                  {!item.ativo && <span className="bg-red-500/20 text-red-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-red-500/30 flex items-center gap-1"><EyeOff className="w-3 h-3" /> Oculto</span>}
                </div>
                <p className="text-sm text-text-muted mb-3">{item.descricao}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded">{item.categoria}</span>
                  <div className="flex gap-2 text-text-muted">
                    {item.tags.map(t => <span key={t}>#{t}</span>)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a href={item.url} target="_blank" className="p-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl transition-colors" title="Acessar Link">
                  <LinkIcon className="w-4 h-4" />
                </a>
                <button onClick={() => openEdit(item)} className="p-2 bg-surface text-text hover:bg-white/5 rounded-xl transition-colors border border-white/10" title="Editar">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => deleteResource(item.id)} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors border border-red-500/20" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-xl rounded-2xl border border-primary/30 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-text mb-6">{editingId ? "Editar Recurso" : "Novo Recurso"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors" placeholder="Ex: Sistema de Gestão" />
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Descrição</label>
                <textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Breve explicação do que se trata..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Categoria</label>
                  <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors">
                    <option value="Sistemas">Sistemas</option>
                    <option value="Templates">Templates</option>
                    <option value="Ferramentas">Ferramentas</option>
                    <option value="Conteúdo">Conteúdo</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Tags (separadas por vírgula)</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors" placeholder="react, api, web" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">URL de Destino</label>
                <input type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors" placeholder="https://" />
              </div>
              
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.destaque} onChange={e => setFormData({...formData, destaque: e.target.checked})} className="accent-gold w-4 h-4 rounded" />
                  <span className="text-sm text-text font-medium flex items-center gap-1"><Star className="w-4 h-4 text-gold" /> Marcar como Destaque</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} className="accent-primary w-4 h-4 rounded" />
                  <span className="text-sm text-text font-medium flex items-center gap-1"><Eye className="w-4 h-4 text-primary" /> Visível ao público</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-primary/20">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button onClick={saveResource}>Salvar Recurso</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
