import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await prisma.$queryRaw`
      SELECT id, slug, titulo as nome, descricao, 'biblioteca' as type
      FROM "Resource"
      WHERE to_tsvector('portuguese', titulo || ' ' || descricao) @@ plainto_tsquery('portuguese', ${q})
      AND ativo = true

      UNION ALL

      SELECT id, slug, nome, descricao, 'projetos' as type
      FROM "Project"
      WHERE to_tsvector('portuguese', nome || ' ' || descricao) @@ plainto_tsquery('portuguese', ${q})

      UNION ALL

      SELECT id, slug, nicho as nome, descricao, 'sistemas' as type
      FROM "SystemProduct"
      WHERE to_tsvector('portuguese', nicho || ' ' || descricao) @@ plainto_tsquery('portuguese', ${q})
      
      LIMIT 20
    `;

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}
