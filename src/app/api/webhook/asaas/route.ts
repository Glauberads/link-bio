import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const token = request.headers.get("asaas-access-token");
    if (token !== process.env.ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();

    if (body.event?.startsWith("PAYMENT_")) {
      const payment = body.payment;
      
      const statusMap: Record<string, string> = {
        "PAYMENT_RECEIVED": "pago",
        "PAYMENT_CONFIRMED": "pago",
        "PAYMENT_REFUNDED": "reembolsado",
      };

      const mappedStatus = statusMap[body.event] || "pendente";

      await prisma.order.upsert({
        where: { externalId: payment.id },
        update: { status: mappedStatus },
        create: {
          provider: "asaas",
          externalId: payment.id,
          email: payment.customer || "cliente_asaas", // ID do customer vem aqui na v3 do Asaas
          valor: payment.value,
          status: mappedStatus,
        }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Asaas Webhook Error:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
