# Esqueleto de Site e Painel Administrativo - TS EYEWEAR (100% Online)

## 1. Visão Geral
Aplicação web para a marca **TS EYEWEAR**, dividida em duas áreas principais:
1. **Catálogo Público (E-commerce Consultivo)**: Navegação rápida, foco em mobile, fotos de alta definição, filtros ópticos, frete grátis para todo o Brasil e fechamento de pedidos no WhatsApp.
2. **Painel Administrativo (Dashboard Admin)**: Área restrita e autenticada para gestão operacional de produtos, upload/redimensionamento de mídias, criação/edição de categorias, variações de produto (produto-pai), controle de estoque em tempo real e visibilidade flexível.

---

## 2. Princípios UX/UI

### 2.1. No Catálogo Público
- **Clareza visual**: hierarquia tipográfica consistente, contrastes WCAG AA, design limpo que valoriza as armações.
- **Escaneabilidade**: cards padronizados com medidas visíveis (aro, ponte e haste), badges informativos discretos.
- **Mobile First**: experiência otimizada para smartphones (thumb zone, menus colapsáveis e botões acessíveis).
- **Conversão via WhatsApp**: links pré-formatados com modelo, SKU, cor e preço para atendimento rápido.
- **Transparência Legal**: dados institucionais claros (CNPJ, IE, Sede Fiscal, Políticas de Troca e Garantia).

### 2.2. No Painel Administrativo
- **Eficiência e Densidade de Informação**: Layout em painel lateral fixo (Sidebar de navegação admin) com área principal dinâmica.
- **Feedback Visual Imediato**: Toasts de sucesso/erro em ações de salvar, badges de status (`Ativo`, `Oculto`, `Esgotado`, `Últimas Unidades`).
- **Drag-and-Drop Intuitivo**: Ordenação visual de fotos da galeria arrastando miniaturas.
- **Edição em Abas/Passos**: Formulário de produto segmentado para evitar sobrecarga cognitiva.

---

## 3. Estrutura de Rotas e Páginas

### 3.1. Catálogo Público
- `/`: Home (Hero Promocional, Categorias, Destaques, Benefícios, Rodapé)
- `/catalogo`: Catálogo Geral com sidebar de filtros e paginação
- `/produto/[id]`: Página de Detalhes do Produto (PDP) com galeria, medidas e botão de compra
- `/favoritos`: Página de itens salvos pelo cliente no navegador
- `/institucional`: Quem Somos, Políticas de Troca, Garantia e Privacidade

### 3.2. Painel Administrativo (`/admin`)
- `/admin/login`: Tela de autenticação com e-mail/usuário e senha criptografada.
- `/admin/dashboard`: Visão executiva com indicadores:
  * Total de produtos cadastrados.
  * Produtos ativos vs. ocultos.
  * Alertas de estoque baixo e itens esgotados.
- `/admin/produtos`: Listagem geral de produtos:
  * Barra de busca rápida por título, marca ou SKU.
  * Filtros por categoria, status (`Ativo`, `Oculto`, `Esgotado`) e ordenação por data/preço.
  * Ações rápidas em lote e botão de alternar visibilidade instantânea (toggle ativo/oculto).
- `/admin/produtos/novo` e `/admin/produtos/[id]`: Formulário completo de cadastro e edição.
- `/admin/categorias`: Gestão e ordenação de categorias principais e subcategorias.

---

## 4. Estrutura e Telas do Painel Administrativo

### 4.1. Formulário de Cadastro e Edição de Produtos (Itens 1 a 7)

O formulário é estruturado em blocos modulares:

#### Bloco 1: Informações Gerais e Identificação
- **Título do Produto**: Nome comercial (ex: *"Armação Acetato Elegance"*).
- **Código SKU Pai**: Identificador único global (ex: *"TS-8021"*).
- **Código de Barras / Referência Adicional**: Opcional.
- **Marca / Linha**: TS EYEWEAR ou marca parceira.
- **Descrição Completa**: Editor de texto formatado para detalhes do material, curvatura e indicações visuais.
- **Categorização**: Seleção de Categoria Principal e Subcategorias (Gênero, Formato, Material).

#### Bloco 2: Preços e Condições Comerciais
- **Preço de Venda ("De")**: Valor de tabela.
- **Preço Promocional ("Por")**: Valor com desconto para venda à vista/PIX.
- **Cálculo de Desconto**: Exibição automática do percentual de desconto calculado (`-15%`, `-20%`).
- **Parcelamento**: Número máximo de parcelas sem juros.
- **Flags de Destaque**:
  * `Destaque na Home`: Exibir no carrossel de vitrine da página inicial.
  * `Novidade / Lançamento`: Badge de lançamento no catálogo.
  * `Outlet`: Incluir na seção promocional.

#### Bloco 3: Gestão de Mídias (Upload, Redimensionamento e Ordenação)
- **Área de Dropzone**: Upload simultâneo de fotos (`.webp`, `.png`, `.jpg`) e vídeos de demonstração (`.mp4`, `.webm`).
- **Redimensionamento Automático**: Processamento na submissão para padrão de catálogo (`600x600px` em formato WebP otimizado).
- **Grade de Ordenação Visual (Drag-and-Drop)**:
  * Miniaturas ordenáveis por arrasto:
    * Posição 1: Foto frontal padrão.
    * Posição 2: Foto em ângulo de 45° (acionada no hover do card).
    * Posição 3+: Fotos da haste, detalhes e vídeos.
  * Opção de excluir mídia individual ou definir como capa com 1 clique.

#### Bloco 4: Gestão de Variações de Produto (Produto-Pai)
- Tabela dinâmica de variações filhas sob o mesmo produto:
  * **Cor**: Nome da cor (ex: *Tartaruga Havana*, *Preto Fosco*) + seletor visual de cor (HEX).
  * **Tamanho e Medidas Técnicas**:
    * Aro (mm) - ex: 52 mm.
    * Ponte (mm) - ex: 18 mm.
    * Haste (mm) - ex: 140 mm.
  * **Material da Variação**: Acetato, Metal, Titânio, TR90.
  * **SKU Derivado**: Gerado automaticamente (ex: `TS8021-HAV-52`).
  * **Preço Diferenciado**: Campo opcional para precificação específica da variação.
  * **Fotos por Variação**: Vinculação das fotos da galeria à cor correspondente.

#### Bloco 5: Controle de Estoque em Tempo Real
- **Estoque por Variação**: Quantidade numérica de peças disponíveis.
- **Ajuste Manual de Estoque**: Botões rápidos de incremento/decremento com histórico.
- **Regras de Sinalização Automática**:
  * Estoque > 3: Sinalizador visual verde (`Em Estoque`).
  * Estoque entre 1 e 3: Sinalizador amarelo (`Últimas Unidades`).
  * Estoque = 0: Sinalizador vermelho (`Esgotado`) com bloqueio ou alteração do botão no WhatsApp para "Solicitar Encomenda".

#### Bloco 6: Visibilidade Flexível
- **Seletor de Status do Produto**:
  * `Ativo`: Visível e comprável em todo o catálogo público.
  * `Oculto / Rascunho`: Preservado integralmente no banco e no painel administrativo, porém invisível no site público e na busca (sem exclusão de dados).
  * `Arquivado`: Retirado de catálogo e de buscas ativas do admin.

---

### 4.2. Gestão de Categorias e Subcategorias
- **Listagem em Árvore Hierárquica**:
  * Categoria Pai (ex: *Óculos de Grau*, *Óculos de Sol*, *Acessórios*).
  * Subcategorias (ex: *Feminino*, *Masculino*, *Unissex*, *Redondo*, *Quadrado*, *Gatinho*).
- **Ações**:
  * Criar nova categoria principal com slug amigável.
  * Adicionar ou editar subcategorias.
  * Ativar/Desativar categoria sem excluir produtos vinculados.
  * Reordenar posição de exibição no menu do catálogo.

---

## 5. Header Global do Catálogo Público
Posição: Topo fixo, sticky on scroll com efeito glassmorphism suave.

Componentes:
- **Top Bar Promocional**: Mensagem de destaque: *"Frete Grátis para todo o Brasil | 5 Anos de Tradição e Estilo"*.
- **Logo TS EYEWEAR**: À esquerda, linkando para a página inicial (`/`).
- **Menu Principal**: Links para *Óculos de Grau*, *Óculos de Sol*, *Lançamentos*, *Outlet*, *Quem Somos*.
- **Barra de Busca**: Centralizada com placeholder *"Busque por modelo, cor ou estilo..."* e autocomplete.
- **Ações Rápidas**: Ícone de Favoritos com contador dinâmico e botão direto de contato WhatsApp.

---

## 6. Footer Institucional do Catálogo Público
Posição: Rodapé global da aplicação.

Colunas:
1. **TS EYEWEAR**: Resumo da história da marca (5 anos cuidando da sua visão com muito estilo), logo oficial e link do Instagram (`@tseyewear`).
2. **Atendimento Online**: WhatsApp de suporte, e-mail oficial (`tnoculos05.07@gmail.com`), atendimento de Segunda a Domingo e Feriados.
3. **Ajuda e Informações**: Guia de Medidas, Como Comprar Lentes de Grau Online, Políticas de Frete e Entrega, Garantias (6 meses armação / 1 ano lentes) e Trocas (30 dias).
4. **Segurança e Formas de Pagamento**: Selos de segurança SSL, bandeiras de cartão aceitas e PIX com desconto.

Faixa Inferior (Conformidade Legal):
- Razão Social: TS comércio de óculos e negócios Ltda.
- CNPJ: 53.152.860/0001.07 | Inscrição Estadual: 161.280.750.113.
- Sede Fiscal: Rua Brigadeiro Tobias, 577, Centro, São Paulo - SP, CEP 01032-000 *(Loja 100% On-line)*.
- Copyright © TS EYEWEAR. Todos os direitos reservados.
