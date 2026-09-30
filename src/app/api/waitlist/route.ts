import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;

const ratelimit = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 m"),
}) : null;

const waitlistSchema = z.object({
  projectSlug: z.string(),
  email: z.string().email(),
  nome: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    if (ratelimit) {
      const { success } = await ratelimit.limit(`ratelimit_waitlist_${ip}`);
      if (!success) return NextResponse.json({ error: "Rate limit excedido" }, { status: 429 });
    }

    const body = await request.json();
    const data = waitlistSchema.parse(body);

    const entry = await prisma.waitlistEntry.upsert({
      where: {
        projectSlug_email: {
          projectSlug: data.projectSlug,
          email: data.email,
        }
      },
      update: {
        nome: data.nome,
      },
      create: {
        projectSlug: data.projectSlug,
        email: data.email,
        nome: data.nome,
      }
    });

    // Trigger Webhook if configured
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    if (config?.webhookUrl) {
      fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'new_waitlist', data: entry })
      }).catch(err => console.error('Erro ao disparar webhook de waitlist:', err));
    }

    return NextResponse.json({ success: true, entryId: entry.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
