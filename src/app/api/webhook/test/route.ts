import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const webhookUrl = body.url?.trim();

    if (!webhookUrl) {
      return NextResponse.json({ error: "A URL do webhook é obrigatória" }, { status: 400 });
    }

    if (!webhookUrl.startsWith("http://") && !webhookUrl.startsWith("https://")) {
      return NextResponse.json({ error: "A URL deve começar com http:// ou https://" }, { status: 400 });
    }

    // Payload de teste idêntico ao lead real do Conecta
    const testPayload = {
      event: "new_lead",
      data: {
        id: `test_${Date.now()}`,
        nome: "Lead Teste Conecta",
        email: "teste.conecta@glauberads.com.br",
        telefone: "5511999999999",
        empresa: "Empresa Demonstração FFR",
        interesse: "Desenvolvimento de Sistemas & Automação com IA",
        mensagem: "Olá! Gostaria de um orçamento para desenvolver um sistema sob medida e automatizar nosso fluxo de vendas.",
        origem: "Teste de Integração (Painel Admin)",
        utm_source: "admin_test",
        utm_medium: "button_test",
        utm_campaign: "teste_webhook_n8n",
        status: "novo",
        createdAt: new Date().toISOString()
      }
    };

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    let response;
    try {
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Conecta-FFR-Webhook-Tester/1.0",
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal,
      });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      if (fetchErr.name === "AbortError") {
        return NextResponse.json({
          success: false,
          status: 408,
          message: "Tempo limite esgotado (timeout). O servidor do webhook demorou mais de 12 segundos para responder.",
        }, { status: 200 });
      }

      return NextResponse.json({
        success: false,
        status: 0,
        message: `Não foi possível conectar à URL: ${fetchErr.message || "Erro de rede ou domínio inacessível."}`,
      }, { status: 200 });
    }

    clearTimeout(timeoutId);
    const durationMs = Date.now() - startTime;
    const status = response.status;
    let responseText = "";
    try {
      responseText = await response.text();
    } catch {
      responseText = "";
    }

    if (response.ok) {
      return NextResponse.json({
        success: true,
        status,
        durationMs,
        message: `Webhook disparado com sucesso! Resposta: ${status} ${response.statusText || "OK"} (${durationMs}ms)`,
        responseBody: responseText.slice(0, 500)
      });
    }

    let extraHint = "";
    if (status === 404) {
      extraHint = " Verifique se o fluxo está ATIVO (botão 'Publish' ligado no canto superior direito do n8n) ou se a URL está correta.";
    } else if (status === 500) {
      extraHint = " O servidor do webhook encontrou um erro interno ao processar o payload.";
    }

    return NextResponse.json({
      success: false,
      status,
      durationMs,
      message: `O webhook retornou status ${status} (${response.statusText || "Erro"}).${extraHint}`,
      responseBody: responseText.slice(0, 500)
    });

  } catch (error: any) {
    console.error("Erro no teste de webhook:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Erro interno do servidor ao testar webhook"
    }, { status: 500 });
  }
}
