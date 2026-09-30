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
      model: config.geminiModel || "gemini-2.0-flash-exp",
    });

    let promptText = `Você é um assistente virtual para a empresa FFR. Responda de forma clara e objetiva.\n\n[Instruções do Sistema: ${config.agentPrompt || "Você é um assistente virtual prestativo."}]\n\n`;
    
    if (history && history.length > 0) {
      promptText += "Histórico da conversa:\n";
      history.forEach((msg: any) => {
        promptText += `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.parts[0].text}\n`;
      });
      promptText += "\n";
    }
    
    promptText += `Usuário: ${message}\nAssistente:`;

    const result = await model.generateContent(promptText);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error('Erro na API de chat:', error?.message || error);
    return NextResponse.json({ error: 'Erro ao processar mensagem no servidor.' }, { status: 500 });
  }
}
