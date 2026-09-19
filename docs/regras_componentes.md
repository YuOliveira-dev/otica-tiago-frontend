# Regras de Componentes e Design System - Catálogo TS EYEWEAR

Este documento estabelece as especificações de design, estrutura, estados visuais e comportamento de todos os componentes da interface do Catálogo Online da **TS EYEWEAR** (operação **100% online**).

---

## 1. Design Tokens (Fundação Visual)

### 1.1. Cores
A paleta de cores transmite sofisticação, precisão óptica, confiança em saúde visual e modernidade:

* **Primária (Brand Navy / Elegância e Precisão)**:
  * `--color-primary-900`: `#0F172A` (Navy escuro profundo para textos e contrastes fortes)
  * `--color-primary-700`: `#1E293B` (Navy intermediário para cabeçalhos e títulos de seções)
  * `--color-primary-500`: `#2563EB` (Azul de ação e destaques interativos)
* **Secundária / Destaque (Gold / Bronze Premium)**:
  * `--color-accent-500`: `#D97706` (Dourado âmbar para badges nobres, estrelas e destaques da marca)
  * `--color-accent-400`: `#F59E0B` (Hover e detalhes de atenção)
* **WhatsApp Brand**:
  * `--color-whatsapp`: `#25D366`
  * `--color-whatsapp-hover`: `#1EBE5B`
* **Neutros (Superfícies e Textos)**:
  * `--color-bg-body`: `#F8FAFC` (Cinza suave para fundo)
  * `--color-bg-card`: `#FFFFFF` (Branco puro para destaque dos óculos)
  * `--color-text-title`: `#0F172A` (Contraste impecável)
  * `--color-text-body`: `#475569` (Cinza ardósia balanceado)
  * `--color-text-muted`: `#94A3B8` (Dimensões, SKUs, textos legais)
  * `--color-border`: `#E2E8F0` (Linhas divisórias elegantes)
* **Feedback e Status**:
  * `--color-success`: `#16A34A` (Frete Grátis Brasil, Em Estoque, 100% Original)
  * `--color-danger`: `#DC2626` (Badges de Desconto, Esgotado)
  * `--color-warning`: `#EA580C` (Últimas Unidades)

### 1.2. Tipografia
* **Família Principal**: `'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Hierarquia de Escala**:
  * `Display / Hero Title`: 2.5rem (40px) a 3.5rem (56px) - Peso 700
  * `H1 (Páginas)`: 2rem (32px) a 2.5rem (40px) - Peso 700
  * `H2 (Seções)`: 1.5rem (24px) a 1.875rem (30px) - Peso 600
  * `H3 (Cards e Subtítulos)`: 1.125rem (18px) a 1.25rem (20px) - Peso 600
  * `Body Regular`: 1rem (16px) - Peso 400 - Altura de linha 1.5
  * `Body Small`: 0.875rem (14px) - Peso 400 / 500
  * `Micro / Badges`: 0.75rem (12px) - Peso 600 / Letras maiúsculas discretas

### 1.3. Espaçamento (Escala Base de 8px)
* `space-1`: 4px | `space-2`: 8px | `space-3`: 12px | `space-4`: 16px
* `space-6`: 24px | `space-8`: 32px | `space-12`: 48px | `space-16`: 64px

### 1.4. Raios de Borda (Border Radius)
* `radius-sm`: 4px (Badges e tags técnicas de medidas)
* `radius-md`: 8px (Botões normais, campos de busca e filtros)
* `radius-lg`: 16px (Cards de produto e cards de categoria)
* `radius-full`: 9999px (Pills, botões redondos de ação e WhatsApp)

### 1.5. Sombras e Elevação (Box Shadows)
* `--shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
* `--shadow-card`: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`
* `--shadow-hover`: `0 12px 24px -4px rgba(15, 23, 42, 0.12), 0 4px 8px -2px rgba(15, 23, 42, 0.06)`
* `--shadow-modal`: `0 20px 25px -5px rgba(0, 0, 0, 0.25)`

---

## 2. Componentes Estruturais

### 2.1. Header Global (`<header class="header-global">`)
* **Posicionamento**: `sticky`, `top: 0`, `z-index: 1000`. Efeito backdrop glassmorphism (`backdrop-filter: blur(10px)`) com fundo branco translúcido ao rolar a página.
* **Top Bar (Barra Superior de Notificação)**:
  * Mensagem fixa em destaque: *"Frete Grátis para todo o Brasil em todos os pedidos | Atendimento Especializado via WhatsApp"*.
* **Área Principal**:
  * **Logo TS EYEWEAR**: À esquerda, mantendo proporção visual harmônica, linkando para a Home (`/`).
  * **Barra de Busca Central**:
    * Placeholder: *"Busque por modelo, cor ou estilo..."*.
    * Dropdown com sugestões instantâneas ao digitar 3 ou mais caracteres.
  * **Menu de Navegação Principal**:
    * Links: *Óculos de Grau*, *Óculos de Sol*, *Lançamentos*, *Outlet*, *Quem Somos*.
    * Indicador animado no hover e classe `.active` na categoria em navegação.
  * **Ações do Usuário (Direita)**:
    * Botão **Favoritos** com contador de itens salvos.
    * Botão **Fale Conosco** (link direto para o WhatsApp de atendimento).
    * Botão de **Menu Hambúrguer** em dispositivos móveis (< 1024px).
* **Responsividade Mobile**:
  * Drawer lateral deslizante (off-canvas) contendo as categorias, link direto para o guia de medidas e botão de contato com o especialista.

---

### 2.2. Hero Carousel (`<section class="hero-carousel">`)
* **Proporções**:
  * Desktop: `1920x600px` (Aspect ratio aprox. 16:5).
  * Mobile: `800x800px` (1:1) ou `600x800px` (3:4).
* **Elementos de Cada Slide**:
  * Eyebrow: *"Coleção 2026 | TS EYEWEAR"*.
  * Headline: *"Sua Visão em Boas Mãos. Seu Estilo com Nitidez."*
  * Subtítulo destacando benefícios: 100% originais, lentes com proteção UV certificada e frete grátis para todo o Brasil.
  * Botão CTA primário (*"Conferir Coleção"*, *"Ver Ofertas"*).

---

### 2.3. Card de Categoria (`<div class="card-categoria">`)
* **Composição**:
  * 1 Card Grande em destaque (*Armações de Grau*) e cards menores (*Óculos de Sol*, *Lançamentos*, *Outlet*).
  * Imagem de alta qualidade com gradiente escuro semitransparente para garantia de legibilidade tipográfica (WCAG AA).
  * Leve efeito de zoom na imagem ao passar o mouse (`transform: scale(1.04)`).

---

### 2.4. Card de Produto (`<article class="card-produto">`) - Componente Central
* **Estrutura Visual**:
  1. **Container de Imagem (Aspect Ratio 1:1)**:
     * Fundo limpo e suave.
     * Imagem frontal perfeitamente centralizada.
     * No `:hover`, transição suave para foto em 45° ou detalhe de acabamento da haste.
  2. **Badges de Destaque (Superior Esquerdo)**:
     * Badge `Frete Grátis Brasil` (verde suave).
     * Badge de Desconto (ex: `"-20%"` em vermelho/laranja).
     * Badge `100% Original`.
  3. **Botão de Favoritos (Superior Direito)**:
     * Ícone de coração com `aria-label="Salvar nos favoritos"`.
  4. **Marca e SKU**:
     * Nome da marca e código de referência (ex: *TS EYEWEAR | REF: TS-8021*).
  5. **Título do Produto**:
     * Nome do modelo com limite de 2 linhas (`line-clamp`).
  6. **Tag de Medidas Técnicas**:
     * Tag discreta com dimensões em mm: `Aro: 52mm | Ponte: 18mm | Haste: 140mm`.
  7. **Bloco de Preço**:
     * Preço original riscado (em promoções).
     * Preço promocional ou à vista no PIX com destaque.
     * Parcelamento sem juros (ex: *"ou até 10x sem juros"*).
  8. **Ações**:
     * **Botão Primário ("Pedir pelo WhatsApp")**: Cor verde oficial do WhatsApp, ícone e link com mensagem pré-formatada.
     * **Botão Secundário ("Ver Detalhes")**: Abertura da página do produto ou modal com especificações completas.

---

### 2.5. Card de Diferencial / Benefício (`<div class="card-beneficio">`)
* Componente para a seção institucional de diferenciais da TS EYEWEAR na Home:
  * Ícone estilizado em dourado ou navy.
  * Título do benefício (*"5 Anos de Tradição"*, *"Frete Grátis para todo o Brasil"*, *"Garantia Total"*, *"Atendimento Humanizado"*).
  * Descrição curta explicando o compromisso com a saúde e o conforto visual.

---

### 2.6. Filtros e Ordenação (`<aside class="sidebar-filtros">`)
* **Filtros Multifacetados**:
  * Tipo: Grau / Sol.
  * Gênero: Feminino, Masculino, Unissex.
  * Formato: Redondo, Quadrado, Aviador, Gatinho, Retangular, etc.
  * Material: Acetato, Metal, Titânio, TR90.
  * Faixa de Preço.
* **Mobile**: Botão flutuante *"Filtrar Produtos"* que aciona gaveta deslizante inferior (Bottom Sheet) com botão *"Aplicar Filtros"*.

---

### 2.7. Widget Flutuante do WhatsApp (`<a class="whatsapp-float">`)
* Fixo no canto inferior direito (`bottom: 24px`, `right: 24px`, `z-index: 999`).
* Animação sutil de pulso a cada 8 segundos.
* Balão de texto automático após 4 segundos: *"Dúvidas sobre o modelo ou envio de receita? Fale com nosso consultor óptico!"*.

---

### 2.8. Rodapé Institucional (`<footer class="footer-global">`)
* **Coluna 1 - Sobre a TS EYEWEAR**:
  * Logo oficial e breve apresentação dos 5 anos de atuação cuidando da visão com estilo e qualidade 100% original.
  * Link direto para o Instagram oficial: `@tseyewear`.
* **Coluna 2 - Atendimento Online**:
  * WhatsApp oficial e e-mail de suporte (`tnoculos05.07@gmail.com`).
  * Atendimento de Segunda a Domingo e Feriados.
* **Coluna 3 - Políticas e Segurança**:
  * Links: Guia de Medidas, Política de Frete Grátis Brasil, Política de Trocas e Devoluções (30 dias corridos), Garantia de Armações (6 meses) e Lentes (1 ano), Termos de Uso e Privacidade (LGPD).
* **Coluna 4 - Pagamento e Envio**:
  * Selos de segurança SSL, bandeiras de cartão aceitas, PIX com desconto, Correios (SEDEX/PAC), Motoboy e Transportadoras parceiras.
* **Faixa Inferior (Dados Oficiais e Jurídicos)**:
  * **Razão Social**: TS comércio de óculos e negócios Ltda.
  * **CNPJ**: 53.152.860/0001-07 | **Inscrição Estadual**: 161.280.750.113.
  * **Sede Fiscal**: Rua Brigadeiro Tobias, 577, Centro, São Paulo - SP, CEP 01032-000 *(Loja 100% On-line)*.
  * Copyright © TS EYEWEAR. Todos os direitos reservados.
