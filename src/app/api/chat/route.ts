import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    
    if (!config?.agentEnabled || !config?.geminiApiKey) {
      return NextResponse.json({ error: 'Chatbot desabilitado ou sem chave configurada.' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: config.geminiModel || "gemini-3.8-flash",
    });

    const basePrompt = config.agentPrompt?.trim() || "Você é o assistente virtual da empresa FFR do Brasil Technology / Glauber Ads. Seu objetivo é ajudar os visitantes, tirar dúvidas sobre sistemas e qualificar clientes interessados em orçamentos.";

    let promptText = `${basePrompt}

REGRA CRÍTICA DE CAPTURA DE LEADS:
Quando você estiver conversando com o visitante e ele fornecer informações de contato (pelo menos Nome e WhatsApp/Telefone, e a necessidade ou tipo de serviço), você DEVE:
1. Confirmar o recebimento de forma educada e prestativa, dizendo que a equipe comercial entrará em contato em breve pelo WhatsApp.
2. No FINAL ABSOLUTO da sua resposta, adicionar uma tag de dados no formato exato:
<!--LEAD_CAPTURE:{"nome":"Nome do Lead","telefone":"WhatsApp ou Telefone","email":"Email se houver","interesse":"Tipo de Serviço/Sistema","mensagem":"Resumo do pedido do cliente"}-->

Observações:
- Só anexe a tag <!--LEAD_CAPTURE:...--> quando tiver coletado o Nome e o WhatsApp/Telefone.
- Se o usuário não tiver informado email, envie o campo "email" vazio ("").
- Mantenha a resposta visível para o usuário amigável, humanizada e profissional.

`;
    
    if (history && history.length > 0) {
      promptText += "Histórico da conversa:\n";
      history.forEach((msg: any) => {
        promptText += `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.parts[0].text}\n`;
      });
      promptText += "\n";
    }
    
    promptText += `Usuário: ${message}\nAssistente:`;

    const result = await model.generateContent(promptText);
    let responseText = result.response.text();

    // Processa captura de lead se a tag estiver presente
    const leadMatch = responseText.match(/<!--LEAD_CAPTURE:([\s\S]*?)-->/);
    if (leadMatch) {
      try {
        const leadData = JSON.parse(leadMatch[1]);
        // Remove a tag técnica para que o usuário não a veja no chat
        responseText = responseText.replace(/<!--LEAD_CAPTURE:[\s\S]*?-->/g, "").trim();

        if (leadData.nome && (leadData.telefone || leadData.email)) {
          const cleanPhone = (leadData.telefone || "").replace(/\D/g, "");
          const fallbackEmail = cleanPhone 
            ? `${cleanPhone}@lead.whatsapp` 
            : `chat_${Date.now()}@conecta.com.br`;
          const email = (leadData.email && leadData.email.includes("@")) 
            ? leadData.email.trim() 
            : fallbackEmail;

          // Salva no banco de dados
          const newLead = await prisma.lead.create({
            data: {
              nome: leadData.nome.trim(),
              email: email,
              telefone: leadData.telefone?.trim() || null,
              interesse: leadData.interesse?.trim() || "Orçamento via Chat Flutuante",
              mensagem: leadData.mensagem?.trim() || "Atendimento realizado pelo Agente de IA Flutuante",
              origem: "Chat Flutuante (IA)",
              status: "novo",
            }
          });

          // Dispara Webhook para n8n
          if (config.webhookUrl) {
            try {
              await fetch(config.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ event: 'new_lead', data: newLead })
              });
            } catch (err) {
              console.error('Erro ao disparar webhook de lead do chat:', err);
            }
          }
        }
      } catch (err) {
        console.error("Erro ao analisar lead capturado:", err);
      }
    }

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Erro na API de chat:', error?.message || error);
    return NextResponse.json({ error: 'Erro ao processar mensagem no servidor.' }, { status: 500 });
  }
}

