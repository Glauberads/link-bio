"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Activity, Webhook, Bot, Save, Settings, X } from "lucide-react";

export default function IntegracoesPage() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      alert('Integrações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar integrações.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-text-muted">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-pink-500/10 rounded-xl text-pink-500 border border-pink-500/20">
          <Activity className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-text">Integrações</h2>
          <p className="text-text-muted mt-1">Conecte ferramentas externas e a inteligência artificial</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Pixel do Meta */}
        <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-bold text-text">Pixel do Meta (Facebook)</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">Insira o ID do seu Pixel para rastrear eventos e pageviews automaticamente.</p>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1">ID do Pixel (Ex: 1234567890)</label>
            <input 
              type="text" 
              value={config.metaPixelId || ''} 
              onChange={e => setConfig({...config, metaPixelId: e.target.value})} 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors" 
              placeholder="Digite o ID do Pixel" 
            />
          </div>
        </div>

        {/* Webhook */}
        <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3 mb-4">
            <Webhook className="w-5 h-5 text-green-400" />
            <h3 className="text-xl font-bold text-text">Webhook de Leads</h3>
          </div>
          <p className="text-sm text-text-muted mb-4">Envie os dados de novos leads automaticamente para plataformas como Make, N8N, Zapier, etc.</p>
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1">URL do Webhook</label>
            <input 
              type="url" 
              value={config.webhookUrl || ''} 
              onChange={e => setConfig({...config, webhookUrl: e.target.value})} 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors" 
              placeholder="https://sua-url-de-webhook.com" 
            />
          </div>
        </div>

        {/* Agente Autônomo */}
        <div className="bg-surface border border-primary/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="text-xl font-bold text-text">Agente Autônomo (Gemini)</h3>
              <button 
                onClick={() => setIsGeminiModalOpen(true)}
                className="p-1.5 ml-2 bg-surface hover:bg-primary/20 text-text-muted hover:text-primary rounded-lg border border-primary/20 transition-colors"
                title="Configurar API Key e Modelo"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-background px-3 py-1.5 rounded-lg border border-primary/20 hover:border-primary/50 transition-colors">
              <input 
                type="checkbox" 
                checked={config.agentEnabled || false} 
                onChange={e => setConfig({...config, agentEnabled: e.target.checked})} 
                className="accent-primary w-4 h-4 rounded" 
              />
              <span className="text-sm text-text font-medium">Habilitar Chatbot Flutuante</span>
            </label>
          </div>
          
          <p className="text-sm text-text-muted mb-4">Configure a inteligência do seu assistente virtual. Ele ficará flutuante na sua página principal para tirar dúvidas dos clientes.</p>
          
          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wider block mb-1">Prompt do Agente (Instruções de como ele deve agir)</label>
            <textarea 
              value={config.agentPrompt || ''} 
              onChange={e => setConfig({...config, agentPrompt: e.target.value})} 
              className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors h-40 resize-none font-mono" 
              placeholder="Ex: Você é um assistente virtual da empresa FFR. Seu objetivo é ajudar os usuários a encontrarem os melhores sistemas e serviços..." 
            />
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-64 right-0 p-4 bg-surface/80 backdrop-blur-md border-t border-primary/20 flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-8">
          <Save className="w-5 h-5" />
          {saving ? 'Salvando...' : 'Salvar Integrações'}
        </Button>
      </div>

      {/* MODAL GEMINI CONFIG */}
      {isGeminiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface w-full max-w-md rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(245,138,31,0.15)] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> Configurações da API
              </h3>
              <button onClick={() => setIsGeminiModalOpen(false)} className="text-text-muted hover:text-white p-1 bg-background rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={config.geminiApiKey || ''} 
                  onChange={e => setConfig({...config, geminiApiKey: e.target.value})} 
                  className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors" 
                  placeholder="AIzaSy..." 
                />
                <p className="text-[10px] text-text-muted mt-1">Obtenha sua chave gratuitamente no Google AI Studio.</p>
              </div>

              <div>
                <label className="text-xs text-text-muted uppercase tracking-wider mb-1 block">Modelo de Inteligência</label>
                <select 
                  value={config.geminiModel || 'gemini-2.0-flash-exp'} 
                  onChange={e => setConfig({...config, geminiModel: e.target.value})} 
                  className="w-full bg-background border border-primary/30 rounded-xl px-4 py-3 text-text text-sm outline-none focus:border-primary transition-colors"
                >
                  <option value="gemini-2.0-flash-exp">gemini-2.0-flash-exp (Recomendado/Rápido)</option>
                  <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Avançado)</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <Button onClick={() => setIsGeminiModalOpen(false)} className="w-full">Concluído</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
