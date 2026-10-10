"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Pencil, Save, X, Eye, EyeOff, Image as ImageIcon, ArrowUp, ArrowDown } from "lucide-react";

export default function PersonalizacaoPage() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [characterFile, setCharacterFile] = useState<File | null>(null);
  const [customLinks, setCustomLinks] = useState<any[]>([]);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [editingLink, setEditingLink] = useState<string | number | null>(null);
  const [editingHighlight, setEditingHighlight] = useState<number | null>(null);

  const DEFAULT_HIGHLIGHTS = [
    { id: "orcamento", iconName: 'Laptop', label: "Orçamento", color: "text-gold", bg: "bg-gold/10", border: "border-gold/20" },
    { id: "sistemas", iconName: 'Briefcase', label: "Sistemas", color: "text-[#8D6E63]", bg: "bg-[#8D6E63]/10", border: "border-[#8D6E63]/20" },
    { id: "siteGenClone", iconName: 'Code', label: "SiteGenClone", color: "text-[#E91E63]", bg: "bg-[#E91E63]/10", border: "border-[#E91E63]/20" },
    { id: "projetos", iconName: 'FolderOpen', label: "Projetos", color: "text-[#4CAF50]", bg: "bg-[#4CAF50]/10", border: "border-[#4CAF50]/20" },
    { id: "github", iconName: 'Code', label: "GitHub", color: "text-[#9E9E9E]", bg: "bg-[#9E9E9E]/10", border: "border-[#9E9E9E]/20" },
    { id: "dicas", iconName: 'Diamond', label: "Dicas IA", color: "text-[#2196F3]", bg: "bg-[#2196F3]/10", border: "border-[#2196F3]/20" },
  ];

  const COLOR_PRESETS = [
    { name: 'Ouro', color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
    { name: 'Marrom', color: 'text-[#8D6E63]', bg: 'bg-[#8D6E63]/10', border: 'border-[#8D6E63]/20' },
    { name: 'Rosa', color: 'text-[#E91E63]', bg: 'bg-[#E91E63]/10', border: 'border-[#E91E63]/20' },
    { name: 'Verde', color: 'text-[#4CAF50]', bg: 'bg-[#4CAF50]/10', border: 'border-[#4CAF50]/20' },
    { name: 'Cinza', color: 'text-[#9E9E9E]', bg: 'bg-[#9E9E9E]/10', border: 'border-[#9E9E9E]/20' },
    { name: 'Azul', color: 'text-[#2196F3]', bg: 'bg-[#2196F3]/10', border: 'border-[#2196F3]/20' },
    { name: 'Roxo', color: 'text-[#9C27B0]', bg: 'bg-[#9C27B0]/10', border: 'border-[#9C27B0]/20' },
    { name: 'Vermelho', color: 'text-[#F44336]', bg: 'bg-[#F44336]/10', border: 'border-[#F44336]/20' },
    { name: 'Primária (Laranja)', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }
  ];
  
  const ICON_OPTIONS = ['Laptop', 'Briefcase', 'Code', 'FolderOpen', 'Diamond', 'Music2', 'Camera', 'MessageCircle', 'Play', 'Star', 'Heart', 'Zap', 'Globe', 'ShoppingCart', 'Video'];

  const DEFAULT_FIXED_LINKS = [
    { id: 'tiktok', defaultTitle: 'TikTok', defaultSubtitle: 'Conteúdo Rápido', urlField: 'tiktokUrl' },
    { id: 'instagram', defaultTitle: 'Instagram', defaultSubtitle: 'Acompanhe meu dia a dia', urlField: 'instagramUrl' },
    { id: 'whatsapp', defaultTitle: 'Falar comigo no WhatsApp', defaultSubtitle: 'Converse diretamente comigo', urlField: 'whatsappUrl' },
    { id: 'youtube', defaultTitle: 'YouTube', defaultSubtitle: 'Acompanhe vídeos exclusivos', urlField: 'youtubeUrl' },
    { id: 'orcamento', defaultTitle: 'Orçamento para sistemas', defaultSubtitle: 'Sites e soluções sob medida', urlField: 'orcamentoUrl' },
    { id: 'siteOficial', defaultTitle: 'Conhecer a FFR do Brasil', defaultSubtitle: 'Acesse nosso site oficial', urlField: 'siteOficialUrl' },
    { id: 'sistemas', defaultTitle: '9 sistemas prontos', defaultSubtitle: 'Só R$ 19,90 • 7 dias de garantia', urlField: 'sistemasUrl' },
    { id: 'siteGenClone', defaultTitle: 'SiteGenClone', defaultSubtitle: 'Clonador de sites', urlField: 'siteGenUrl' },
    { id: 'github', defaultTitle: 'Repositórios GitHub', defaultSubtitle: 'Recursos gratuitos', urlField: 'githubUrl' },
    { id: 'projetos', defaultTitle: 'Ver projetos desenvolvidos', defaultSubtitle: 'Sistemas e produtos', urlField: 'projetosUrl' },
    { id: 'dicas', defaultTitle: 'Dicas grátis de IA', defaultSubtitle: 'Aprenda com conteúdos práticos', urlField: 'dicasUrl' },
  ];

  const updateFixedLink = (id: string, field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      fixedLinksConfig: {
        ...(prev.fixedLinksConfig || {}),
        [id]: {
          ...(prev.fixedLinksConfig?.[id] || {}),
          [field]: value
        }
      }
    }));
  };

  const updateFixedOrder = (newOrder: (string | number)[]) => {
    setConfig((prev: any) => ({
      ...prev,
      fixedLinksConfig: {
        ...(prev.fixedLinksConfig || {}),
        order: newOrder
      }
    }));
  };

  const updateCustomLink = (id: number, field: string, value: any) => {
    setCustomLinks((prev) => prev.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setCustomLinks(data.customLinks || []);
        setHighlights(data.fixedLinksConfig?.highlights || DEFAULT_HIGHLIGHTS);
        setLoading(false);
      });
  }, []);

  const handleUpload = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const { error } = await res.json();
      alert(`Erro no upload: ${error}\n\nCertifique-se de que você criou um Storage Bucket público chamado "assets" no seu Supabase!`);
      throw new Error("Upload failed");
    }
    const data = await res.json();
    return data.url;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updatedConfig = { 
        ...config, 
        customLinks, 
        fixedLinksConfig: { ...(config.fixedLinksConfig || {}), highlights } 
      };

      if (logoFile) {
        const url = await handleUpload(logoFile, 'logo');
        updatedConfig.logoUrl = url;
      }
      if (characterFile) {
        const url = await handleUpload(characterFile, 'character');
        updatedConfig.characterUrl = url;
      }

      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedConfig),
      });

      setConfig(updatedConfig);
      setLogoFile(null);
      setCharacterFile(null);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-text-muted">Carregando...</div>;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <h2 className="text-3xl font-bold text-text mb-2">Personalização da Home</h2>
      <p className="text-text-muted mb-8">Altere os links dos botões e as imagens da sua página pública.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold text-text mb-4">Mídias (Upload p/ Supabase)</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-muted mb-3">Sua Logomarca (Header)</label>
              <div className="flex items-center gap-4">
                {config.logoUrl && !logoFile && <img src={config.logoUrl} alt="Logo" className="w-16 h-16 rounded-full object-cover border border-primary/30" />}
                {logoFile && <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-primary text-xs">Novo</div>}
                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-3">Seu Personagem (Hero Mobile/Desktop)</label>
              <div className="flex flex-col gap-4">
                {config.characterUrl && !characterFile && (
                  config.characterUrl.endsWith('.mp4') ? (
                    <video src={config.characterUrl} autoPlay loop muted playsInline className="w-32 h-auto rounded-xl object-contain bg-background/50 p-2 border border-primary/20 pointer-events-none" />
                  ) : (
                    <img src={config.characterUrl} alt="Character" className="w-32 h-auto rounded-xl object-contain bg-background/50 p-2 border border-primary/20" />
                  )
                )}
                {characterFile && <div className="text-sm text-primary">Novo arquivo selecionado: {characterFile.name}</div>}
                <input type="file" accept="image/*" onChange={e => setCharacterFile(e.target.files?.[0] || null)} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold text-text mb-4">Textos do Cabeçalho</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Subtítulo (Verde)</label>
                <input type="text" value={config.siteTitle || ''} onChange={e => setConfig({...config, siteTitle: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="FFR DO BRASIL TECHNOLOGY" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Nome Principal (Branco)</label>
                <input type="text" value={config.siteSubtitle || ''} onChange={e => setConfig({...config, siteSubtitle: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="Flávio Rodrigues" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Descrição</label>
                <textarea value={config.siteDescription || ''} onChange={e => setConfig({...config, siteDescription: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Soluções digitais para empresas..." />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold text-text mb-4">Caixa de Pesquisa</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Título da Busca</label>
                <input type="text" value={config.fixedLinksConfig?.searchBox?.title || ''} onChange={e => updateFixedLink('searchBox', 'title', e.target.value)} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="Pesquise no Conecta FFR" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Subtítulo</label>
                <input type="text" value={config.fixedLinksConfig?.searchBox?.subtitle || ''} onChange={e => updateFixedLink('searchBox', 'subtitle', e.target.value)} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="Encontre materiais, repositórios..." />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Placeholder (Texto dentro do campo)</label>
                <input type="text" value={config.fixedLinksConfig?.searchBox?.placeholder || ''} onChange={e => updateFixedLink('searchBox', 'placeholder', e.target.value)} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="Pesquise por IA, agentes, SaaS..." />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Rodapé (Texto abaixo do campo)</label>
                <input type="text" value={config.fixedLinksConfig?.searchBox?.footer || ''} onChange={e => updateFixedLink('searchBox', 'footer', e.target.value)} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="Digite para pesquisar em todo o site." />
              </div>
            </div>
          </div>

          <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">Todos os Botões</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                const newId = Date.now();
                setCustomLinks([...customLinks, { id: newId, title: 'Novo Botão', url: '' }]);
                const currentOrder = config.fixedLinksConfig?.order || DEFAULT_FIXED_LINKS.map(l => l.id);
                updateFixedOrder([newId, ...currentOrder]); // Adiciona no topo por padrao
              }} className="text-xs py-1 h-auto bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
                + Adicionar Botão
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="space-y-3">
                {(() => {
                  const defaultOrder = DEFAULT_FIXED_LINKS.map(l => l.id);
                  const currentOrder = config.fixedLinksConfig?.order || defaultOrder;
                  
                  const allLinks = [
                    ...DEFAULT_FIXED_LINKS.map(l => ({ ...l, type: 'fixed' as const })),
                    ...customLinks.map(l => ({ ...l, type: 'custom' as const }))
                  ];

                  const orderedLinks = allLinks.sort((a, b) => {
                    let idxA = currentOrder.indexOf(a.id);
                    let idxB = currentOrder.indexOf(b.id);
                    if (idxA === -1) idxA = 999;
                    if (idxB === -1) idxB = 999;
                    return idxA - idxB;
                  });

                  return orderedLinks.map((link: any, index: number) => {
                    const isEditing = editingLink === link.id;
                    const isFixed = link.type === 'fixed';
                    
                    const currentTitle = isFixed 
                      ? (config.fixedLinksConfig?.[link.id]?.title || link.defaultTitle)
                      : link.title;
                    const currentSubtitle = isFixed 
                      ? (config.fixedLinksConfig?.[link.id]?.subtitle || link.defaultSubtitle)
                      : (link.subtitle || '');
                    const currentUrl = isFixed ? (config[link.urlField] || '') : link.url;
                    const currentVisible = isFixed ? (config.fixedLinksConfig?.[link.id]?.visible !== false) : (link.visible !== false);
                    const currentBannerUrl = isFixed ? config.fixedLinksConfig?.[link.id]?.bannerUrl : link.bannerUrl;
                    const currentFrase = isFixed ? config.fixedLinksConfig?.[link.id]?.fraseDestaque : link.fraseDestaque;

                    return (
                      <div key={link.id} className="bg-background border border-primary/20 p-3 rounded-xl flex gap-2">
                        <div className="flex flex-col gap-1 items-center justify-center border-r border-primary/20 pr-2">
                          <button onClick={() => {
                            if (index > 0) {
                              const newOrder = orderedLinks.map(l => l.id);
                              [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                              updateFixedOrder(newOrder);
                            }
                          }} className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted" disabled={index === 0}>
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            if (index < orderedLinks.length - 1) {
                              const newOrder = orderedLinks.map(l => l.id);
                              [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
                              updateFixedOrder(newOrder);
                            }
                          }} className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted" disabled={index === orderedLinks.length - 1}>
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-primary">Editando: {link.defaultTitle || 'Botão Personalizado'}</span>
                                <div className="flex gap-2">
                                  {!isFixed && (
                                    <button onClick={() => {
                                      setCustomLinks(customLinks.filter(l => l.id !== link.id));
                                    }} className="text-red-500 hover:text-white p-1 bg-red-500/10 hover:bg-red-500 rounded text-xs px-2">Excluir</button>
                                  )}
                                  <button onClick={() => setEditingLink(null)} className="text-text-muted hover:text-white p-1 bg-surface rounded"><Save className="w-4 h-4" /></button>
                                </div>
                              </div>
                              
                              {!isFixed && (
                                <div className="flex gap-4 items-center">
                                  {link.iconUrl ? (
                                    <img src={link.iconUrl} className="w-10 h-10 rounded-xl object-cover border border-primary/20" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-xl bg-surface/50 border border-primary/20 flex items-center justify-center text-[8px] text-text-muted">Ícone</div>
                                  )}
                                  <label className="cursor-pointer text-xs text-primary hover:underline">
                                    Subir Ícone
                                    <input type="file" accept="image/*,video/mp4" className="hidden" onChange={async e => {
                                      if (e.target.files?.[0]) {
                                        const url = await handleUpload(e.target.files[0], 'btn-icon');
                                        updateCustomLink(link.id, 'iconUrl', url);
                                      }
                                    }} />
                                  </label>
                                </div>
                              )}

                              <div>
                                <label className="text-[10px] text-text-muted uppercase">Título</label>
                                <input type="text" value={currentTitle} onChange={e => {
                                  if (isFixed) updateFixedLink(link.id, 'title', e.target.value);
                                  else updateCustomLink(link.id, 'title', e.target.value);
                                }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                              </div>
                              <div>
                                <label className="text-[10px] text-text-muted uppercase">Subtítulo</label>
                                <input type="text" value={currentSubtitle} onChange={e => {
                                  if (isFixed) updateFixedLink(link.id, 'subtitle', e.target.value);
                                  else updateCustomLink(link.id, 'subtitle', e.target.value);
                                }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                              </div>
                              <div>
                                <label className="text-[10px] text-text-muted uppercase">URL de Destino</label>
                                <input type="url" value={currentUrl} onChange={e => {
                                  if (isFixed) setConfig({...config, [link.urlField]: e.target.value});
                                  else updateCustomLink(link.id, 'url', e.target.value);
                                }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                              </div>
                              <div>
                                <label className="text-[10px] text-text-muted uppercase mb-1 block">Banner do Botão (Imagem)</label>
                                <div className="flex gap-2">
                                  <input 
                                    type="file" accept="image/*,video/mp4" className="hidden" id={`banner-${link.id}`}
                                    onChange={async (e) => {
                                      if (e.target.files?.[0]) {
                                        const url = await handleUpload(e.target.files[0], `banner_${link.id}`);
                                        if (isFixed) updateFixedLink(link.id, 'bannerUrl', url);
                                        else updateCustomLink(link.id, 'bannerUrl', url);
                                      }
                                    }}
                                  />
                                  <label htmlFor={`banner-${link.id}`} className="flex-1 bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs cursor-pointer flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                                    <ImageIcon className="w-4 h-4" /> Upload Banner
                                  </label>
                                  {currentBannerUrl && (
                                    <button onClick={() => {
                                      if (isFixed) updateFixedLink(link.id, 'bannerUrl', null);
                                      else updateCustomLink(link.id, 'bannerUrl', null);
                                    }} className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20">
                                      <X className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                                {currentBannerUrl && (
                                  <img src={currentBannerUrl} alt="Banner" className="mt-2 w-full h-12 object-cover rounded-md border border-primary/20" />
                                )}
                              </div>
                              <div>
                                <label className="text-[10px] text-text-muted uppercase mb-1 block">Frase de Destaque (Abaixo do Banner)</label>
                                <input type="text" value={currentFrase || ''} onChange={e => {
                                  if (isFixed) updateFixedLink(link.id, 'fraseDestaque', e.target.value);
                                  else updateCustomLink(link.id, 'fraseDestaque', e.target.value);
                                }} placeholder="Ex: ÚLTIMAS VAGAS DISPONÍVEIS!" className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center group">
                              <div>
                                <h5 className="text-sm font-bold text-text group-hover:text-primary transition-colors flex items-center gap-2">
                                  {currentTitle || 'Sem Título'}
                                  {!isFixed && <span className="px-1.5 py-0.5 rounded text-[8px] bg-primary/20 text-primary font-normal">Personalizado</span>}
                                  {!currentVisible && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-red-500/20 text-red-400 font-normal">Oculto</span>
                                  )}
                                  {currentBannerUrl && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-primary/20 text-primary font-normal flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Banner</span>
                                  )}
                                </h5>
                                <p className="text-[10px] text-text-muted truncate max-w-[200px]">{currentSubtitle}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button 
                                  onClick={() => {
                                    if (isFixed) updateFixedLink(link.id, 'visible', !currentVisible);
                                    else updateCustomLink(link.id, 'visible', !currentVisible);
                                  }} 
                                  className={`p-2 bg-surface hover:bg-primary/20 rounded-lg transition-colors border border-primary/20 ${!currentVisible ? 'text-red-400' : 'text-primary'}`}
                                  title={!currentVisible ? 'Mostrar Botão' : 'Ocultar Botão'}
                                >
                                  {!currentVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button onClick={() => setEditingLink(link.id)} className="p-2 bg-surface hover:bg-primary/20 rounded-lg text-text-muted hover:text-primary transition-colors border border-primary/20">
                                  <Pencil className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">Destaques (Home)</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => {
                setHighlights([...highlights, { id: '', iconName: 'Star', label: 'Novo Destaque', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' }]);
              }} className="text-xs py-1 h-auto bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
                + Adicionar Destaque
              </Button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3">
                {highlights.map((h, index) => {
                  const isEditing = editingHighlight === index;
                  
                  return (
                    <div key={index} className="bg-background border border-primary/20 p-3 rounded-xl flex gap-2">
                      <div className="flex flex-col gap-1 items-center justify-center border-r border-primary/20 pr-2">
                        <button onClick={() => {
                          if (index > 0) {
                            const newH = [...highlights];
                            [newH[index - 1], newH[index]] = [newH[index], newH[index - 1]];
                            setHighlights(newH);
                          }
                        }} className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted" disabled={index === 0}>
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => {
                          if (index < highlights.length - 1) {
                            const newH = [...highlights];
                            [newH[index + 1], newH[index]] = [newH[index], newH[index + 1]];
                            setHighlights(newH);
                          }
                        }} className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted" disabled={index === highlights.length - 1}>
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold text-primary">Editando Destaque</span>
                              <div className="flex gap-2">
                                <button onClick={() => {
                                  setHighlights(highlights.filter((_, i) => i !== index));
                                }} className="text-red-500 hover:text-white p-1 bg-red-500/10 hover:bg-red-500 rounded text-xs px-2">Excluir</button>
                                <button onClick={() => setEditingHighlight(null)} className="text-text-muted hover:text-white p-1 bg-surface rounded"><Save className="w-4 h-4" /></button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-[10px] text-text-muted uppercase">Nome do Destaque</label>
                              <input type="text" value={h.label} onChange={e => {
                                const newH = [...highlights];
                                newH[index].label = e.target.value;
                                setHighlights(newH);
                              }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                            </div>
                            
                            <div>
                              <label className="text-[10px] text-text-muted uppercase">Aponta para o Botão (ID)</label>
                              <select value={h.id} onChange={e => {
                                const newH = [...highlights];
                                newH[index].id = e.target.value;
                                setHighlights(newH);
                              }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs outline-none">
                                <option value="">Selecione um botão</option>
                                {DEFAULT_FIXED_LINKS.map(l => (
                                  <option key={l.id} value={l.id}>{config.fixedLinksConfig?.[l.id]?.title || l.defaultTitle}</option>
                                ))}
                                {customLinks.map(l => (
                                  <option key={l.id} value={l.id}>{l.title}</option>
                                ))}
                              </select>
                            </div>
                            
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <label className="text-[10px] text-text-muted uppercase">Cor</label>
                                <select value={COLOR_PRESETS.find(c => c.color === h.color)?.name || 'Primária (Laranja)'} onChange={e => {
                                  const preset = COLOR_PRESETS.find(c => c.name === e.target.value);
                                  if (preset) {
                                    const newH = [...highlights];
                                    newH[index].color = preset.color;
                                    newH[index].bg = preset.bg;
                                    newH[index].border = preset.border;
                                    setHighlights(newH);
                                  }
                                }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs outline-none">
                                  {COLOR_PRESETS.map(c => (
                                    <option key={c.name} value={c.name}>{c.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex-1">
                                <label className="text-[10px] text-text-muted uppercase">Ícone (Lucide)</label>
                                <select value={h.iconName} onChange={e => {
                                  const newH = [...highlights];
                                  newH[index].iconName = e.target.value;
                                  setHighlights(newH);
                                }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs outline-none">
                                  {ICON_OPTIONS.map(icon => (
                                    <option key={icon} value={icon}>{icon}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="mt-3 border-t border-primary/10 pt-3">
                              <label className="text-[10px] text-text-muted uppercase mb-1 block">Imagem do Destaque (Opcional, substitui o ícone)</label>
                              <div className="flex gap-2 items-center">
                                {h.imageUrl ? (
                                  <div className="relative">
                                    <img src={h.imageUrl} className="w-10 h-10 rounded-full object-cover border border-primary/30" />
                                    <button onClick={() => {
                                      const newH = [...highlights];
                                      newH[index].imageUrl = null;
                                      setHighlights(newH);
                                    }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">×</button>
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-surface/50 border border-primary/20 flex items-center justify-center text-[8px] text-text-muted text-center leading-tight">Sem<br/>Img</div>
                                )}
                                <label className="flex-1 bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs cursor-pointer flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                                  <ImageIcon className="w-4 h-4" /> Upload de Imagem
                                  <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                    if (e.target.files?.[0]) {
                                      try {
                                        const url = await handleUpload(e.target.files[0], `highlight_${Date.now()}`);
                                        const newH = [...highlights];
                                        newH[index].imageUrl = url;
                                        setHighlights(newH);
                                      } catch (err) { }
                                    }
                                  }} />
                                </label>
                              </div>
                              <p className="text-[9px] text-primary/70 mt-2 font-medium">💡 Proporção recomendada: 1:1 (Quadrada). Tamanho ideal: 200x200px.</p>
                            </div>
                            
                          </div>
                        ) : (
                          <div className="flex justify-between items-center group">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full border-2 ${h.border} ${h.bg} flex items-center justify-center overflow-hidden`}>
                                {h.imageUrl ? (
                                  <img src={h.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <div className={`w-3 h-3 rounded-full bg-current ${h.color} opacity-80`} />
                                )}
                              </div>
                              <div>
                                <h5 className="text-sm font-bold text-text group-hover:text-primary transition-colors flex items-center gap-2">
                                  {h.label}
                                  {h.visible === false && (
                                    <span className="px-1.5 py-0.5 rounded text-[8px] bg-red-500/20 text-red-400 font-normal">Oculto</span>
                                  )}
                                </h5>
                                <p className="text-[10px] text-text-muted truncate">Linka para: {h.id || 'Nenhum'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  const newH = [...highlights];
                                  newH[index].visible = h.visible === false ? true : false;
                                  setHighlights(newH);
                                }} 
                                className={`p-2 bg-surface hover:bg-primary/20 rounded-lg transition-colors border border-primary/20 ${h.visible === false ? 'text-red-400' : 'text-primary'}`}
                                title={h.visible === false ? 'Mostrar Destaque' : 'Ocultar Destaque'}
                              >
                                {h.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button onClick={() => setEditingHighlight(index)} className="p-2 bg-surface hover:bg-primary/20 rounded-lg text-text-muted hover:text-primary transition-colors border border-primary/20">
                                <Pencil className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <h3 className="text-xl font-bold text-text mb-4">SEO e Compartilhamento</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Título do Site (Aparece na aba do navegador e no Google)</label>
                <input type="text" value={config.seoTitle || ''} onChange={e => setConfig({...config, seoTitle: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors" placeholder="G-ADS BRASIL" />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider">Descrição do Site (Resumo para o Google/WhatsApp)</label>
                <textarea value={config.seoDescription || ''} onChange={e => setConfig({...config, seoDescription: e.target.value})} className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text mt-1 text-sm outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Transformo ideias em app todos os dias..." />
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">Favicon (Ícone da aba do navegador)</label>
                <div className="flex items-center gap-4">
                  {config.faviconUrl && <img src={config.faviconUrl} alt="Favicon" className="w-8 h-8 rounded bg-white p-1" />}
                  <input type="file" accept="image/png, image/jpeg, image/x-icon, image/webp" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const url = await handleUpload(file, 'favicon');
                        setConfig({...config, faviconUrl: url});
                      } catch (err) { }
                    }
                  }} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2 block">Imagem de Compartilhamento (Aparece ao enviar link no WhatsApp)</label>
                <div className="flex items-center gap-4">
                  {config.seoImageUrl && <img src={config.seoImageUrl} alt="SEO Image" className="w-20 h-10 object-cover rounded" />}
                  <input type="file" accept="image/*" onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const url = await handleUpload(file, 'seoImage');
                        setConfig({...config, seoImageUrl: url});
                      } catch (err) { }
                    }
                  }} className="text-sm text-text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
                </div>
              </div>
            </div>
          </div>

      </div>

      <div className="mt-8 border-t border-primary/20 pt-8">
        <Button onClick={handleSave} disabled={saving} size="lg" className="px-12 text-lg font-bold shadow-[0_0_20px_rgba(245,138,31,0.4)] hover:scale-105 transition-transform">
          {saving ? 'Fazendo Upload e Salvando...' : 'Salvar Personalização'}
        </Button>
      </div>
    </div>
  );
}
