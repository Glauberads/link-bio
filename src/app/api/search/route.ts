import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FIXED_LINKS = [
  { id: 'sistemas', slug: 'sistemas', nome: 'Sistemas Prontos', descricao: '9 sistemas prontos para personalizar e revender', type: 'sistemas' },
  { id: 'projetos', slug: 'projetos', nome: 'Projetos Desenvolvidos', descricao: 'Sistemas, produtos e projetos em evolução', type: 'projetos' },
  { id: 'github', slug: 'github', nome: 'Repositórios GitHub', descricao: 'Recursos gratuitos organizados por categoria', type: 'biblioteca' },
  { id: 'dicas', slug: 'dicas', nome: 'Dicas de IA e Automações', descricao: 'Aprenda com conteúdos práticos e links úteis', type: 'biblioteca' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const searchTerm = `%${q}%`;
    const searchTermLower = q.toLowerCase();

    // 1. Static Results (from Home buttons)
    const staticResults = FIXED_LINKS.filter(link => 
      link.nome.toLowerCase().includes(searchTermLower) || 
      link.descricao.toLowerCase().includes(searchTermLower) ||
      link.id.toLowerCase().includes(searchTermLower)
    );

    // 2. Database Results
    const dbResults = await prisma.$queryRaw`
      SELECT id, slug, titulo as nome, descricao, 'biblioteca' as type
      FROM "Resource"
      WHERE (titulo ILIKE ${searchTerm} OR descricao ILIKE ${searchTerm})
      AND ativo = true

      UNION ALL

      SELECT id, slug, nome, descricao, 'projetos' as type
      FROM "Project"
      WHERE (nome ILIKE ${searchTerm} OR descricao ILIKE ${searchTerm})

      UNION ALL

      SELECT id, slug, nicho as nome, descricao, 'sistemas' as type
      FROM "SystemProduct"
      WHERE (nicho ILIKE ${searchTerm} OR descricao ILIKE ${searchTerm})
      
      LIMIT 20
    `;

    const allResults = [...staticResults, ...(dbResults as any[])];

    return NextResponse.json({ results: allResults.slice(0, 20) });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}
