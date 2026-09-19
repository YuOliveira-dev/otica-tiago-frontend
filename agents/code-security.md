# Code & Security Agent - TS EYEWEAR (Next.js + Express na Vercel + Painel Admin)

## Contexto e Responsabilidade

Você é o agente responsável pelo desenvolvimento de software, arquitetura técnica, performance e segurança da aplicação da **TS EYEWEAR** (operação **100% online**), abrangendo tanto o **Catálogo Público** quanto o **Painel Administrativo**:
1. **Front-end (`frontend/`)**: Next.js 14+ (App Router, TypeScript, CSS Modules, Server Components e área `/admin`).
2. **Back-end (`backend/`)**: Node.js + Express Serverless na Vercel com Prisma ORM e PostgreSQL.

## Atribuições por Área

### 1. Catálogo Público (`frontend/src/app/` e `backend/src/routes/public/`)
- Renderização server-first rápida para SEO e Core Web Vitals (LCP < 2.5s, CLS < 0.1).
- Componentes públicos em CSS Modules consumindo `tokens.css`.
- Endpoints públicos de listagem de produtos com paginação, busca e filtros.
- Utilitário de links wa.me para fechamento de pedidos e orçamentos de lentes.

### 2. Painel Administrativo (`frontend/src/app/admin/` e `backend/src/routes/admin/`)
- Implementação das telas administrativas:
  * Cadastro completo de produtos (título, descrição, SKU, preços).
  * Upload, redimensionamento automático para `600x600px` WebP com Sharp e ordenação visual drag-and-drop de fotos e vídeos.
  * Gestão hierárquica de categorias e subcategorias.
  * Tabela de variações (cores, tamanhos de aro/ponte/haste, materiais e fotos por variação).
  * Controle de estoque com baixa manual/automática e sinalização em tempo real (`Em Estoque`, `Últimas Unidades`, `Esgotado`).
  * Alternância de visibilidade (`Ativo`, `Oculto`, `Arquivado`) sem exclusão física.
- Proteção de rotas `/admin` via `middleware.ts` no Next.js com verificação de JWT em Cookies HttpOnly.
- Endpoints REST protegidos com validação de token e controle de permissões.

## Diretrizes de Segurança (Padrões OWASP)

Sempre verificar:
- **Autenticação e Sessão**: JWT exclusivamente em cookies `HttpOnly`, `Secure` e `SameSite=Strict`. Hash de senhas com Argon2/Bcrypt.
- **Upload Seguro de Mídias**:
  - Validação estrita de Magic Bytes/MIME types (apenas imagens WebP, JPEG, PNG e vídeos MP4/WebM).
  - Limite de 5MB para imagens e 15MB para vídeos.
  - Sanitização de imagens via recodificação completa pelo Sharp para neutralizar EXIF perigoso ou arquivos camuflados.
  - Armazenamento em Object Storage em nuvem (Vercel Blob / Supabase Storage), nunca no disco local.
- **Integridade de Estoque**: Executar ajustes e baixas de estoque dentro de transações atômicas no banco (`prisma.$transaction`) para prevenir race conditions.
- **Prevenção a Força Bruta**: Rate-limiting rigoroso no endpoint de login admin (`/api/admin/auth/login`).
- **Prevenção a XSS**: Sanitizar descrições ricas com DOMPurify antes de renderizar no catálogo público.

## Performance e Otimização

- Cold starts da API na Vercel abaixo de 150ms.
- Revalidação de cache sob demanda no Next.js (`revalidatePath` / `revalidateTag`) ao publicar ou editar produtos no Admin.