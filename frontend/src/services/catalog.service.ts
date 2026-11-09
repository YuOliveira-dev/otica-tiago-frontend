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

let productsState: Product[] = [];
let categoriesState: Category[] = [];

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
      params.set('busca', (filters.search || filters.busca)!.trim());
    }
    const cat = filters?.category || filters?.categoria;
    if (cat && cat !== 'todas' && cat !== 'all') {
      params.set('categoria', cat.trim());
    }
    const gen = filters?.gender || filters?.genero;
    if (gen && gen !== 'todos' && gen !== 'all') {
      params.set('genero', gen.trim());
    }
    const shp = filters?.shape || filters?.formato;
    if (shp && shp !== 'todos' && shp !== 'all') {
      params.set('formato', shp.trim());
    }
    const mat = filters?.material;
    if (mat && mat !== 'todos' && mat !== 'all') {
      params.set('material', mat.trim());
    }
    if (filters?.inStockOnly || filters?.apenasEmEstoque) {
      params.set('apenasEmEstoque', 'true');
    }
    if (filters?.sortBy || filters?.ordenar) {
      params.set('ordenar', (filters.sortBy || filters.ordenar)!);
    }
    if (!params.has('limite')) {
      params.set('limite', '2000');
    }

    const qs = params.toString();
    const res = await fetch(`${baseUrl}/produtos${qs ? `?${qs}` : ''}`, {
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados)) {
        const mapped = json.dados.map(mapBackendProductToFrontend);
        productsState = mapped;
        return mapped;
      }
    }
  } catch (err) {
    console.warn('API pública indisponível:', err);
  }

  return [];
}

export async function getProductById(id?: string): Promise<Product | null> {
  if (!id) return null;

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/produtos/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && json.dados) {
        return mapBackendProductToFrontend(json.dados);
      }
    }
  } catch (err) {
    console.warn('Falha ao buscar produto por ID:', err);
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
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/produtos/destaques`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
        return json.dados.map(mapBackendProductToFrontend);
      }
    }
  } catch (err) {
    console.warn('Falha ao carregar produtos em destaque da API:', err);
  }

  const all = await getProducts();
  return all.slice(0, 8);
}

export async function getNewArrivalProducts(): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/produtos/novidades`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
        return json.dados.map(mapBackendProductToFrontend);
      }
    }
  } catch (err) {
    console.warn('Falha ao carregar produtos novidades da API:', err);
  }

  const all = await getProducts({ sortBy: 'novidades' });
  return all.filter((p) => p.isNew || p.novidade).slice(0, 8);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/categorias`, { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados) && json.dados.length > 0) {
        categoriesState = json.dados.map((c: any) => ({
          id: c.id,
          name: c.nome || c.name,
          nome: c.nome || c.name,
          slug: c.slug,
          order: c.ordem ?? c.order ?? 1,
          ordem: c.ordem ?? c.order ?? 1,
          subcategories: c.subcategorias || c.subcategories || [],
          totalProdutosAtivos: c.totalProdutosAtivos,
        }));
        return categoriesState;
      }
    }
  } catch (err) {
    console.warn('API de categorias indisponível:', err);
  }
  return categoriesState;
}

export interface AdminProductsPaginatedResponse {
  produtos: Product[];
  paginacao: {
    total: number;
    pagina: number;
    limite: number | 'all';
    totalPaginas: number;
  };
}

export async function getAdminProductsPaginated(params?: {
  pagina?: number;
  limite?: number | 'all';
  busca?: string;
  categoria?: string;
  status?: string;
  estoque?: string;
}): Promise<AdminProductsPaginatedResponse> {
  const query = new URLSearchParams();
  query.set('pagina', String(params?.pagina || 1));
  query.set('limite', String(params?.limite ?? 50));
  if (params?.busca && params.busca.trim()) query.set('busca', params.busca.trim());
  if (params?.categoria && params.categoria !== 'TODAS') query.set('categoria', params.categoria);
  if (params?.status && params.status !== 'TODOS') query.set('status', params.status);
  if (params?.estoque && params.estoque !== 'TODOS') query.set('estoque', params.estoque);

  try {
    const baseUrl = getApiBaseUrl();
    const headers = getAuthHeaders();
    const res = await fetch(`${baseUrl}/admin/produtos?${query.toString()}`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && Array.isArray(json.dados)) {
        const limitNum = typeof params?.limite === 'number' ? params.limite : 50;
        return {
          produtos: json.dados.map(mapBackendProductToFrontend),
          paginacao: json.paginacao || {
            total: json.dados.length,
            pagina: params?.pagina || 1,
            limite: params?.limite || 50,
            totalPaginas: Math.ceil(json.dados.length / limitNum) || 1,
          },
        };
      }
    }
  } catch (err) {
    console.warn('Falha ao carregar produtos paginados da API admin:', err);
  }

  return {
    produtos: [],
    paginacao: { total: 0, pagina: 1, limite: 50, totalPaginas: 1 },
  };
}

export async function getAdminProducts(): Promise<Product[]> {
  try {
    const baseUrl = getApiBaseUrl();
    const headers = getAuthHeaders();
    const res = await fetch(`${baseUrl}/admin/produtos?limite=2000`, {
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
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  try {
    const res = await fetch(`${baseUrl}/admin/dashboard/metricas`, {
      headers,
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      if (json.sucesso && json.dados) {
        const d = json.dados;
        return {
          totalProducts: d.totalModelos ?? 0,
          activeProducts: d.modelosAtivos ?? 0,
          hiddenProducts: d.modelosOcultos ?? 0,
          lowStock: d.estoqueBaixo ?? 0,
          outOfStock: d.esgotados ?? 0,
          totalProdutos: d.totalModelos ?? 0,
          produtosAtivos: d.modelosAtivos ?? 0,
          produtosOcultos: d.modelosOcultos ?? 0,
          estoqueBaixo: d.estoqueBaixo ?? 0,
          esgotados: d.esgotados ?? 0,
        };
      }
    }
  } catch (err) {
    console.error('Erro ao carregar métricas do dashboard:', err);
  }

  return {
    totalProducts: 0,
    activeProducts: 0,
    hiddenProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalProdutos: 0,
    produtosAtivos: 0,
    produtosOcultos: 0,
    estoqueBaixo: 0,
    esgotados: 0,
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

  const isEdit = Boolean(category.id && category.id.length > 10 && !category.id.startsWith('cat-'));
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

export async function deleteAdminProduct(id: string, permanente = true): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const url = `${baseUrl}/admin/produtos/${id}${permanente ? '?permanente=true' : ''}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    const idx = productsState.findIndex((p) => p.id === id);
    if (idx >= 0) productsState.splice(idx, 1);
    return true;
  }
  throw new Error(data.erro || 'Falha ao excluir produto no banco de dados.');
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
export const excluirProdutoAdmin = deleteAdminProduct;
export const ajustarEstoqueVariacao = adjustVariationStock;
export const salvarCategoria = saveCategory;
export const excluirCategoria = deleteCategory;
export const salvarSubcategoria = saveSubcategory;
export const excluirSubcategoria = deleteSubcategory;
export const uploadProductImage = uploadMediaAdmin;
