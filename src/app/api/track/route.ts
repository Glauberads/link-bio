import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const trackSchema = z.object({
  alvo: z.string(),
  tipo: z.string(), // botao, recurso, checkout, whatsapp
  pagina: z.string(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_content: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = trackSchema.parse(body);

    // Fire-and-forget logging
    await prisma.clickEvent.create({
      data,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    // Return 200 even on error to not disrupt client flow, but log it
    console.error("Track Error:", error);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
