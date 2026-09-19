# AGENTS.md - Catálogo TS EYEWEAR

## Objetivo

Este projeto desenvolve e mantém o Catálogo Online da marca **TS EYEWEAR** (TS comércio de óculos e negócios Ltda).
A loja é **100% online e não possui endereço físico para atendimento presencial**.

A arquitetura do sistema é estruturada em **2 repositórios independentes**, ambos otimizados para deploy na **Vercel**:
1. **Front-end (`frontend/`)**: Aplicação **Next.js 14+** (App Router, TypeScript, Vanilla CSS com CSS Modules, Server Components).
2. **Back-end (`backend/`)**: API REST com **Express** configurada para Vercel Serverless (`@vercel/node` e `vercel.json`).

O projeto utiliza agentes especializados para executar tarefas de forma organizada e segura.

## Agentes

### Organizer
Arquivo: `agents/organizer.md`

Responsável por:
- Ler e interpretar solicitações do usuário.
- Analisar a estrutura do projeto e diretrizes em `/docs`.
- Garantir a fidelidade ao modelo de negócio da TS EYEWEAR (100% online) e à arquitetura de 2 repositórios.
- Dividir tarefas complexas em subtarefas atômicas.
- Delegar tarefas para o agente especializado adequado (`image-product` ou `code-security`).
- Não executar diretamente tarefas que pertencem exclusivamente a outro agente.

### Image/Product
Arquivo: `agents/image-product.md`

Responsável por:
- Tratamento e padronização visual das armações e óculos de sol.
- Organização das imagens por modelo e categoria com base em `/script-py-image-scam`.
- Cadastro, enriquecimento e conferência das especificações dos produtos (SKU, medidas, cores, materiais, preços).
- Validação visual dos cards e galerias de fotos.

### Code/Security
Arquivo: `agents/code-security.md`

Responsável por:
- Desenvolvimento do Front-end em **Next.js** (`frontend/`) e da API em **Express** (`backend/`).
- Responsividade mobile-first e acessibilidade (WCAG AA).
- Segurança da aplicação (CORS, Helmet, Rate-Limit, prevenção a XSS, links seguros).
- Performance e Core Web Vitals (LCP, CLS, INP, imagens otimizadas com `next/image`).
- Integração de mensageria com WhatsApp e consumo de endpoints REST.

## Regra de Delegação

O Organizer deve analisar cada solicitação e determinar qual agente é responsável:

* **Tarefas relacionadas a imagens, fotos, catálogo de produtos, modelos, categorias ou preços**:
  → `agents/image-product.md`

* **Tarefas relacionadas a código, Next.js, Express, rotas da API, layout, CSS, performance ou segurança**:
  → `agents/code-security.md`

* **Tarefas que envolvam múltiplas áreas**:
  → Dividir em subtarefas e delegar cada uma ao agente apropriado na ordem lógica de dependência (dados processados -> endpoints da API Express -> componentes do Next.js).

## Regras Gerais

- **Modelo de Negócio**: A TS EYEWEAR é **100% online**. Não criar nem manter elementos de lojas físicas.
- **Arquitetura 2 Repositórios**: Manter clara a divisão entre `frontend/` (Next.js) e `backend/` (Express na Vercel).
- **Consultar Documentação**: Sempre consultar o diretório `/docs` antes de implementar novas funcionalidades.
- **Preservação de Dados**: Não sobrescrever dados nem alterar preços sem instrução expressa.
- **Scripts de Imagem**: Consultar o repositório `/script-py-image-scam` para regras de processamento de fotos.