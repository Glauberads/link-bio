import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const config = await prisma.siteConfig.findUnique({ where: { id: 1 } });
  return NextResponse.json(config || {});
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const body = await req.json();
    const config = await prisma.siteConfig.upsert({
      where: { id: 1 },
      update: body,
      create: {
        ...body,
        id: 1,
      }
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar configurações' }, { status: 500 });
  }
}
