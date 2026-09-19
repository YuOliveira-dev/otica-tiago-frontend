# Guia de Boas Práticas - Catálogo e Painel Administrativo TS EYEWEAR

Este documento reúne as diretrizes de excelência em Experiência do Usuário (UX), Performance Web, Acessibilidade Digital (WCAG), Otimização para Motores de Busca (SEO) e Segurança aplicadas ao **Catálogo Público** e ao **Painel Administrativo** da **TS EYEWEAR** (arquitetura **Next.js + Express na Vercel**).

---

## 1. Boas Práticas no Front-end (Next.js 14+ App Router)

### 1.1. Arquitetura Server-First no Catálogo Público
* **Server Components como Padrão**: Renderizar páginas públicas no servidor para garantir indexação no Googlebot e Core Web Vitals impecáveis.
* **Client Components Delimitados (`'use client'`)**:
  * Utilizados nas interatividades do catálogo (filtros, busca, favoritos, modais).
  * No Painel Admin: Utilizados nos formulários interativos com drag-and-drop de fotos (`DropzoneUpload`), tabela de variações e switches de visibilidade.

### 1.2. Otimização de Mídias com `next/image`
* **Catálogo e Admin**:
  * `next/image` para imagens públicas (WebP/AVIF automáticos, proporção explícita para zero CLS).
  * Miniaturas do painel administrativo carregadas com proporção 1:1 e lazy loading.

### 1.3. Vanilla CSS e CSS Modules
* Manter estilização isolada em `[Componente].module.css` consumindo `tokens.css`.
* No Painel Admin, adotar layout sóbrio, limpo e com alta legibilidade (tons navy, cinzas neutros, status claros em verde, amarelo e vermelho).

---

## 2. Boas Práticas e Segurança no Painel Administrativo (OWASP)

### 2.1. Autenticação Segura e Gerenciamento de Sessão
* **Armazenamento de Tokens**:
  * Tokens de acesso administrativo (JWT) **nunca devem ser salvos em `localStorage`** (vulnerável a ataques XSS).
  * Devem ser transmitidos e armazenados em **Cookies HttpOnly**, com atributos:
    ```
    Set-Cookie: token=...; HttpOnly; Secure; SameSite=Strict; Path=/
    ```
* **Proteção de Rotas no Front-end**:
  * Implementação de `middleware.ts` no Next.js para interceptar qualquer tentativa de acesso ao prefixo `/admin/*` sem cookie válido e redirecionar para `/admin/login`.
* **Criptografia de Senhas**:
  * Senhas de operadores administrativos devem ser armazenadas com hash forte utilizando **Argon2** ou **Bcrypt** (custo mínimo 12).
* **Proteção contra Força Bruta**:
  * Aplicar rate-limiting restritivo na rota `/api/admin/auth/login` (máximo de 5 tentativas a cada 15 minutos por IP).

### 2.2. Segurança no Upload de Fotos e Vídeos (Item 2)
* **Validação Rígida de Tipos MIME (Magic Bytes)**:
  * Não confiar apenas na extensão do arquivo (`.jpg`, `.mp4`). Validar a assinatura binária real do arquivo no backend.
  * Extensões autorizadas:
    * Imagens: `image/webp`, `image/jpeg`, `image/png`.
    * Vídeos: `video/mp4`, `video/webm`.
* **Limites Rígidos de Tamanho**:
  * Imagens: máximo 5MB por arquivo.
  * Vídeos: máximo 15MB por arquivo (vídeos curtos de 10 a 20 segundos de caimento do óculos).
* **Sanitização de Imagens com Sharp**:
  * Toda imagem enviada passa obrigatoriamente pelo pipeline de decodificação e recodificação em WebP via Sharp. Esse processo remove metadados maliciosos (EXIF perigoso, polyglots PHP/JS camuflados).
* **Armazenamento Isolado**:
  * Os arquivos nunca são salvos no sistema de arquivos local do servidor; são enviados diretamente para Object Storage em nuvem (Vercel Blob ou Supabase Storage) com permissões públicas de leitura estrita.

### 2.3. Integridade do Estoque e Transações Atômicas (Item 6)
* O ajuste e a baixa de estoque devem ser executados dentro de **transações atômicas do banco de dados** (`prisma.$transaction`) para prevenir *Race Conditions* (dupla baixa em compras simultâneas).
* Registrar histórico de alterações de estoque para auditoria interna.

---

## 3. Experiência do Usuário (UX/UI) e Acessibilidade (WCAG AA)

### 3.1. Abordagem Mobile-First no Catálogo
* Área do polegar (Thumb Zone) para botões de WhatsApp e favoritos.
* Sticky Bottom Bar com valor e botão de fechamento em telas móveis.
* Alvos de toque de no mínimo 44x44px.

### 3.2. Acessibilidade Digital
* Contraste mínimo 4.5:1 para textos regulares e 3:1 para títulos e badges.
* Navegação completa por teclado com foco visível.
* `alt` descritivo em todas as armações.

---

## 4. Dados Estruturados em JSON-LD (Schema.org)

No layout do Next.js, renderizar a semântica de `OnlineStore` para o catálogo público:

```html
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      "name": "TS EYEWEAR",
      "legalName": "TS comércio de óculos e negócios Ltda",
      "url": "https://tseyewear.com.br",
      "logo": "https://tseyewear.com.br/assets/brand/logo.svg",
      "description": "Loja online especializada em armações de grau, óculos de sol e saúde visual.",
      "email": "tnoculos05.07@gmail.com",
      "sameAs": ["https://instagram.com/tseyewear"],
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0.00",
          "currency": "BRL"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "BR"
        }
      }
    }),
  }}
/>
```
