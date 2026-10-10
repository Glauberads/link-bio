# Contexto do Código - Conecta FFR (Link na Bio)

Este documento descreve a arquitetura, as tecnologias e as regras de negócio do sistema "Conecta FFR", um Link na Bio super avançado que atua como hub de links, gerenciador de leads, e vitrine de sistemas.

## 🚀 Tecnologias Utilizadas
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + Lucide React (ícones)
- **Banco de Dados:** PostgreSQL (hospedado no Supabase)
- **ORM:** Prisma
- **Autenticação:** NextAuth.js
- **Integração de IA:** Google Generative AI (Gemini SDK)
- **Rastreamento:** Meta Pixel + Conversions API (CAPI)

## 📁 Estrutura de Pastas Principais
- `/src/app/(public)`: Rotas públicas da aplicação.
  - `/src/app/page.tsx`: A página inicial (Home), carrega o perfil, os botões e o chat flutuante de IA.
  - `/src/app/sistemas`: Página que exibe os sistemas à venda.
  - `/src/app/biblioteca`: Página de biblioteca/conteúdos gratuitos.
  - `/src/app/orcamento`: Formulário para captura de Leads.
- `/src/app/admin`: Painel do administrador (Protegido por NextAuth).
  - `/admin/personalizacao`: Onde o usuário altera textos, links, imagens e a Caixa de Pesquisa dinamicamente.
  - `/admin/integracoes`: Onde configura chaves de API (Gemini, Meta Pixel, Webhooks).
  - `/admin/leads`: Visualização de leads capturados.
  - `/admin/conteudo`: Gestão (CRUD) de itens da biblioteca/repositórios.
- `/src/app/api`: Rotas de Backend (Endpoints REST).
  - `/api/chat`: Processa as mensagens do Floating Chat e comunica com a API do Gemini.
  - `/api/track`: Recebe os eventos de clique do frontend, salva no BD e envia para o Meta CAPI.
  - `/api/config`: Retorna e atualiza as configurações do site (SiteConfig).
  - `/api/upload`: Rota de upload de arquivos (Imagens, Gifs, MP4) para o Storage do Supabase.
- `/src/components`: Componentes reutilizáveis do React.
  - `HomeButtons.tsx`: Componente Client-Side que renderiza os botões dinâmicos da Home e injeta eventos de rastreamento no onClick.
  - `FloatingChat.tsx`: O balão e a janela de chat de Inteligência Artificial usando Gemini.
- `/src/lib`: Bibliotecas auxiliares.
  - `prisma.ts`: Instância global do Prisma Client.
  - `tracking.ts`: Função auxiliar para disparar eventos para o Pixel do Frontend (fbq) e para o Backend (/api/track).

## 🗄️ Esquema de Banco de Dados (Prisma)
O sistema possui tabelas cruciais para o funcionamento dinâmico:
1. **SiteConfig (id=1):** Tabela de configuração global (Single Row). Armazena *todos* os textos (siteTitle, siteDescription), URLs das redes sociais, imagens (logoUrl, characterUrl), chaves (geminiApiKey, metaPixelId) e um campo JSON (`fixedLinksConfig`) usado para editar textos dos botões fixos e da caixa de pesquisa. Também contém um JSON `customLinks` para links infinitos.
2. **Resource:** Guarda os conteúdos/repositórios exibidos na página da Biblioteca.
3. **Lead / WaitlistEntry:** Tabelas de captação de clientes.
4. **ClickEvent:** Log de rastreamento de todo clique nos botões (Registra alvo, tipo e parâmetros UTM).

## 🧠 Integração com Inteligência Artificial (Gemini)
- O Agente de IA é renderizado via componente `FloatingChat.tsx` (quando habilitado no admin).
- O agente envia requisições para `/api/chat`, onde a SDK do Google Gemini processa a resposta usando o modelo configurado no banco (Ex: `gemini-2.5-flash`).
- A "Personalidade" e o prompt de sistema do agente são configurados direto na tabela `SiteConfig` (campo `agentPrompt`), tornando-o dinâmico.

## 📊 Rastreamento e Conversões (Meta)
- Possui um sistema duplo (Híbrido) implementado em `src/lib/tracking.ts` e `src/app/api/track/route.ts`.
- **Frontend:** Dispara `window.fbq('trackCustom', ...)` direto do navegador do cliente usando os dados injetados via `layout.tsx`.
- **Backend (CAPI):** Manda um fetch do Node.js (Vercel) para os servidores da Meta `graph.facebook.com/v19.0/{pixel}/events`, enviando `client_ip_address`, `client_user_agent`, e cookies `fbp/fbc`.
- A API do Meta (Token CAPI) é salva dentro de `SiteConfig.fixedLinksConfig.metaApiToken`.

## ⚙️ Dinamismo da Home (page.tsx)
- Toda a Home page renderiza Server Side ou passa os dados de `SiteConfig` para componentes Client Side.
- A Home não contém textos "chumbados" (hardcoded). Se o Admin escreve um subtítulo para o botão do TikTok, esse texto é lido de `config.fixedLinksConfig.tiktok.subtitle`.
- Os ícones podem ser customizados por upload direto (inclusive vídeos `.mp4` para ícones animados) salvos no bucket "assets" do Supabase.

## 💡 Como um Agente deve interagir com esta Base de Código
1. **Nunca "chumbar" links genéricos:** Qualquer novo link adicionado à Home deve ser parametrizado lendo da tabela `SiteConfig`.
2. **Eventos de Tracking:** Ao criar botões novos, use `trackEvent(NomeDoEvento, { alvo: "Desc", tipo: "botao", pagina: "home" })` do `tracking.ts` no evento `onClick`.
3. **Estilos:** Priorize Tailwind puro e efeitos de "Glassmorphism" (`bg-surface/80 backdrop-blur-md`) já existentes no padrão de design. Não instale bibliotecas CSS externas.
4. **Respeite o Next 14:** Use `"use client"` estritamente onde houver hooks (`useState`, `onClick`) e evite vazar componentes client no layout global raiz. 
