import {
  Product,
  Category,
  FiltersState,
  DashboardMetrics,
  ProductStatus,
  Subcategory,
  ProductMedia,
  ProductVariation,
} from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../data/produtos';
import { getAdminToken, logoutAdmin } from './auth.service';

const getApiBaseUrl = () => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

let productsState: Product[] = [...MOCK_PRODUCTS];
let categoriesState: Category[] = [...MOCK_CATEGORIES];

export function normalizeMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.includes('.vercel.app/api/midia/blob')) {
    return url.replace(
      /https:\/\/[^/]+\.vercel\.app\/api\/midia\/blob/,
      'https://otica-tiago-backend.vercel.app/api/midia/blob'
    );
  }
  return url;
}

export function mapBackendProductToFrontend(p: any): Product {
  const variations: ProductVariation[] = (p.variacoes || p.variations || []).map(
    (v: any) => ({
      id: v.id,
      skuVariation: v.skuVariacao || v.skuVariation || '',
      skuVariacao: v.skuVariacao || v.skuVariation || '',
      colorName: v.corNome || v.colorName || 'Padrão',
      corNome: v.corNome || v.colorName || 'Padrão',
      colorHex: v.corHex || v.colorHex || '#000000',
      corHex: v.corHex || v.colorHex || '#000000',
      imageUrl: normalizeMediaUrl(v.imageUrl || v.fotoUrl),
      lensWidthMm: v.aroMm ?? v.lensWidthMm ?? 52,
      aroMm: v.aroMm ?? v.lensWidthMm ?? 52,
      bridgeMm: v.ponteMm ?? v.bridgeMm ?? 19,
      ponteMm: v.ponteMm ?? v.bridgeMm ?? 19,
      templeMm: v.hasteMm ?? v.templeMm ?? 142,
      hasteMm: v.hasteMm ?? v.templeMm ?? 142,
      material: v.material || 'Acetato',
      stock: v.estoqueAtual ?? v.stock ?? 0,
      estoqueAtual: v.estoqueAtual ?? v.stock ?? 0,
      customPrice: v.precoDiferenciado ? Number(v.precoDiferenciado) : undefined,
      precoDiferenciado: v.precoDiferenciado ? Number(v.precoDiferenciado) : undefined,
      isActive: v.statusAtivo ?? v.isActive ?? true,
      statusAtivo: v.statusAtivo ?? v.isActive ?? true,
    })
  );

  const media: ProductMedia[] = (p.midias || p.media || []).map(
    (m: any, idx: number) => ({
      id: m.id || `m-${idx}`,
      url: normalizeMediaUrl(m.url),
      type: m.tipo === 'VIDEO' || m.type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
      tipo: m.tipo === 'VIDEO' || m.type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
      order: m.ordem ?? m.order ?? idx + 1,
      ordem: m.ordem ?? m.order ?? idx + 1,
      isPrimary: Boolean(m.principal ?? m.isPrimary ?? idx === 0),
      principal: Boolean(m.principal ?? m.isPrimary ?? idx === 0),
    })
  );

  return {
    id: p.id,
    parentSku: p.skuPai || p.parentSku || '',
    skuPai: p.skuPai || p.parentSku || '',
    title: p.titulo || p.title || '',
    titulo: p.titulo || p.title || '',
    slug: p.slug || '',
    description: p.descricao || p.description || '',
    descricao: p.descricao || p.description || '',
    price: Number(p.precoVenda || p.price || 0),
    precoVenda: Number(p.precoVenda || p.price || 0),
    promotionalPrice: p.precoPromocional
      ? Number(p.precoPromocional)
      : p.promotionalPrice
      ? Number(p.promotionalPrice)
      : undefined,
    precoPromocional: p.precoPromocional
      ? Number(p.precoPromocional)
      : p.promotionalPrice
      ? Number(p.promotionalPrice)
      : undefined,
    featuredHome: Boolean(p.destaqueHome ?? p.featuredHome),
    destaqueHome: Boolean(p.destaqueHome ?? p.featuredHome),
    isNew: Boolean(p.novidade ?? p.isNew),
    novidade: Boolean(p.novidade ?? p.isNew),
    isOutlet: Boolean(p.outlet ?? p.isOutlet),
    outlet: Boolean(p.outlet ?? p.isOutlet),
    status: p.status || 'ATIVO',
    categoryId: p.categoriaId || p.categoryId || '',
    categoriaId: p.categoriaId || p.categoryId || '',
    categoryName: p.categoria?.nome || p.categoriaNome || p.categoryName || '',
    categoriaNome: p.categoria?.nome || p.categoriaNome || p.categoryName || '',
    subcategoryId: p.subcategoriaId || p.subcategoryId,
    subcategoriaId: p.subcategoriaId || p.subcategoryId,
    subcategoryName: p.subcategoria?.nome || p.subcategoriaNome || p.subcategoryName,
    subcategoriaNome: p.subcategoria?.nome || p.subcategoriaNome || p.subcategoryName,
    shape: p.formato || p.shape || 'Redondo',
    gender: p.genero || p.gender || 'unissex',
    variations,
    variacoes: variations,
    media,
    midias: media,
  };
}

export async function getProducts(
  filters?: Partial<FiltersState>
): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const params = new URLSearchParams();

    if (filters?.search || filters?.busca) {
      params.set('busca', (filters.search || filters.busca)!);
    }
    if (filters?.category || filters?.categoria) {
      params.set('categoria', (filters.category || filters.categoria)!);
    }
    if (filters?.gender || filters?.genero) {
      params.set('genero', (filters.gender || filters.genero)!);
    }
    if (filters?.shape || filters?.formato) {
      params.set('formato', (filters.shape || filters.formato)!);
    }
    if (filters?.material) {
      params.set('material', filters.material);
    }
    if (filters?.inStockOnly || filters?.apenasEmEstoque) {
      params.set('apenasEmEstoque', 'true');
    }
    if (filters?.sortBy || filters?.ordenar) {
      params.set('ordenar', (filters.sortBy || filters.ordenar)!);
    }
    if (!params.has('limite')) {
      params.set('limite', '50');
    }

    const qs = params.toString();
    const res = await fetch(`${baseUrl}/produtos${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
        return json.dados.map(mapBackendProductToFrontend);
      }
    }
  } catch (err) {
    console.warn('API pública indisponível, usando catálogo mock:', err);
  }

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

  if (categoryFilter && categoryFilter !== 'todas' && categoryFilter !== 'all') {
    const term = categoryFilter.toLowerCase();
    const cleanTerm = term.replace(/-/g, ' ');
    result = result.filter((p) => {
      const catId = (p.categoryId || p.categoriaId || '').toLowerCase();
      const catName = (p.categoryName || p.categoriaNome || '').toLowerCase();
      return (
        catId === term ||
        catId === cleanTerm ||
        catName.includes(term) ||
        catName.includes(cleanTerm) ||
        (term.includes('grau') && catName.includes('grau')) ||
        ((term.includes('sol') || term.includes('solar')) && catName.includes('sol')) ||
        (term.includes('clip') && catName.includes('clip')) ||
        (term === 'outlet' && (p.isOutlet || p.outlet)) ||
        (term === 'novidades' && (p.isNew || p.novidade))
      );
    });
  }

  if (genderFilter && genderFilter !== 'todos' && genderFilter !== 'all') {
    result = result.filter((p) => {
      const g = p.gender || p.genero;
      return g === genderFilter || g === 'unissex' || g === 'unisex';
    });
  }

  if (shapeFilter && shapeFilter !== 'todos' && shapeFilter !== 'all') {
    const term = shapeFilter.toLowerCase();
    result = result.filter((p) => {
      const s = p.shape || p.formato;
      return s?.toLowerCase() === term;
    });
  }

  if (materialFilter && materialFilter !== 'todos' && materialFilter !== 'all') {
    const term = materialFilter.toLowerCase();
    result = result.filter((p) => {
      const vars = p.variations || p.variacoes || [];
      return vars.some((v) => v.material.toLowerCase().includes(term));
    });
  }

  if (inStockOnly) {
    result = result.filter((p) => {
      const vars = p.variations || p.variacoes || [];
      return vars.some((v) => (v.stock ?? v.estoqueAtual ?? 0) > 0);
    });
  }

  if (sortBy) {
    switch (sortBy) {
      case 'price_asc':
      case 'menor_preco':
        result.sort((a, b) => {
          const priceA =
            a.promotionalPrice || a.precoPromocional || a.price || a.precoVenda || 0;
          const priceB =
            b.promotionalPrice || b.precoPromocional || b.price || b.precoVenda || 0;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
      case 'maior_preco':
        result.sort((a, b) => {
          const priceA =
            a.promotionalPrice || a.precoPromocional || a.price || a.precoVenda || 0;
          const priceB =
            b.promotionalPrice || b.precoPromocional || b.price || b.precoVenda || 0;
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

export async function getProductById(id?: string): Promise<Product | null> {
  if (!id) return null;

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/produtos/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && json.dados) {
        return mapBackendProductToFrontend(json.dados);
      }
    }
  } catch (err) {
  }

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

export async function getFeaturedProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.featuredHome || p.destaqueHome);
}

export async function getNewArrivalProducts(): Promise<Product[]> {
  const all = await getProducts();
  return all.filter((p) => p.isNew || p.novidade);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/categorias`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
        categoriesState = json.dados;
        return categoriesState;
      }
    }
  } catch (err) {
    console.warn('API de categorias indisponível, usando dados mock:', err);
  }
  return categoriesState;
}

export async function getAdminProducts(): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const headers = getAuthHeaders();
    const res = await fetch(`${baseUrl}/admin/produtos?limite=100`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados)) {
        const mapped = json.dados.map(mapBackendProductToFrontend);
        if (mapped.length > 0) {
          productsState = mapped;
          return mapped;
        }
      }
    }
  } catch (err) {
    console.warn('Falha ao carregar produtos da API admin:', err);
  }

  return [...productsState];
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const prods = await getAdminProducts();
  const total = prods.length;
  const active = prods.filter(
    (p) => p.status === 'ACTIVE' || p.status === 'ATIVO'
  ).length;
  const hidden = prods.filter(
    (p) => p.status === 'HIDDEN' || p.status === 'OCULTO'
  ).length;

  let lowStock = 0;
  let outOfStock = 0;

  for (const prod of prods) {
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
    totalProdutos: total,
    produtosAtivos: active,
    produtosOcultos: hidden,
    estoqueBaixo: lowStock,
    esgotados: outOfStock,
  };
}

export async function toggleProductVisibility(
  id: string,
  newStatus: ProductStatus
): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();
  const statusBackend =
    newStatus === 'ACTIVE' || newStatus === 'ATIVO'
      ? 'ATIVO'
      : newStatus === 'ARCHIVED' || newStatus === 'ARQUIVADO'
      ? 'ARQUIVADO'
      : 'OCULTO';

  const res = await fetch(`${baseUrl}/admin/produtos/${id}/visibilidade`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: JSON.stringify({ status: statusBackend }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.erro || 'Falha ao alternar visibilidade via API.');
  }

  const data = await res.json();
  if (data.sucesso) {
    const index = productsState.findIndex((p) => p.id === id);
    if (index !== -1) productsState[index].status = newStatus;
    return true;
  }
  return false;
}

export async function toggleProductHighlight(
  id: string,
  options: { destaqueHome?: boolean; novidade?: boolean }
): Promise<Product | null> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(`${baseUrl}/admin/produtos/${id}/destaque`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: JSON.stringify(options),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.erro || 'Falha ao atualizar destaques na API.');
  }

  const json = await res.json();
  if (json.sucesso && json.dados) {
    const updated = mapBackendProductToFrontend(json.dados);
    const idx = productsState.findIndex((p) => p.id === id);
    if (idx >= 0) productsState[idx] = updated;
    return updated;
  }
  return null;
}

export async function saveAdminProduct(product: Product): Promise<Product> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const payload = {
    skuPai: product.parentSku || product.skuPai,
    titulo: product.title || product.titulo,
    slug: product.slug,
    descricao: product.description || product.descricao || '',
    precoVenda: Number(product.price || product.precoVenda),
    precoPromocional:
      product.promotionalPrice || product.precoPromocional
        ? Number(product.promotionalPrice || product.precoPromocional)
        : null,
    destaqueHome: Boolean(product.featuredHome || product.destaqueHome),
    novidade: Boolean(product.isNew || product.novidade),
    outlet: Boolean(product.isOutlet || product.outlet),
    status:
      product.status === 'ACTIVE' || product.status === 'ATIVO'
        ? 'ATIVO'
        : product.status === 'ARCHIVED' || product.status === 'ARQUIVADO'
        ? 'ARQUIVADO'
        : 'OCULTO',
    categoriaId: product.categoryId || product.categoriaId,
    subcategoriaId: product.subcategoryId || product.subcategoriaId || null,
    variacoes: (product.variations || product.variacoes || []).map((v) => ({
      skuVariacao: v.skuVariation || v.skuVariacao,
      corNome: v.colorName || v.corNome,
      corHex: v.colorHex || v.corHex,
      aroMm: v.lensWidthMm || v.aroMm || 52,
      ponteMm: v.bridgeMm || v.ponteMm || 19,
      hasteMm: v.templeMm || v.hasteMm || 142,
      material: v.material,
      estoqueAtual: v.stock ?? v.estoqueAtual ?? 0,
      precoDiferenciado: v.customPrice ?? v.precoDiferenciado ?? null,
      statusAtivo: v.isActive ?? v.statusAtivo ?? true,
    })),
    midias: (product.media || product.midias || []).map((m, idx) => ({
      url: m.url,
      tipo: m.type === 'VIDEO' ? 'VIDEO' : 'IMAGEM',
      ordem: m.order ?? m.ordem ?? idx + 1,
      principal: Boolean(m.isPrimary || m.principal),
    })),
  };

  const isEdit =
    product.id && product.id.length > 10 && !product.id.startsWith('prod-');
  const url = isEdit
    ? `${baseUrl}/admin/produtos/${product.id}`
    : `${baseUrl}/admin/produtos`;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (res.ok && data.sucesso && data.dados) {
    const saved = mapBackendProductToFrontend(data.dados);
    const idx = productsState.findIndex((p) => p.id === saved.id);
    if (idx >= 0) productsState[idx] = saved;
    else productsState.unshift(saved);
    return saved;
  }
  throw new Error(data.erro || 'Falha ao salvar produto no banco de dados.');
}

export async function uploadMediaAdmin(
  file: File,
  prefixo = 'produto'
): Promise<string> {
  const baseUrl = getApiBaseUrl();
  const token = getAdminToken();

  const formData = new FormData();
  formData.append('imagem', file);
  formData.append('prefixo', prefixo);

  const res = await fetch(`${baseUrl}/admin/midia/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.sucesso) {
    if (res.status === 401 && typeof window !== 'undefined') {
      logoutAdmin();
      window.location.href = '/admin';
    }
    throw new Error(data.erro || 'Falha ao enviar imagem para o armazenamento.');
  }

  return data.dados.url;
}

export async function adjustVariationStock(
  productId: string,
  variationId: string,
  newStock: number
): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(
    `${baseUrl}/admin/produtos/variacoes/${variationId}/estoque`,
    {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        novoEstoque: Math.max(0, newStock),
        motivo: 'Ajuste manual via Painel Administrativo',
      }),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    const prod = productsState.find((p) => p.id === productId);
    if (prod) {
      const variations = prod.variations || prod.variacoes || [];
      const variation = variations.find((v) => v.id === variationId);
      if (variation) {
        const validStock = Math.max(0, newStock);
        variation.stock = validStock;
        variation.estoqueAtual = validStock;
      }
    }
    return true;
  }
  throw new Error(data.erro || 'Falha ao atualizar estoque da variação na API.');
}

export async function saveCategory(category: Category): Promise<Category> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const isEdit = category.id && category.id.length > 10;
  const url = isEdit
    ? `${baseUrl}/admin/categorias/${category.id}`
    : `${baseUrl}/admin/categorias`;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: JSON.stringify({
      nome: category.nome || category.name,
      slug: category.slug,
      ordem: category.ordem ?? category.order ?? 1,
      ativo: category.ativo ?? category.isActive ?? true,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso && data.dados) {
    const saved = data.dados;
    const index = categoriesState.findIndex((c) => c.id === saved.id);
    if (index >= 0) categoriesState[index] = saved;
    else categoriesState.push(saved);
    return saved;
  }
  throw new Error(data.erro || 'Falha ao salvar categoria no banco de dados.');
}

export async function deleteCategory(id: string): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(`${baseUrl}/admin/categorias/${id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    const index = categoriesState.findIndex((c) => c.id === id);
    if (index !== -1) categoriesState.splice(index, 1);
    return true;
  }
  throw new Error(data.erro || 'Falha ao excluir categoria no banco de dados.');
}

export async function saveSubcategory(
  categoryId: string,
  subcategory: Subcategory
): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(
    `${baseUrl}/admin/categorias/${categoryId}/subcategorias`,
    {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        nome: subcategory.nome || subcategory.name,
        slug: subcategory.slug,
      }),
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    return true;
  }
  throw new Error(data.erro || 'Falha ao salvar subcategoria na API.');
}

export async function deleteSubcategory(
  categoryId: string,
  subcategoryId: string
): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(
    `${baseUrl}/admin/categorias/subcategorias/${subcategoryId}`,
    {
      method: 'DELETE',
      headers,
      credentials: 'include',
    }
  );

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    const cat = categoriesState.find((c) => c.id === categoryId);
    if (cat && cat.subcategories) {
      cat.subcategories = cat.subcategories.filter((s) => s.id !== subcategoryId);
    }
    return true;
  }
  throw new Error(data.erro || 'Falha ao excluir subcategoria na API.');
}

export const getProdutos = getProducts;
export const getProdutoById = getProductById;
export const getProdutosDestaque = getFeaturedProducts;
export const getProdutosNovidades = getNewArrivalProducts;
export const getCategorias = getCategories;
export const getProdutosAdmin = getAdminProducts;
export const getMetricasDashboard = getDashboardMetrics;
export const alternarVisibilidadeProduto = toggleProductVisibility;
export const alternarDestaqueProduto = toggleProductHighlight;
export const salvarProdutoAdmin = saveAdminProduct;
export const ajustarEstoqueVariacao = adjustVariationStock;
export const salvarCategoria = saveCategory;
export const excluirCategoria = deleteCategory;
export const salvarSubcategoria = saveSubcategory;
export const excluirSubcategoria = deleteSubcategory;
export const uploadProductImage = uploadMediaAdmin;
