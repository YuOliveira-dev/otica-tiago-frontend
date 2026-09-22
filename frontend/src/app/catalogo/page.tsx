'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, ChevronRight, Search, Loader2 } from 'lucide-react';
import { WhatsAppIcon } from '../../components/Icons';
import { ProductCard } from '../../components/CardProduto/CardProduto';
import { getProducts, getCategories } from '../../services/catalog.service';
import { generateWhatsAppLink } from '../../services/whatsapp';
import { Product, Category, FiltersState } from '../../types';
import styles from './catalogo.module.css';

function CatalogoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Initialize filters from URL query parameters
  const [filters, setFilters] = useState<FiltersState>({
    search: searchParams.get('search') || searchParams.get('busca') || '',
    category: searchParams.get('category') || searchParams.get('categoria') || 'todas',
    gender: searchParams.get('gender') || searchParams.get('genero') || 'todos',
    shape: searchParams.get('shape') || searchParams.get('formato') || 'todos',
    material: searchParams.get('material') || 'todos',
    sortBy: (searchParams.get('sortBy') || searchParams.get('ordenar') || 'populares') as FiltersState['sortBy'],
    inStockOnly: false,
  });

  // Sync state if URL searchParams change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('search') || searchParams.get('busca') || '',
      category: searchParams.get('category') || searchParams.get('categoria') || prev.category,
      sortBy: (searchParams.get('sortBy') || searchParams.get('ordenar') || prev.sortBy) as FiltersState['sortBy'],
    }));
  }, [searchParams]);

  // Fetch catalog data and categories
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [cats, prods] = await Promise.all([
        getCategories(),
        getProducts(filters),
      ]);
      setCategories(cats);
      setProducts(prods);
      setIsLoading(false);
    }
    loadData();
  }, [filters]);

  const updateFilter = (field: keyof FiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'todas',
      gender: 'todos',
      shape: 'todos',
      material: 'todos',
      sortBy: 'populares',
      inStockOnly: false,
    });
    router.push('/catalogo');
  };

  const whatsAppInquiryLink = generateWhatsAppLink({
    type: 'inquiry',
  });

  return (
    <div className={`container ${styles.pageContainer}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.breadcrumb}>
          <Link href="/">Início</Link>
          <ChevronRight size={14} />
          <span>Catálogo de Produtos</span>
        </div>
        <h1 className={styles.pageTitle}>Catálogo TS EYEWEAR</h1>
        <p className={styles.pageSubtitle}>
          Armações originais, lentes com certificação de proteção e Frete Grátis para todo o Brasil.
        </p>
      </div>

      <div className={styles.layoutGrid}>
        {/* Desktop Sidebar Filters */}
        <aside className={styles.sidebar}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitle}>
              <SlidersHorizontal size={18} />
              <span>Filtros</span>
            </div>
            <button onClick={clearFilters} className={styles.btnClear}>
              Limpar Todos
            </button>
          </div>

          {/* Search in Sidebar */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Buscar Modelo</label>
            <input
              type="text"
              placeholder="Ex: Aviador, Acetato..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className={styles.selectInput}
            />
          </div>

          {/* Category */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Categoria</label>
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className={styles.selectInput}
            >
              <option value="todas">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name || cat.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Gênero</label>
            <select
              value={filters.gender}
              onChange={(e) => updateFilter('gender', e.target.value)}
              className={styles.selectInput}
            >
              <option value="todos">Todos os Gêneros</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="unissex">Unissex</option>
            </select>
          </div>

          {/* Frame Shape */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Formato</label>
            <select
              value={filters.shape}
              onChange={(e) => updateFilter('shape', e.target.value)}
              className={styles.selectInput}
            >
              <option value="todos">Todos os Formatos</option>
              <option value="redondo">Redondo</option>
              <option value="quadrado">Quadrado</option>
              <option value="aviador">Aviador</option>
              <option value="gatinho">Gatinho</option>
              <option value="retangular">Retangular</option>
              <option value="geometrico">Geométrico</option>
            </select>
          </div>

          {/* Material */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Material</label>
            <select
              value={filters.material}
              onChange={(e) => updateFilter('material', e.target.value)}
              className={styles.selectInput}
            >
              <option value="todos">Todos os Materiais</option>
              <option value="acetato">Acetato Italiano</option>
              <option value="titanio">Titânio Leve</option>
              <option value="metal">Metal Galvanizado</option>
              <option value="tr90">TR90 Flexível</option>
            </select>
          </div>

          {/* In Stock Only */}
          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => updateFilter('inStockOnly', e.target.checked)}
                className={styles.checkboxInput}
              />
              <span>Somente modelos em estoque</span>
            </label>
          </div>
        </aside>

        {/* Central Area with Product Grid */}
        <section>
          {/* Top Bar Sorting & Mobile Trigger */}
          <div className={styles.topBarControls}>
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className={styles.btnMobileFilter}
            >
              <SlidersHorizontal size={16} />
              <span>Filtrar Modelos</span>
            </button>

            <span className={styles.countLabel}>
              Mostrando <strong>{products.length}</strong> modelo(s)
            </span>

            <div className={styles.sortBox}>
              <label htmlFor="ordenar-select">Ordenar:</label>
              <select
                id="ordenar-select"
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className={styles.sortSelect}
              >
                <option value="populares">Mais Populares</option>
                <option value="novidades">Lançamentos</option>
                <option value="menor_preco">Menor Preço</option>
                <option value="maior_preco">Maior Preço</option>
              </select>
            </div>
          </div>

          {/* Loading or Empty State */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', color: 'var(--color-text-muted)' }}>
              <Loader2 size={36} className="animate-spin" color="var(--color-accent, #c5a96f)" />
              <span>Carregando catálogo do banco de dados...</span>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <Search size={48} color="var(--color-text-subtle)" />
              <h3 className={styles.emptyTitle}>Nenhum modelo encontrado</h3>
              <p className={styles.emptyDesc}>
                Não encontramos armações correspondentes a essa combinação de filtros.
                Experimente limpar os filtros ou fale com nosso consultor óptico no WhatsApp para encontrar o modelo ideal.
              </p>
              <div className={styles.emptyActions}>
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-primary-950)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 600,
                  }}
                >
                  Limpar Todos os Filtros
                </button>
                <a
                  href={whatsAppInquiryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'var(--color-whatsapp)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <WhatsAppIcon size={18} />
                  <span>Consultar no WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Carregando catálogo...</div>}>
      <CatalogoContent />
    </Suspense>
  );
}
