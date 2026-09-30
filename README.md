# FFR Conecta - Link na Bio e Hub de Produtos

Repositório principal do projeto web da G-ADS / FFR do Brasil Technology.

## Suposições feitas durante o desenvolvimento

1. **Tailwind CSS v4:** O Next.js 15 inicia por padrão com Tailwind v4, logo a configuração das variáveis CSS foi feita diretamente no arquivo `globals.css` utilizando `@theme inline` e a importação `@import "tailwindcss";`, no lugar de usar o `tailwind.config.ts`.
2. **Ícones:** A biblioteca `lucide-react` não disponibiliza mais ícones de marcas (como o do Instagram) por questões de trademark. Provisoriamente, foi utilizado o ícone de `Camera` no link do Instagram. Em fases posteriores, podemos adicionar os SVGs oficiais.
3. **Fontes:** As fontes esportivas/itálicas para os títulos e o corpo do texto foram carregadas via `next/font/google` (`Manrope` para corpo de texto, `Oswald` para títulos), injetando variáveis CSS direto no `layout.tsx`.
4. **LinkCard Component:** Adicionado efeito sutil de `glow` apenas aos cards com prop `highlight=true` (ex: pacote de 9 sistemas) e um blur dourado em repouso/hover.

## Passos para rodar localmente

1. Execute `npm install`
2. Execute `npm run dev`
3. Abra `http://localhost:3000`
