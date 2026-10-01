import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const trackSchema = z.object({
  eventName: z.string(), // Standard or Custom event name
  alvo: z.string(),
  tipo: z.string(), // botao, recurso, checkout, whatsapp
  pagina: z.string(),
  fbp: z.string().optional(),
  fbc: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = trackSchema.parse(body);

    const clientIpAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "0.0.0.0";
    const clientUserAgent = request.headers.get("user-agent") || "";
    const eventUrl = request.headers.get("referer") || "https://conecta.ffr";

    // 1. Log to Database
    await prisma.clickEvent.create({
      data: {
        alvo: data.alvo,
        tipo: data.tipo,
        pagina: data.pagina,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
      },
    });

    // 2. Fetch Meta CAPI Config
    const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
    const fixedLinks = (config?.fixedLinksConfig as any) || {};
    const metaApiToken = fixedLinks.metaApiToken;
    const metaPixelId = config?.metaPixelId;

    // 3. Send to Meta Conversions API (if configured)
    if (metaPixelId && metaApiToken) {
      const eventTime = Math.floor(Date.now() / 1000);
      const capiPayload = {
        data: [
          {
            event_name: data.eventName,
            event_time: eventTime,
            event_source_url: eventUrl,
            action_source: "website",
            user_data: {
              client_ip_address: clientIpAddress.split(',')[0].trim(),
              client_user_agent: clientUserAgent,
              ...(data.fbp && { fbp: data.fbp }),
              ...(data.fbc && { fbc: data.fbc })
            },
            custom_data: {
              alvo: data.alvo,
              tipo: data.tipo,
              pagina: data.pagina
            }
          }
        ]
      };

      try {
        await fetch(`https://graph.facebook.com/v19.0/${metaPixelId}/events?access_token=${metaApiToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(capiPayload)
        });
      } catch (err) {
        console.error("Meta CAPI Error:", err);
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Track Error:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
