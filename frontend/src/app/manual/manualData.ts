export interface ManualStep {
  num: number;
  title: string;
  desc: string;
  details?: string[];
  tip?: string;
  screenshot?: string;
}

export interface ManualModule {
  id: string;
  folder: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  videoFile: string;
  overview: string;
  screenshots: string[];
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
    overview:
      'Aprenda como acessar com segurança a plataforma administrativa da TS EYEWEAR. O acesso é restrito a administradores cadastrados e utiliza autenticação com sessão protegida.',
    screenshots: [
      '/manual/01-login/01-tela-login.png',
      '/manual/01-login/04-login-sucesso-redirecionamento.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Acessar a URL do Painel Administrativo',
        desc: 'Abra seu navegador moderno (Google Chrome, Edge, Safari ou Firefox) e digite o endereço oficial de administração: https://www.tsjoculos.com/admin.',
        details: [
          'Verifique o protocolo HTTPS no navegador para garantir uma conexão segura e criptografada.',
          'Caso já exista uma sessão ativa válida, você será redirecionado imediatamente ao Dashboard.',
        ],
        tip: 'Adicione esta página aos favoritos do seu navegador para facilitar acessos rotineiros de trabalho.',
        screenshot: '/manual/01-login/01-tela-login.png',
      },
      {
        num: 2,
        title: 'Preencher o E-mail Institucional',
        desc: 'No campo "E-mail de Acesso", insira o seu e-mail institucional corporativo autorizado (exemplo: admin@tseyewear.com.br).',
        details: [
          'Certifique-se de digitar sem espaços extras antes ou depois do endereço.',
          'O sistema aceita letras maiúsculas ou minúsculas de forma transparente.',
        ],
        screenshot: '/manual/01-login/02-preenchendo-email.png',
      },
      {
        num: 3,
        title: 'Digitar a Senha com Visualização Opcional',
        desc: 'Insira sua senha mestre de acesso. Você pode clicar no ícone de "olho" para conferir os caracteres digitados antes de enviar.',
        details: [
          'A senha é protegida por hash criptográfico seguro.',
          'Nunca compartilhe suas credenciais com terceiros não autorizados.',
        ],
        screenshot: '/manual/01-login/03-preenchendo-senha.png',
      },
      {
        num: 4,
        title: 'Confirmar no Botão de Entrada',
        desc: 'Clique no botão dourado "Entrar no Painel". O sistema valida suas credenciais e redireciona automaticamente para o Painel de Controle.',
        details: [
          'O botão exibe um indicador animado de processamento durante a verificação.',
          'Ao concluir, você entra diretamente na tela do Dashboard com todas as permissões liberadas.',
        ],
        screenshot: '/manual/01-login/04-login-sucesso-redirecionamento.png',
      },
      {
        num: 5,
        title: 'Conhecer a Barra Lateral de Navegação',
        desc: 'Após o login, a barra lateral esquerda dá acesso instantâneo a todos os módulos do sistema.',
        details: [
          'Dashboard: Métricas e visão geral da loja.',
          'Produtos: Catálogo de modelos, filtros, estoque e exclusão.',
          'Novo Produto: Cadastro completo de armações e solares.',
          'Mais Desejados: Curadoria da vitrine principal da Home.',
          'Categorias: Gestão de taxonomias e subcategorias.',
          'Banners: Carrossel Hero e cards fotográficos.',
          'Manual de Uso: Central oficial de aprendizado com vídeos e tutoriais.',
        ],
        tip: 'Em telas mobile, a barra lateral pode ser aberta pelo botão de menu hambúrguer no canto superior.',
        screenshot: '/manual/01-login/05-sidebar-navegacao.png',
      },
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
    overview:
      'O Dashboard reúne os principais indicadores de desempenho do catálogo da TS EYEWEAR em tempo real. Permite monitorar estoques, produtos ativos, ocultos e atalhos rápidos de gestão.',
    screenshots: [
      '/manual/02-dashboard/screenshot-01.png',
      '/manual/02-dashboard/screenshot-02.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Monitorar os Cartões de Indicadores (KPIs)',
        desc: 'No topo da página, quatro cartões analíticos trazem números consolidados direto do banco de dados.',
        details: [
          'Total de Modelos: Quantidade total de armações cadastradas no acervo.',
          'Modelos Ativos: Armações visíveis para compra e consulta na loja online.',
          'Ocultos / Rascunho: Modelos temporariamente pausados ou em preparação.',
          'Atenção ao Estoque: Alerta sobre peças com estoque zerado ou em níveis críticos.',
        ],
        tip: 'Carregamentos iniciais usam o efeito suave de Skeleton Screen para máxima fluidez.',
        screenshot: '/manual/02-dashboard/screenshot-01.png',
      },
      {
        num: 2,
        title: 'Utilizar os Atalhos de Gestão Rápida',
        desc: 'Acesse diretamente as operações mais comuns com um único clique a partir dos botões de ação rápida.',
        details: [
          'Cadastrar Novo Produto: Abre diretamente o formulário completo.',
          'Gerenciar Categorias: Leva à criação e edição de coleções.',
          'Configurar Banners: Acesso imediato à vitrine de destaques da Home.',
        ],
      },
      {
        num: 3,
        title: 'Acompanhar a Tabela de Modelos Recentes',
        desc: 'A tabela lista as últimas armações cadastradas ou atualizadas, permitindo verificar fotos, SKUs e status em um só lugar.',
        details: [
          'Thumbnail: Miniatura oficial da foto principal do modelo.',
          'Produto e SKU: Nome comercial e código de referência pai.',
          'Status do Modelo: Badge verde (Ativo) ou cinza (Oculto).',
          'Ações Rápidas: Botões diretos para editar ou visualizar o produto na loja.',
        ],
        screenshot: '/manual/02-dashboard/screenshot-02.png',
      },
    ],
  },
  {
    id: '03',
    folder: '03-Produtos',
    slug: '03-produtos',
    title: 'Módulo 03: Catálogo de Produtos',
    subtitle: 'Gestão de Modelos, Filtros, Estoque e Exclusão Segura',
    duration: '0:35',
    videoFile: 'video-03-produtos.mp4',
    overview:
      'Gerencie todas as armações do catálogo: realize buscas instantâneas, filtre por categorias ou status, alterne a visibilidade e exclua produtos com confirmação segura e feedback visual.',
    screenshots: [
      '/manual/03-produtos/screenshot-01.png',
      '/manual/03-produtos/screenshot-02.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Buscar Armações por Nome ou SKU',
        desc: 'Utilize a barra de pesquisa superior para encontrar qualquer modelo instantaneamente.',
        details: [
          'Digite parte do nome (ex: "Florence", "Milano") ou o código SKU (ex: "TS-9020").',
          'A busca filtra automaticamente em tempo real sem precisar recarregar a página.',
        ],
        screenshot: '/manual/03-produtos/screenshot-01.png',
      },
      {
        num: 2,
        title: 'Filtrar por Categoria e Visibilidade',
        desc: 'Combine filtros suspensos para isolar produtos específicos do seu interesse.',
        details: [
          'Filtro de Categorias: Selecione Receituário, Solar, Titanium, Infantil, etc.',
          'Filtro de Status: Escolha entre Todos, Apenas Ativos ou Apenas Ocultos.',
        ],
      },
      {
        num: 3,
        title: 'Ativar ou Ocultar Modelos na Loja Pública',
        desc: 'Controle se os clientes da loja online podem visualizar o produto com um clique no botão de status.',
        details: [
          'Ao desativar um produto, um modal de confirmação protege contra alterações involuntárias.',
          'O produto continua salvo no sistema e pode ser reativado a qualquer momento.',
        ],
        tip: 'Ao ocultar um modelo, o modal exibe o feedback visual de processamento até o sucesso.',
      },
      {
        num: 4,
        title: 'Excluir Produto com Segurança',
        desc: 'Para remover definitivamente um modelo do banco de dados, utilize o botão de lixeira vermelho.',
        details: [
          'Clique no ícone de lixeira na coluna de ações do produto.',
          'O modal confirma o nome e SKU do modelo antes de proceder.',
          'Ao clicar em "Sim, Excluir", o botão exibe o estado "Excluindo..." com spinner animado.',
          'Assim que a exclusão na API é confirmada, o modal de sucesso com ícone verde confirma a operação.',
        ],
        screenshot: '/manual/03-produtos/screenshot-02.png',
      },
    ],
  },
  {
    id: '04',
    folder: '04-Novo-Produto',
    slug: '04-novo-produto',
    title: 'Módulo 04: Cadastro Completo de Produto',
    subtitle: 'Informações Gerais, Mídias, Variações de Cores e Medidas Ópticas',
    duration: '0:50',
    videoFile: 'video-04-novo-produto.mp4',
    overview:
      'Cadastre um produto com todos os padrões técnicos de uma ótica de excelência: dados comerciais, upload de fotos no Vercel Blob, variações de cores com estoque e especificações de medidas.',
    screenshots: [
      '/manual/04-novo-produto/screenshot-01.png',
      '/manual/04-novo-produto/screenshot-02.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Preencher Identificação e SKU Pai',
        desc: 'Informe o título comercial e o código de referência mestre do modelo.',
        details: [
          'Título do Produto: Exemplo "Armação TS Florence Titanium".',
          'SKU Pai: Código único identificador (ex: "TS-9020").',
          'Gênero: Escolha entre Feminino, Masculino ou Unissex.',
          'Formato: Redondo, Quadrado, Retangular, Aviador, Gatinho, etc.',
          'Material: Acetato Italiano, Titanium Nobre, Metal, Injetado, etc.',
        ],
        screenshot: '/manual/04-novo-produto/screenshot-01.png',
      },
      {
        num: 2,
        title: 'Definir Preços e Categoria',
        desc: 'Insira os valores comerciais em Reais (R$) e vincule à categoria principal da loja.',
        details: [
          'Preço de Venda: Valor base da armação.',
          'Preço Promocional: Valor com desconto especial (opcional).',
          'Categoria: Selecione a coleção correspondente.',
        ],
      },
      {
        num: 3,
        title: 'Cadastrar Variações de Cores e Estoque',
        desc: 'Cada modelo pode ter múltiplas cores, cada uma com seu código SKU filho e quantidade em estoque.',
        details: [
          'Nome da Cor: Ex: Preto Fosco, Tartaruga Âmbar, Dourado Rosé.',
          'Seletor Hexadecimal: Escolha a tonalidade exata para exibição dos swatches.',
          'SKU da Variação: Ex: TS-9020-BLK.',
          'Estoque Disponível: Quantidade física em depósito.',
        ],
      },
      {
        num: 4,
        title: 'Upload de Mídias e Fotos do Produto',
        desc: 'Selecione as fotos tratadas em alta definição para envio na nuvem.',
        details: [
          'Formatos aceitos: WebP, PNG ou JPG de alta qualidade.',
          'Defina qual foto será a Imagem Principal de capa da vitrine.',
          'As imagens são otimizadas e servidas via CDN de alta velocidade.',
        ],
      },
      {
        num: 5,
        title: 'Especificar as Medidas Ópticas Técnicas',
        desc: 'Preencha as medidas milimétricas cruciais para que o cliente saiba o ajuste exato ao rosto.',
        details: [
          'Largura da Lente (Aro): Ex: 54 mm.',
          'Ponte Nasal: Ex: 18 mm.',
          'Comprimento da Haste: Ex: 145 mm.',
        ],
      },
      {
        num: 6,
        title: 'Salvar e Publicar o Produto',
        desc: 'Clique em "Salvar Produto". O sistema salva o registro completo e exibe a confirmação amigável de sucesso com opção de voltar à listagem.',
        screenshot: '/manual/04-novo-produto/screenshot-02.png',
      },
    ],
  },
  {
    id: '05',
    folder: '05-Destaques',
    slug: '05-destaques',
    title: 'Módulo 05: Modelos Mais Desejados (Home)',
    subtitle: 'Curadoria da Vitrine Principal e Etiqueta de Lançamento',
    duration: '0:25',
    videoFile: 'video-05-destaques.mp4',
    overview:
      'Personalize a vitrine mais nobre da loja pública: escolha quais armações aparecem na seção "Mais Desejados" da Home e defina quais peças recebem o selo verde de "Lançamento".',
    screenshots: [
      '/manual/05-destaques/screenshot-01.png',
      '/manual/05-destaques/screenshot-02.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Compreender a Vitrine da Página Inicial',
        desc: 'A seção Mais Desejados é o primeiro ponto de contato do cliente com seus produtos mais atraentes.',
        details: [
          'Recomenda-se manter entre 4 e 8 modelos destacados para um layout harmônico.',
          'Produtos adicionados aparecem imediatamente na Home pública.',
        ],
        screenshot: '/manual/05-destaques/screenshot-01.png',
      },
      {
        num: 2,
        title: 'Adicionar um Modelo à Vitrine',
        desc: 'No topo da página, abra o seletor com busca integrada para escolher uma armação já cadastrada.',
        details: [
          'Digite o nome ou código do modelo para localizar na lista.',
          'Marque a caixa "Marcar como Lançamento" se desejar adicionar a etiqueta verde de destaque.',
          'Clique em "+ Adicionar aos Mais Desejados" e confira o modal de sucesso.',
        ],
      },
      {
        num: 3,
        title: 'Alternar Selo de Lançamento em 1 Clique',
        desc: 'Na grade de produtos em destaque, clique diretamente no botão de status de lançamento para ativar ou desativar o badge verde a qualquer momento.',
      },
      {
        num: 4,
        title: 'Remover Modelo da Vitrine',
        desc: 'Para retirar um produto da Home sem excluí-lo do catálogo geral, clique no botão "Remover da Home".',
        details: [
          'O modal confirma a ação informando que o produto continuará existindo normalmente no catálogo.',
          'Ao confirmar, o botão mostra o estado "Removendo..." e confirma com o modal de sucesso.',
        ],
        screenshot: '/manual/05-destaques/screenshot-02.png',
      },
    ],
  },
  {
    id: '06',
    folder: '06-Categorias',
    slug: '06-categorias',
    title: 'Módulo 06: Gestão de Categorias',
    subtitle: 'Estruturação do Menu da Loja, Subcategorias e URLs Amigáveis',
    duration: '0:30',
    videoFile: 'video-06-categorias.mp4',
    overview:
      'Organize a taxonomia de coleções da TS EYEWEAR. Crie novas categorias principais, defina slugs limpos para SEO e vincule subcategorias com facilidade.',
    screenshots: [
      '/manual/06-categorias/screenshot-01.png',
      '/manual/06-categorias/screenshot-02.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Visualizar as Coleções Atuais',
        desc: 'A grade de categorias exibe cada linha principal com seu slug amigável e as subcategorias associadas.',
        details: [
          'Exemplos: Armações de Grau (slug /armacoes-de-grau), Óculos de Sol (slug /oculos-de-sol).',
          'Cada card mostra botões para editar o nome da categoria ou excluí-la.',
        ],
        screenshot: '/manual/06-categorias/screenshot-01.png',
      },
      {
        num: 2,
        title: 'Criar uma Nova Categoria Principal',
        desc: 'Clique no botão "+ Nova Categoria Principal" no topo da página.',
        details: [
          'Nome da Categoria: Digite o nome comercial (ex: "Linha Titanium").',
          'Slug Automático: O sistema gera o slug URL automaticamente (ex: "linha-titanium"), mas você pode personalizar se desejar.',
          'Clique em "Criar Categoria": O modal de feedback confirma a criação no banco de dados com sucesso.',
        ],
      },
      {
        num: 3,
        title: 'Adicionar e Remover Subcategorias',
        desc: 'Em cada card de categoria, você pode adicionar sub-divisões específicas em segundos.',
        details: [
          'No campo de texto do card, digite o nome da subcategoria (ex: "Feminino", "Masculino", "Acetato").',
          'Pressione Enter ou clique em "+ Adicionar" para vincular imediatamente.',
          'Para remover uma subcategoria, clique no "X" ao lado da tag com confirmação segura.',
        ],
      },
      {
        num: 4,
        title: 'Excluir uma Categoria',
        desc: 'Clique no botão de lixeira no card da categoria desejada.',
        details: [
          'O modal alerta que produtos vinculados precisarão ser reclassificados.',
          'Ao clicar em "Sim, Excluir", o modal exibe o feedback visual de exclusão e finaliza com o modal verde de sucesso.',
        ],
        screenshot: '/manual/06-categorias/screenshot-02.png',
      },
    ],
  },
  {
    id: '07',
    folder: '07-Banners',
    slug: '07-banners',
    title: 'Módulo 07: Banners Promocionais',
    subtitle: 'Carrossel Hero do Topo e Cards Fotográficos de Categorias',
    duration: '0:45',
    videoFile: 'video-07-banners.mp4',
    overview:
      'Controle o impacto visual de abertura da loja: configure os banners panorâmicos 1330×400 do carrossel principal e os cartões fotográficos de navegação por categoria na Home.',
    screenshots: [
      '/manual/07-banners/screenshot-01.png',
      '/manual/07-banners/screenshot-02.png',
    ],
    steps: [
      {
        num: 1,
        title: 'Conhecer as Dimensões Técnicas Obrigatórias',
        desc: 'Para garantir nitidez perfeita sem distorções em qualquer tela, respeite os padrões técnicos informados no painel.',
        details: [
          'Dimensão Fixa do Banner Hero: Exatamente 1330 × 400 pixels.',
          'Formatos Aceitos: WebP (recomendado pela leveza), PNG ou JPG de alta resolução.',
          'Tamanho Máximo por Arquivo: Até 5 MB.',
          'Transição Automática: Slides alternam a cada 5 segundos na loja online.',
        ],
        screenshot: '/manual/07-banners/screenshot-01.png',
      },
      {
        num: 2,
        title: 'Cadastrar um Novo Banner Hero',
        desc: 'Clique em "+ Novo Banner Hero" para abrir o modal de criação.',
        details: [
          'Upload da Imagem: Arraste a foto 1330×400 ou selecione do seu computador.',
          'Título do Banner: Mensagem de destaque (ex: "Coleção Primavera-Verão").',
          'Subtítulo / Chamada: Texto de apoio sobre a promoção ou lançamento.',
          'Texto do Botão: Chamada para ação (ex: "Explorar Coleção").',
          'Link de Destino: URL interna para onde o cliente será levado (ex: "/catalogo?categoria=solar").',
          'Ordem de Exibição: Posição do slide no carrossel (1, 2, 3...).',
        ],
      },
      {
        num: 3,
        title: 'Ativar, Pausar ou Excluir Banners',
        desc: 'Gerencie a exibição de cada slide com controles diretos em cada card.',
        details: [
          'Pausar / Ativar: Alterne o botão para suspender temporariamente um banner sazonal sem perdê-lo.',
          'Editar: Altere links, títulos ou imagem a qualquer instante.',
          'Excluir: Clique no botão de lixeira para remover o banner definitivamente com confirmação e modal de sucesso.',
        ],
      },
      {
        num: 4,
        title: 'Gerenciar Cards de Categorias da Home',
        desc: 'Na aba "Cards de Categorias da Home", personalize os 3 cartões visuais com foto e chamada que direcionam o cliente para as principais seções do catálogo.',
        screenshot: '/manual/07-banners/screenshot-02.png',
      },
    ],
  },
];
