export interface ManualStep {
  num: number;
  title: string;
  desc: string;
}

export interface ManualModule {
  id: string;
  folder: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  videoFile: string;
  pdfFile: string;
  steps: ManualStep[];
}

export const MANUAL_MODULES: ManualModule[] = [
  {
    id: '01',
    folder: '01-Login',
    slug: '01-login',
    title: 'Módulo 01: Login no Painel',
    subtitle: 'Autenticação e Acesso Seguro ao Sistema',
    duration: '0:35',
    videoFile: 'video-01-login.mp4',
    pdfFile: 'Manual-01-Login.pdf',
    steps: [
      { num: 1, title: 'Acessar a URL do Painel', desc: 'Acesse https://www.tsjoculos.com/admin no seu navegador preferido.' },
      { num: 2, title: 'Digitar o E-mail de Acesso', desc: 'Digite seu e-mail institucional autorizado: admin@tseyewear.com.br.' },
      { num: 3, title: 'Digitar Senha de Segurança', desc: 'Insira sua senha segura com caracteres alfanuméricos e símbolos.' },
      { num: 4, title: 'Confirmar no Botão Dourado', desc: 'Clique em "Entrar no Painel" para validação das credenciais e liberação da sessão.' },
      { num: 5, title: 'Navegação pela Barra Lateral', desc: 'Conheça os atalhos para Dashboard, Produtos, Novo Produto, Categorias e Banners.' },
    ],
  },
  {
    id: '02',
    folder: '02-Dashboard',
    slug: '02-dashboard',
    title: 'Módulo 02: Dashboard Executivo',
    subtitle: 'Visão Geral, Indicadores de Catálogo e Atalhos Rápidos',
    duration: '0:25',
    videoFile: 'video-02-dashboard.mp4',
    pdfFile: 'Manual-02-Dashboard.pdf',
    steps: [
      { num: 1, title: 'Visão Geral do Painel Executivo', desc: 'Central de comando com indicadores consolidados do catálogo em tempo real.' },
      { num: 2, title: 'Cartões de Métricas (KPIs)', desc: 'Acompanhe Total de Modelos, Armações Ativas, Óculos de Sol e Modelos em Destaque.' },
      { num: 3, title: 'Atalhos Rápidos e Modelos Recentes', desc: 'Acesse ações imediatas de cadastro e monitore as últimas alterações realizadas.' },
    ],
  },
  {
    id: '03',
    folder: '03-Produtos',
    slug: '03-produtos',
    title: 'Módulo 03: Catálogo de Produtos',
    subtitle: 'Gestão de Modelos, Filtros e Controle de Visibilidade',
    duration: '0:25',
    videoFile: 'video-03-produtos.mp4',
    pdfFile: 'Manual-03-Produtos.pdf',
    steps: [
      { num: 1, title: 'Catálogo Geral de Armações', desc: 'Visualização completa das armações cadastradas com fotos de capa e valores.' },
      { num: 2, title: 'Busca Instantânea por Modelo Real', desc: 'Digite o nome do modelo (ex: "Milano") ou código SKU para filtrar imediatamente.' },
      { num: 3, title: 'Filtro por Categorias e Ações', desc: 'Filtre por categoria e acesse botões de visualização, alteração de status e edição.' },
    ],
  },
  {
    id: '04',
    folder: '04-Novo-Produto',
    slug: '04-novo-produto',
    title: 'Módulo 04: Cadastro Real de Produto',
    subtitle: 'Cadastro Completo de Armação com Especificações Ópticas',
    duration: '0:45',
    videoFile: 'video-04-novo-produto.mp4',
    pdfFile: 'Manual-04-Novo-Produto.pdf',
    steps: [
      { num: 1, title: 'Identificação e Código SKU', desc: 'Preencha o título comercial (ex: Armação TS Florence) e o SKU Pai (ex: TS-9020).' },
      { num: 2, title: 'Valores e Condições Comerciais', desc: 'Defina o Preço de Venda e Preço Promocional de lançamento.' },
      { num: 3, title: 'Taxonomia e Classificação', desc: 'Selecione a categoria principal, gênero (Feminino/Masculino/Unissex) e formato da armação.' },
      { num: 4, title: 'Especificações Ópticas Reais', desc: 'Configure as medidas técnicas: Aro (largura da lente), Ponte nasal e Comprimento da haste.' },
      { num: 5, title: 'Variações de Cor e Publicação', desc: 'Defina as cores disponíveis, estoque de cada variação e confirme no botão Publicar Produto.' },
    ],
  },
  {
    id: '05',
    folder: '05-Destaques',
    slug: '05-destaques',
    title: 'Módulo 05: Mais Desejados',
    subtitle: 'Curadoria da Vitrine Principal da Home e Selos de Novidade',
    duration: '0:20',
    videoFile: 'video-05-destaques.mp4',
    pdfFile: 'Manual-05-Destaques.pdf',
    steps: [
      { num: 1, title: 'Vitrine Mais Desejados da Home', desc: 'Espaço nobre no topo da página inicial com os modelos de maior apelo de vendas.' },
      { num: 2, title: 'Selecionar Modelo no Catálogo', desc: 'Escolha a armação desejada no seletor e ative a etiqueta de "Lançamento".' },
      { num: 3, title: 'Organização e Atualização Instantânea', desc: 'Os produtos em destaque entram imediatamente na vitrine da loja.' },
    ],
  },
  {
    id: '06',
    folder: '06-Categorias',
    slug: '06-categorias',
    title: 'Módulo 06: Gestão de Categorias',
    subtitle: 'Estruturação do Menu da Loja, Subcategorias e URLs Amigáveis',
    duration: '0:20',
    videoFile: 'video-06-categorias.mp4',
    pdfFile: 'Manual-06-Categorias.pdf',
    steps: [
      { num: 1, title: 'Taxonomia e Estrutura de Menus', desc: 'Organização das coleções da loja com ordenação numérica e visibilidade.' },
      { num: 2, title: 'Criar Nova Categoria Principal', desc: 'Clique em "+ Nova Categoria", defina nome, ordem de exibição e slug amigável.' },
      { num: 3, title: 'Gerenciar Subcategorias', desc: 'Vincule linhas específicas (ex: Titanium, Acetato, Solar) dentro de cada categoria.' },
    ],
  },
  {
    id: '07',
    folder: '07-Banners',
    slug: '07-banners',
    title: 'Módulo 07: Banners Promocionais',
    subtitle: 'Slides Hero do Topo e Cards Fotográficos de Categorias',
    duration: '0:25',
    videoFile: 'video-07-banners.mp4',
    pdfFile: 'Manual-07-Banners.pdf',
    steps: [
      { num: 1, title: 'Carrossel Hero e Cards Visuais', desc: 'Gestão dos grandes slides de topo e dos cartões fotográficos por categoria.' },
      { num: 2, title: 'Criar Novo Banner Promocional', desc: 'Upload de imagem panorâmica, títulos atrativos, texto de chamada e link do botão.' },
      { num: 3, title: 'Controle de Exibição e Status', desc: 'Ative ou desative banners em 1 clique e reordene a sequência dos slides.' },
    ],
  },
];
