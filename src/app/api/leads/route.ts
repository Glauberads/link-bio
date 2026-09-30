import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis if env vars are present
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

// Rate limit: 5 requests per minute
const ratelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
}) : null;

const leadSchema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  empresa: z.string().optional(),
  interesse: z.string().optional(),
  mensagem: z.string().optional(),
  honeypot: z.string().max(0).optional(), // Must be empty
  origem: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    
    if (ratelimit) {
      const { success } = await ratelimit.limit(`ratelimit_lead_${ip}`);
      if (!success) {
        return NextResponse.json({ error: "Muitas requisições. Tente novamente mais tarde." }, { status: 429 });
      }
    }

    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    if (validatedData.honeypot && validatedData.honeypot.length > 0) {
      // Spam detected, but return 200 to fool the bot
      return NextResponse.json({ success: true, message: "Recebido" });
    }

    const lead = await prisma.lead.create({
      data: {
        nome: validatedData.nome,
        email: validatedData.email,
        telefone: validatedData.telefone,
        empresa: validatedData.empresa,
        interesse: validatedData.interesse,
        mensagem: validatedData.mensagem,
        origem: validatedData.origem,
        utm_source: validatedData.utm_source,
        utm_medium: validatedData.utm_medium,
        utm_campaign: validatedData.utm_campaign,
        utm_content: validatedData.utm_content,
      }
    });

    // Trigger Webhook if configured
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    if (config?.webhookUrl) {
      fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'new_lead', data: lead })
      }).catch(err => console.error('Erro ao disparar webhook de lead:', err));
    }

    return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos", details: error.flatten() }, { status: 400 });
    }
    console.error("Lead API Error:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
