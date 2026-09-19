import {
  Product,
  Category,
  FiltersState,
  DashboardMetrics,
  ProductStatus,
  Subcategory,
} from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/produtos';

// In-memory catalog state for the client-side (prepared to swap for Express REST endpoints)
let productsState: Product[] = [...MOCK_PRODUCTS];
let categoriesState: Category[] = [...MOCK_CATEGORIES];

/**
 * Returns all active products applying optional filters and sorting
 */
export async function getProducts(filters?: Partial<FiltersState>): Promise<Product[]> {
  let result = productsState.filter(
    (p) => p.status === 'ACTIVE' || p.status === 'ATIVO'
  );

  if (!filters) return result;

  const searchQuery = filters.search || filters.busca;
  const categoryFilter = filters.category || filters.categoria;
  const genderFilter = filters.gender || filters.genero;
  const shapeFilter = filters.shape || filters.formato;
  const materialFilter = filters.material;
  const inStockOnly = filters.inStockOnly || filters.apenasEmEstoque;
  const sortBy = filters.sortBy || filters.ordenar;

  // Text search in title, SKU, description and category
  if (searchQuery && searchQuery.trim() !== '') {
    const term = searchQuery.toLowerCase().trim();
    result = result.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(term)) ||
        (p.titulo && p.titulo.toLowerCase().includes(term)) ||
        (p.parentSku && p.parentSku.toLowerCase().includes(term)) ||
        (p.skuPai && p.skuPai.toLowerCase().includes(term)) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.descricao && p.descricao.toLowerCase().includes(term)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(term)) ||
        (p.categoriaNome && p.categoriaNome.toLowerCase().includes(term))
    );
  }

  // Category filter
  if (categoryFilter && categoryFilter !== 'todas' && categoryFilter !== 'all') {
    const term = categoryFilter.toLowerCase();
    result = result.filter(
      (p) =>
        p.categoryId === categoryFilter ||
        p.categoriaId === categoryFilter ||
        (p.categoryName && p.categoryName.toLowerCase().includes(term)) ||
        (p.categoriaNome && p.categoriaNome.toLowerCase().includes(term))
    );
  }

  // Gender filter
  if (genderFilter && genderFilter !== 'todos' && genderFilter !== 'all') {
    result = result.filter((p) => {
      const g = p.gender || p.genero;
      return g === genderFilter || g === 'unissex' || g === 'unisex';
    });
  }

  // Shape filter
  if (shapeFilter && shapeFilter !== 'todos' && shapeFilter !== 'all') {
    const term = shapeFilter.toLowerCase();
    result = result.filter((p) => {
      const s = p.shape || p.formato;
      return s?.toLowerCase() === term;
    });
  }

  // Material filter
  if (materialFilter && materialFilter !== 'todos' && materialFilter !== 'all') {
    const term = materialFilter.toLowerCase();
    result = result.filter((p) => {
      const vars = p.variations || p.variacoes || [];
      return vars.some((v) => v.material.toLowerCase().includes(term));
    });
  }

  // Stock filter
  if (inStockOnly) {
    result = result.filter((p) => {
      const vars = p.variations || p.variacoes || [];
      return vars.some((v) => (v.stock ?? v.estoqueAtual ?? 0) > 0);
    });
  }

  // Sorting
  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
      case 'menor_preco':
        result.sort((a, b) => {
          const priceA = a.promotionalPrice || a.precoPromocional || a.price || a.precoVenda || 0;
          const priceB = b.promotionalPrice || b.precoPromocional || b.price || b.precoVenda || 0;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
      case 'maior_preco':
        result.sort((a, b) => {
          const priceA = a.promotionalPrice || a.precoPromocional || a.price || a.precoVenda || 0;
          const priceB = b.promotionalPrice || b.precoPromocional || b.price || b.precoVenda || 0;
          return priceB - priceA;
        });
        break;
      case 'newest':
      case 'novidades':
        result.sort((a, b) => {
          const isNewA = a.isNew || a.novidade ? 1 : 0;
          const isNewB = b.isNew || b.novidade ? 1 : 0;
          return isNewB - isNewA;
        });
        break;
      default:
        // Popular / Featured
        result.sort((a, b) => {
          const featA = a.featuredHome || a.destaqueHome ? 1 : 0;
          const featB = b.featuredHome || b.destaqueHome ? 1 : 0;
          return featB - featA;
        });
        break;
    }
  }

  return result;
}

/**
 * Returns a single product by ID, SKU or slug
 */
export async function getProductById(id?: string): Promise<Product | null> {
  if (!id) return null;
  const term = id.toLowerCase();
  const product = productsState.find(
    (p) =>
      p.id === id ||
      p.parentSku?.toLowerCase() === term ||
      p.skuPai?.toLowerCase() === term ||
      p.slug?.toLowerCase() === term
  );
  return product || null;
}

/**
 * Returns featured products for the Home showcase
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return productsState.filter(
    (p) => (p.status === 'ACTIVE' || p.status === 'ATIVO') && (p.featuredHome || p.destaqueHome)
  );
}

/**
 * Returns newly arrived products
 */
export async function getNewArrivalProducts(): Promise<Product[]> {
  return productsState.filter(
    (p) => (p.status === 'ACTIVE' || p.status === 'ATIVO') && (p.isNew || p.novidade)
  );
}

/**
 * Returns all system categories
 */
export async function getCategories(): Promise<Category[]> {
  return categoriesState;
}

/* ==========================================================================
   Admin Management Functions
   ========================================================================== */

/**
 * Returns all products for the Admin table (including hidden/archived)
 */
export async function getAdminProducts(): Promise<Product[]> {
  return [...productsState];
}

/**
 * Computes consolidated KPIs for the Admin Dashboard
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const total = productsState.length;
  const active = productsState.filter((p) => p.status === 'ACTIVE' || p.status === 'ATIVO').length;
  const hidden = productsState.filter((p) => p.status === 'HIDDEN' || p.status === 'OCULTO').length;

  let lowStock = 0;
  let outOfStock = 0;

  for (const prod of productsState) {
    const variations = prod.variations || prod.variacoes || [];
    const totalStock = variations.reduce(
      (acc, v) => acc + (v.stock ?? v.estoqueAtual ?? 0),
      0
    );
    if (totalStock === 0) {
      outOfStock++;
    } else if (totalStock <= 3) {
      lowStock++;
    }
  }

  return {
    totalProducts: total,
    activeProducts: active,
    hiddenProducts: hidden,
    lowStock,
    outOfStock,
    // Legacy aliases
    totalProdutos: total,
    produtosAtivos: active,
    produtosOcultos: hidden,
    estoqueBaixo: lowStock,
    esgotados: outOfStock,
  };
}

/**
 * Toggles product visibility status (Active / Hidden / Archived)
 */
export async function toggleProductVisibility(
  id: string,
  newStatus: ProductStatus
): Promise<boolean> {
  const index = productsState.findIndex((p) => p.id === id);
  if (index === -1) return false;
  productsState[index] = { ...productsState[index], status: newStatus };
  return true;
}

/**
 * Creates or updates a product in the catalog
 */
export async function saveAdminProduct(product: Product): Promise<Product> {
  const index = productsState.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    productsState[index] = { ...product };
    return productsState[index];
  } else {
    productsState.unshift(product);
    return product;
  }
}

/**
 * Adjusts real-time stock for a specific variation
 */
export async function adjustVariationStock(
  productId: string,
  variationId: string,
  newStock: number
): Promise<boolean> {
  const prod = productsState.find((p) => p.id === productId);
  if (!prod) return false;
  const variations = prod.variations || prod.variacoes || [];
  const variation = variations.find((v) => v.id === variationId);
  if (!variation) return false;

  const validStock = Math.max(0, newStock);
  variation.stock = validStock;
  variation.estoqueAtual = validStock;
  return true;
}

/**
 * Creates or updates a category
 */
export async function saveCategory(category: Category): Promise<Category> {
  const index = categoriesState.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    categoriesState[index] = { ...category };
    return categoriesState[index];
  } else {
    categoriesState.push(category);
    return category;
  }
}

/**
 * Deletes a category
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const index = categoriesState.findIndex((c) => c.id === id);
  if (index === -1) return false;
  categoriesState.splice(index, 1);
  return true;
}

/**
 * Creates or updates a subcategory inside a parent category
 */
export async function saveSubcategory(
  categoryId: string,
  subcategory: Subcategory
): Promise<boolean> {
  const cat = categoriesState.find((c) => c.id === categoryId);
  if (!cat) return false;
  if (!cat.subcategories) cat.subcategories = [];
  const index = cat.subcategories.findIndex((s) => s.id === subcategory.id);
  if (index >= 0) {
    cat.subcategories[index] = subcategory;
  } else {
    cat.subcategories.push(subcategory);
  }
  return true;
}

/**
 * Deletes a subcategory
 */
export async function deleteSubcategory(
  categoryId: string,
  subcategoryId: string
): Promise<boolean> {
  const cat = categoriesState.find((c) => c.id === categoryId);
  if (!cat || !cat.subcategories) return false;
  cat.subcategories = cat.subcategories.filter((s) => s.id !== subcategoryId);
  return true;
}

// Backward compatibility exports
export const getProdutos = getProducts;
export const getProdutoById = getProductById;
export const getProdutosDestaque = getFeaturedProducts;
export const getProdutosNovidades = getNewArrivalProducts;
export const getCategorias = getCategories;
export const getProdutosAdmin = getAdminProducts;
export const getMetricasDashboard = getDashboardMetrics;
export const alternarVisibilidadeProduto = toggleProductVisibility;
export const salvarProdutoAdmin = saveAdminProduct;
export const ajustarEstoqueVariacao = adjustVariationStock;
export const salvarCategoria = saveCategory;
export const excluirCategoria = deleteCategory;
export const salvarSubcategoria = saveSubcategory;
export const excluirSubcategoria = deleteSubcategory;
