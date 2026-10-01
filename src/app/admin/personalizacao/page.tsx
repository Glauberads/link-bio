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
  const [customLinks, setCustomLinks] = useState<{id: number, title: string, url: string, iconUrl?: string}[]>([]);
  const [editingFixedLink, setEditingFixedLink] = useState<string | null>(null);

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

  const updateFixedOrder = (newOrder: string[]) => {
    setConfig((prev: any) => ({
      ...prev,
      fixedLinksConfig: {
        ...(prev.fixedLinksConfig || {}),
        order: newOrder
      }
    }));
  };

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setCustomLinks(data.customLinks || []);
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
      let updatedConfig = { ...config, customLinks };

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
            <h3 className="text-xl font-bold text-text mb-4">Links dos Botões</h3>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              
              <div className="space-y-3">
                <h4 className="font-bold text-text mb-2 border-b border-primary/20 pb-2">Botões Padrões (Visíveis na Home)</h4>
                {(() => {
                  const defaultOrder = DEFAULT_FIXED_LINKS.map(l => l.id);
                  const currentOrder = config.fixedLinksConfig?.order || defaultOrder;
                  const orderedLinks = [...DEFAULT_FIXED_LINKS].sort((a, b) => {
                    const idxA = currentOrder.indexOf(a.id);
                    const idxB = currentOrder.indexOf(b.id);
                    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
                  });

                  return orderedLinks.map((link, index) => {
                    const isEditing = editingFixedLink === link.id;
                    const currentTitle = config.fixedLinksConfig?.[link.id]?.title || link.defaultTitle;
                    const currentSubtitle = config.fixedLinksConfig?.[link.id]?.subtitle || link.defaultSubtitle;
                    const currentUrl = config[link.urlField] || '';

                    return (
                      <div key={link.id} className="bg-background border border-primary/20 p-3 rounded-xl flex gap-2">
                        <div className="flex flex-col gap-1 items-center justify-center border-r border-primary/20 pr-2">
                          <button onClick={() => {
                            if (index > 0) {
                              const newOrder = [...currentOrder];
                              [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
                              updateFixedOrder(newOrder);
                            }
                          }} className="text-text-muted hover:text-primary disabled:opacity-30 disabled:hover:text-text-muted" disabled={index === 0}>
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            if (index < orderedLinks.length - 1) {
                              const newOrder = [...currentOrder];
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
                            <span className="text-xs font-bold text-primary">Editando: {link.defaultTitle}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingFixedLink(null)} className="text-text-muted hover:text-white p-1 bg-surface rounded"><Save className="w-4 h-4" /></button>
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted uppercase">Título</label>
                            <input type="text" value={currentTitle} onChange={e => updateFixedLink(link.id, 'title', e.target.value)} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted uppercase">Subtítulo</label>
                            <input type="text" value={currentSubtitle} onChange={e => updateFixedLink(link.id, 'subtitle', e.target.value)} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted uppercase">URL de Destino</label>
                            <input type="url" value={currentUrl} onChange={e => setConfig({...config, [link.urlField]: e.target.value})} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs" />
                          </div>
                          <div>
                            <label className="text-[10px] text-text-muted uppercase mb-1 block">Banner do Botão (Imagem)</label>
                            <div className="flex gap-2">
                              <input 
                                type="file" 
                                accept="image/*,video/mp4"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const url = await handleUpload(e.target.files[0], `banner_${link.id}`);
                                    if (url) updateFixedLink(link.id, 'bannerUrl', url);
                                  }
                                }}
                                className="hidden" 
                                id={`banner-${link.id}`} 
                              />
                              <label htmlFor={`banner-${link.id}`} className="flex-1 bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-xs cursor-pointer flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors">
                                <ImageIcon className="w-4 h-4" /> Upload Imagem
                              </label>
                              {config.fixedLinksConfig?.[link.id]?.bannerUrl && (
                                <button onClick={() => updateFixedLink(link.id, 'bannerUrl', null)} className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500/20">
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            {config.fixedLinksConfig?.[link.id]?.bannerUrl && (
                              <img src={config.fixedLinksConfig[link.id].bannerUrl} alt="Banner" className="mt-2 w-full h-12 object-cover rounded-md border border-primary/20" />
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center group">
                          <div>
                            <h5 className="text-sm font-bold text-text group-hover:text-primary transition-colors flex items-center gap-2">
                              {currentTitle}
                              {config.fixedLinksConfig?.[link.id]?.visible === false && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] bg-red-500/20 text-red-400 font-normal">Oculto</span>
                              )}
                              {config.fixedLinksConfig?.[link.id]?.bannerUrl && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] bg-primary/20 text-primary font-normal flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Banner</span>
                              )}
                            </h5>
                            <p className="text-[10px] text-text-muted truncate max-w-[200px]">{currentSubtitle}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => {
                                const currentVisible = config.fixedLinksConfig?.[link.id]?.visible !== false;
                                updateFixedLink(link.id, 'visible', !currentVisible);
                              }} 
                              className={`p-2 bg-surface hover:bg-primary/20 rounded-lg transition-colors border border-primary/20 ${config.fixedLinksConfig?.[link.id]?.visible === false ? 'text-red-400' : 'text-primary'}`}
                              title={config.fixedLinksConfig?.[link.id]?.visible === false ? 'Mostrar Botão' : 'Ocultar Botão'}
                            >
                              {config.fixedLinksConfig?.[link.id]?.visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setEditingFixedLink(link.id)} className="p-2 bg-surface hover:bg-primary/20 rounded-lg text-text-muted hover:text-primary transition-colors border border-primary/20">
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>

              <div className="pt-6 mt-6 border-t border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-text">Botões Personalizados</h4>
                  <Button type="button" variant="outline" size="sm" onClick={() => setCustomLinks([...customLinks, { id: Date.now(), title: '', url: '', iconUrl: '' }])} className="text-xs py-1 h-auto bg-primary/10 border-primary/30 text-primary hover:bg-primary/20">
                    + Adicionar Botão
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {customLinks.map((link, index) => (
                    <div key={link.id} className="flex gap-4 items-start bg-background p-4 rounded-xl border border-primary/20 relative">
                      <div className="flex flex-col gap-2 items-center">
                        {link.iconUrl ? (
                          link.iconUrl.endsWith('.mp4') ? (
                            <video src={link.iconUrl} autoPlay loop muted playsInline className="w-12 h-12 rounded-xl object-cover bg-surface border border-primary/20" />
                          ) : (
                            <img src={link.iconUrl} className="w-12 h-12 rounded-xl object-cover bg-surface border border-primary/20" />
                          )
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-surface/50 border border-primary/20 flex items-center justify-center text-[10px] text-text-muted text-center leading-tight p-1">Sem Ícone</div>
                        )}
                        <label className="cursor-pointer text-[10px] text-primary hover:underline font-bold text-center">
                          Subir GIF/MP4
                          <input type="file" accept="image/*,video/mp4" className="hidden" onChange={async e => {
                            const file = e.target.files?.[0];
                            if (file) {
                              try {
                                const url = await handleUpload(file, 'btn-icon');
                                const newLinks = [...customLinks];
                                newLinks[index].iconUrl = url;
                                setCustomLinks(newLinks);
                              } catch (err) {}
                            }
                          }} />
                        </label>
                      </div>

                      <div className="flex-1 space-y-3">
                        <input type="text" value={link.title} onChange={e => {
                          const newLinks = [...customLinks];
                          newLinks[index].title = e.target.value;
                          setCustomLinks(newLinks);
                        }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-sm outline-none focus:border-primary" placeholder="Título do botão (Ex: Meu Canal, Meu Curso)" />
                        <input type="url" value={link.url} onChange={e => {
                          const newLinks = [...customLinks];
                          newLinks[index].url = e.target.value;
                          setCustomLinks(newLinks);
                        }} className="w-full bg-surface border border-primary/30 rounded-lg px-3 py-2 text-text text-sm outline-none focus:border-primary" placeholder="URL (https://...)" />
                      </div>
                      <button type="button" onClick={() => setCustomLinks(customLinks.filter(l => l.id !== link.id))} className="text-red-500 hover:text-red-400 text-xs font-bold bg-red-500/10 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors self-start mt-1">
                        Remover
                      </button>
                    </div>
                  ))}
                  {customLinks.length === 0 && <div className="text-center text-sm text-text-muted py-4 italic">Nenhum botão personalizado adicionado.</div>}
                </div>
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
