export type ProductStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED' | 'ATIVO' | 'OCULTO' | 'ARQUIVADO';
export type MediaType = 'IMAGE' | 'VIDEO' | 'IMAGEM';

export interface ProductMedia {
  id: string;
  url: string;
  type: MediaType;
  order: number;
  isPrimary: boolean;
  variationId?: string;
  // Legacy aliases
  ordem?: number;
  principal?: boolean;
  tipo?: MediaType;
}

export interface ProductVariation {
  id: string;
  skuVariation: string;
  colorName: string;
  colorHex?: string;
  lensWidthMm: number;
  bridgeMm: number;
  templeMm: number;
  material: string;
  stock: number;
  customPrice?: number;
  isActive: boolean;
  imageUrl?: string;
  // Legacy aliases
  skuVariacao?: string;
  corNome?: string;
  corHex?: string;
  aroMm?: number;
  ponteMm?: number;
  hasteMm?: number;
  estoqueAtual?: number;
  precoDiferenciado?: number;
  statusAtivo?: boolean;
  imagemUrl?: string;
}

export interface Product {
  id: string;
  parentSku: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  featuredHome: boolean;
  isNew: boolean;
  isOutlet: boolean;
  status: ProductStatus;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  subcategoryName?: string;
  shape?: string;
  gender?: 'feminino' | 'masculino' | 'unissex' | 'infantil' | 'female' | 'male' | 'unisex' | 'kids';
  variations: ProductVariation[];
  media: ProductMedia[];

  // Legacy aliases
  skuPai?: string;
  titulo?: string;
  descricao?: string;
  precoVenda?: number;
  precoPromocional?: number;
  destaqueHome?: boolean;
  novidade?: boolean;
  outlet?: boolean;
  categoriaId?: string;
  categoriaNome?: string;
  subcategoriaId?: string;
  subcategoriaNome?: string;
  formato?: string;
  genero?: 'feminino' | 'masculino' | 'unissex' | 'infantil' | 'female' | 'male' | 'unisex' | 'kids';
  variacoes?: ProductVariation[];
  midias?: ProductMedia[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  // Legacy alias
  nome?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  isActive?: boolean;
  subcategories?: Subcategory[];
  // Legacy aliases
  nome?: string;
  ordem?: number;
  ativo?: boolean;
  subcategorias?: Subcategory[];
}

export interface FiltersState {
  search: string;
  category: string;
  gender: string;
  shape: string;
  material: string;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'populares' | 'menor_preco' | 'maior_preco' | 'novidades';
  inStockOnly: boolean;

  // Legacy aliases
  busca?: string;
  categoria?: string;
  genero?: string;
  formato?: string;
  ordenar?: 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'populares' | 'menor_preco' | 'maior_preco' | 'novidades';
  apenasEmEstoque?: boolean;
}

export interface DashboardMetrics {
  totalProducts: number;
  activeProducts: number;
  hiddenProducts: number;
  lowStock: number;
  outOfStock: number;

  // Legacy aliases
  totalProdutos?: number;
  produtosAtivos?: number;
  produtosOcultos?: number;
  estoqueBaixo?: number;
  esgotados?: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
  badgeTitle?: string;
  badgeSub?: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export interface HomeCategoryCard {
  id: string;
  title: string;
  sub: string;
  link: string;
  img: string;
  order: number;
  isActive: boolean;
}

export interface HomeCategorySectionConfig {
  eyebrow: string;
  title: string;
  description: string;
}

// Backward compatibility type aliases
export type StatusProduto = ProductStatus;
export type TipoMidia = MediaType;
export type ProdutoMidia = ProductMedia;
export type ProdutoVariacao = ProductVariation;
export type Produto = Product;
export type Subcategoria = Subcategory;
export type Categoria = Category;
export type FiltrosState = FiltersState;
export type MetricasDashboard = DashboardMetrics;
