"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "model";
  text: string;
};

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Olá! Sou o assistente virtual. Como posso ajudar você hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Format history for Gemini API (only previous messages, not the current one)
      const history = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, history })
      });

      const data = await res.json();

      if (res.ok) {
        setMessages(prev => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: "model", text: "Desculpe, ocorreu um erro de conexão. Tente novamente mais tarde." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "model", text: "Erro ao se conectar ao servidor." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-primary text-black shadow-[0_0_20px_rgba(245,138,31,0.5)] hover:scale-110 transition-transform z-40 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {/* Janela do Chat */}
      <div 
        className={`fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-surface border border-primary/30 rounded-2xl shadow-2xl flex flex-col z-50 transition-all origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-primary/20 flex justify-between items-center bg-background/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-text">Assistente Virtual</h3>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${msg.role === 'user' ? 'bg-background border-white/10' : 'bg-primary/20 border-primary/30'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-text-muted" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>

                <div className={`p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-black rounded-tr-none' : 'bg-background border border-primary/20 text-text rounded-tl-none'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>

              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 shrink-0 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="p-3 rounded-2xl bg-background border border-primary/20 text-text rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-text-muted">Digitando...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-primary/20 bg-background/50 rounded-b-2xl">
          <div className="flex items-center gap-2 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="w-full bg-surface border border-primary/30 rounded-xl pl-4 pr-12 py-3 text-sm text-text outline-none focus:border-primary transition-colors resize-none h-[50px] custom-scrollbar"
              rows={1}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-black rounded-lg hover:bg-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[9px] text-text-muted">Powered by Google Gemini AI</span>
          </div>
        </div>
      </div>
    </>
  );
}
