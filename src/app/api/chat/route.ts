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
    const chosenModel = config.geminiModel || "gemini-3.5-flash";

    const basePrompt = config.agentPrompt?.trim() || "Você é o assistente virtual oficial da G-ADS (Glauber Ads). Seu objetivo é ajudar os visitantes, tirar dúvidas sobre sistemas sob medida, tráfego e automações de vendas, e qualificar clientes interessados em orçamentos.";

    let promptText = `${basePrompt}

REGRA CRÍTICA DE CAPTURA DE LEADS:
Quando você estiver conversando com o visitante e ele fornecer informações de contato pela primeira vez (pelo menos Nome e WhatsApp/Telefone, e a necessidade ou tipo de serviço), você DEVE:
1. Confirmar o recebimento de forma educada e prestativa, dizendo que a equipe comercial entrará em contato em breve pelo WhatsApp.
2. No FINAL ABSOLUTO da sua resposta, adicionar uma tag de dados no formato exato:
<!--LEAD_CAPTURE:{"nome":"Nome do Lead","telefone":"WhatsApp ou Telefone","email":"Email se houver","interesse":"Tipo de Serviço/Sistema","mensagem":"Resumo do pedido do cliente"}-->

Observações Obrigatórias:
- SÓ anexe a tag <!--LEAD_CAPTURE:...--> UMA ÚNICA VEZ por atendimento. Se o usuário já informou o contato no histórico e você já confirmou, NUNCA repita a tag nas mensagens seguintes.
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

    const modelCandidates = Array.from(new Set([
      chosenModel,
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-flash-8b",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash",
      "gemini-3-flash-preview"
    ])).filter(Boolean);

    let result: any = null;
    let lastError: any = null;

    for (const mName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({ model: mName });
        const res = await model.generateContent(promptText);
        if (res?.response) {
          result = res;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Chat IA] Falha no modelo ${mName} (${err?.status || err?.message?.slice(0, 80)}). Tentando próximo candidato...`);
      }
    }

    if (!result) {
      throw lastError || new Error("Nenhum modelo de IA disponível no momento.");
    }

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

          // Verificação anti-duplicação: bloqueia apenas duplicidade idêntica da mesma conversa (mesmo nome e telefone nos últimos 60 segundos)
          const recentLead = await prisma.lead.findFirst({
            where: {
              nome: { equals: leadData.nome.trim(), mode: 'insensitive' },
              ...(cleanPhone.length >= 8 ? { telefone: { contains: cleanPhone.slice(-8) } } : {}),
              createdAt: {
                gte: new Date(Date.now() - 60 * 1000) // apenas 60 segundos
              }
            }
          });

          if (recentLead) {
            console.log(`[Chat IA] Mensagem subsequente do mesmo lead ${leadData.nome}. Evitando duplicidade de registro.`);
          } else {
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
        }
      } catch (err) {
        console.error("Erro ao analisar lead capturado:", err);
      }
    }

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Erro na API de chat:', error?.message || error);
    return NextResponse.json({ 
      error: error?.message || 'Erro ao processar mensagem no servidor.'
    }, { status: 500 });
  }
}

