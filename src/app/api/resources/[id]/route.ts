import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const body = await req.json();
    
    const resource = await prisma.resource.update({
      where: { id: params.id },
      data: {
        titulo: body.titulo,
        slug: body.slug,
        descricao: body.descricao,
        categoria: body.categoria,
        tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []),
        url: body.url,
        destaque: body.destaque,
        ativo: body.ativo,
      }
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar recurso' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    await prisma.resource.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar recurso' }, { status: 500 });
  }
}
