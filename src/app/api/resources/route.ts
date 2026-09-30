import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(resources);
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const body = await req.json();
    
    const slug = body.slug || body.titulo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const resource = await prisma.resource.create({
      data: {
        titulo: body.titulo,
        slug: slug,
        descricao: body.descricao,
        categoria: body.categoria || 'Geral',
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []),
        url: body.url,
        destaque: body.destaque || false,
        ativo: body.ativo ?? true,
      }
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar recurso' }, { status: 500 });
  }
}
