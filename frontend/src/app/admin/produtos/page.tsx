'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  Glasses,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getAdminProductsPaginated,
  toggleProductVisibility,
  deleteAdminProduct,
  getCategories,
} from '../../../services/catalog.service';
import { Product, Category, ProductStatus } from '../../../types';
import { ActionModal, ActionModalType } from '../../../components/Admin/ActionModal';
import styles from './produtosAdmin.module.css';

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(50);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [stockFilter, setStockFilter] = useState<string>('TODOS');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Friendly Action Modal State
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: ActionModalType;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    message: '',
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Carrega categorias na montagem
  useEffect(() => {
    async function loadCats() {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
      }
    }
    loadCats();
  }, []);

  // Busca página sob demanda no servidor
  const loadPage = useCallback(
    async (pageToLoad: number, limitToLoad: number | 'all', isInitial = false) => {
      if (isInitial) setIsLoading(true);
      else setIsFetching(true);

      try {
        const res = await getAdminProductsPaginated({
          pagina: pageToLoad,
          limite: limitToLoad,
          busca: debouncedSearch,
          categoria: categoryFilter,
          status: statusFilter,
          estoque: stockFilter,
        });

        setProducts(res.produtos);
        setTotalItems(res.paginacao.total);
        setTotalPages(res.paginacao.totalPaginas);
      } catch (err) {
        console.error('Erro ao carregar produtos paginados:', err);
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    },
    [debouncedSearch, categoryFilter, statusFilter, stockFilter]
  );

  // Recarrega sempre que filtros mudam (reiniciando na página 1)
  useEffect(() => {
    setCurrentPage(1);
    loadPage(1, itemsPerPage, false);
  }, [debouncedSearch, categoryFilter, statusFilter, stockFilter, itemsPerPage, loadPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage || isFetching) return;
    setCurrentPage(newPage);
    loadPage(newPage, itemsPerPage, false);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Perform toggle visibility status
  const performToggleStatus = async (product: Product, newStatus: ProductStatus) => {
    if (togglingProductId) return;
    setTogglingProductId(product.id);
    const title = product.title || product.titulo || '';

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
    );

    setIsTogglingStatus(true);
    try {
      await toggleProductVisibility(product.id, newStatus);
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Status Atualizado',
        message: `Modelo "${title}" agora está ${
          newStatus === 'ACTIVE' ? 'ATIVO no catálogo' : 'OCULTO (Rascunho)'
        }!`,
        confirmText: 'Entendido',
        onConfirm: closeModal,
      });
    } catch {
      // Revert if failed
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: product.status } : p))
      );
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Erro ao Alterar',
        message: 'Erro ao alterar status de visibilidade.',
        confirmText: 'Fechar',
        onConfirm: closeModal,
      });
    } finally {
      setTogglingProductId(null);
      setIsTogglingStatus(false);
    }
  };

  // Toggle visibility status with confirmation when hiding
  const handleToggleStatus = (product: Product) => {
    if (togglingProductId) return;
    const isCurrentlyActive = product.status === 'ACTIVE' || product.status === 'ATIVO';
    const newStatus: ProductStatus = isCurrentlyActive ? 'HIDDEN' : 'ACTIVE';
    const title = product.title || product.titulo || '';

    if (isCurrentlyActive) {
      setModalConfig({
        isOpen: true,
        type: 'confirm',
        title: 'Ocultar Modelo',
        message: `Deseja ocultar o modelo "${title}" do catálogo público?\n\nEle será mantido no sistema, mas os clientes não poderão visualizá-lo na loja online.`,
        confirmText: 'Sim, Ocultar',
        cancelText: 'Cancelar',
        onConfirm: () => performToggleStatus(product, newStatus),
        onCancel: closeModal,
      });
    } else {
      performToggleStatus(product, newStatus);
    }
  };

  // Excluir produto com confirmação amigável
  const handleDeleteProduct = (product: Product) => {
    const title = product.title || product.titulo || 'este modelo';
    const sku = product.parentSku || product.skuPai || '';
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Excluir Produto',
      message: `Tem certeza que deseja excluir o modelo "${title}"${sku ? ` (SKU: ${sku})` : ''} permanentemente?\n\nEsta operação removerá o produto e suas variações do banco de dados.`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setIsDeletingProduct(true);
        try {
          await deleteAdminProduct(product.id, true);
          setModalConfig({
            isOpen: true,
            type: 'success',
            title: 'Produto Excluído',
            message: `O produto "${title}" foi excluído com sucesso do catálogo.`,
            confirmText: 'Entendido',
            onConfirm: closeModal,
          });
          loadPage(currentPage, itemsPerPage, false);
        } catch (err: any) {
          setModalConfig({
            isOpen: true,
            type: 'danger',
            title: 'Erro ao Excluir',
            message: err.message || 'Falha ao excluir produto.',
            confirmText: 'Fechar',
            onConfirm: closeModal,
          });
        } finally {
          setIsDeletingProduct(false);
        }
      },
      onCancel: closeModal,
    });
  };

  return (
    <div className={styles.container}>


      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h2>Gestão de Produtos</h2>
          <p>
            {totalItems} {totalItems === 1 ? 'modelo encontrado' : 'modelos no catálogo'}
          </p>
        </div>
        <Link href="/admin/produtos/novo" className={styles.btnNewProduct}>
          <PlusCircle size={18} />
          Cadastrar Novo Modelo
        </Link>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por Título, SKU ou Categoria..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.selectFilter}
        >
          <option value="TODOS">Todos os Status</option>
          <option value="ATIVO">Apenas Ativos</option>
          <option value="OCULTO">Apenas Ocultos</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={styles.selectFilter}
        >
          <option value="TODAS">Todas as Categorias</option>
          {categories.filter((c) => {
            const s = c.slug?.toLowerCase() || '';
            const n = (c.name || c.nome || '').toLowerCase();
            return (
              s === 'oculos-de-grau' ||
              s === 'oculos-de-sol' ||
              s === 'clip-on' ||
              s === 'outlet' ||
              n === 'óculos de grau' ||
              n === 'óculos de sol' ||
              n === 'clip-on' ||
              n === 'outlet'
            );
          }).length > 0 && (
            <optgroup label="Categorias Principais">
              {categories
                .filter((c) => {
                  const s = c.slug?.toLowerCase() || '';
                  const n = (c.name || c.nome || '').toLowerCase();
                  return (
                    s === 'oculos-de-grau' ||
                    s === 'oculos-de-sol' ||
                    s === 'clip-on' ||
                    s === 'outlet' ||
                    n === 'óculos de grau' ||
                    n === 'óculos de sol' ||
                    n === 'clip-on' ||
                    n === 'outlet'
                  );
                })
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.nome}
                  </option>
                ))}
            </optgroup>
          )}
          {categories.filter((c) => {
            const s = c.slug?.toLowerCase() || '';
            const n = (c.name || c.nome || '').toLowerCase();
            return !(
              s === 'oculos-de-grau' ||
              s === 'oculos-de-sol' ||
              s === 'clip-on' ||
              s === 'outlet' ||
              n === 'óculos de grau' ||
              n === 'óculos de sol' ||
              n === 'clip-on' ||
              n === 'outlet'
            );
          }).length > 0 && (
            <optgroup label="Outras Linhas / Preços">
              {categories
                .filter((c) => {
                  const s = c.slug?.toLowerCase() || '';
                  const n = (c.name || c.nome || '').toLowerCase();
                  return !(
                    s === 'oculos-de-grau' ||
                    s === 'oculos-de-sol' ||
                    s === 'clip-on' ||
                    s === 'outlet' ||
                    n === 'óculos de grau' ||
                    n === 'óculos de sol' ||
                    n === 'clip-on' ||
                    n === 'outlet'
                  );
                })
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.nome}
                  </option>
                ))}
            </optgroup>
          )}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className={styles.selectFilter}
        >
          <option value="TODOS">Qualquer Estoque</option>
          <option value="EM_ESTOQUE">Em Estoque</option>
          <option value="ESTOQUE_BAIXO">Estoque Baixo (≤ 3)</option>
          <option value="ESGOTADO">Esgotado (0)</option>
        </select>
      </div>

      {/* Products Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableContainer} style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s ease' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto & Referência</th>
                <th>Categoria</th>
                <th>Cores & Variações</th>
                <th>Controle de Estoque</th>
                <th>Visibilidade</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--color-text-muted)' }}>
                      <Loader2 size={32} className="animate-spin" color="var(--color-accent, #c5a96f)" />
                      <span>Carregando produtos do banco de dados...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const mediaList = prod.media || prod.midias || [];
                  const thumb = mediaList.find((m) => m.isPrimary || m.principal) || mediaList[0];
                  const variations = prod.variations || prod.variacoes || [];
                  const totalStock = variations.reduce(
                    (acc, v) => acc + (v.stock ?? v.estoqueAtual ?? 0),
                    0
                  );
                  const title = prod.title || prod.titulo || '';
                  const parentSku = prod.parentSku || prod.skuPai || '';
                  const categoryName = prod.categoryName || prod.categoriaNome || '';
                  const subcategoryName = prod.subcategoryName || prod.subcategoriaNome;
                  const price = prod.price ?? prod.precoVenda ?? 0;
                  const promoPrice = prod.promotionalPrice ?? prod.precoPromocional;
                  const isActive = prod.status === 'ACTIVE' || prod.status === 'ATIVO';

                  return (
                    <tr key={prod.id}>
                      {/* Thumbnail & Title */}
                      <td>
                        <div className={styles.productCell}>
                          <div className={styles.thumbWrapper}>
                            {thumb ? (
                              <img
                                src={thumb.url}
                                alt={title}
                                className={styles.thumbImg}
                              />
                            ) : (
                              <Glasses size={24} color="#94a3b8" />
                            )}
                          </div>
                          <div className={styles.productMeta}>
                            <span className={styles.productTitle}>{title}</span>
                            <span className={styles.productSku}>{parentSku}</span>
                            <div className={styles.badgeHighlightRow}>
                              {(prod.featuredHome || prod.destaqueHome) && (
                                <span className={styles.badgeDestaque}>Destaque</span>
                              )}
                              {(prod.isNew || prod.novidade) && (
                                <span className={styles.badgeNovidade}>Novo</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td>
                        <div>
                          <strong>{categoryName}</strong>
                          {subcategoryName && (
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
                              {subcategoryName}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Price OCULTO TEMPORARIAMENTE — para reativar, descomente:
                      <td>
                        {promoPrice ? (
                          <div>
                            <span style={{ fontSize: '0.75rem', textDecoration: 'line-through', color: '#94a3b8', display: 'block' }}>
                              {formatPrice(price)}
                            </span>
                            <strong style={{ color: '#0f172a' }}>
                              {formatPrice(promoPrice)}
                            </strong>
                          </div>
                        ) : (
                          <strong>{formatPrice(price)}</strong>
                        )}
                      </td>
                      */}

                      {/* Variations & Colors */}
                      <td>
                        <div className={styles.colorsRow} title={`${variations.length} variações cadastradas`}>
                          {variations.map((v) => {
                            const colorName = v.colorName || v.corNome || '';
                            const colorHex = v.colorHex || v.corHex || '#111111';
                            const stock = v.stock ?? v.estoqueAtual ?? 0;
                            return (
                              <span
                                key={v.id}
                                className={styles.colorDot}
                                style={{ backgroundColor: colorHex }}
                                title={`${colorName} - Estoque: ${stock} un.`}
                              />
                            );
                          })}
                          <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '0.35rem' }}>
                            ({variations.length})
                          </span>
                        </div>
                      </td>

                      {/* Stock */}
                      <td>
                        <div className={styles.stockGroup}>
                          <span className={styles.stockTotal}>{totalStock} un. no total</span>
                          {totalStock === 0 ? (
                            <span className={styles.badgeStockOut}>Esgotado</span>
                          ) : totalStock <= 3 ? (
                            <span className={styles.badgeStockLow}>Últimas Unidades</span>
                          ) : (
                            <span className={styles.badgeStockOk}>Em Estoque</span>
                          )}
                        </div>
                      </td>

                      {/* Visibility Switch */}
                      <td>
                        <label
                          className={styles.switchLabel}
                          style={togglingProductId === prod.id ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
                          title="Clique para alternar entre Ativo e Oculto"
                        >
                          <input
                            type="checkbox"
                            className={styles.switchInput}
                            checked={isActive}
                            disabled={togglingProductId === prod.id}
                            onChange={() => handleToggleStatus(prod)}
                          />
                          <span className={styles.switchSlider} />
                          <span
                            className={`${styles.switchText} ${
                              isActive
                                ? styles.switchTextActive
                                : styles.switchTextHidden
                            }`}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            {togglingProductId === prod.id && <Loader2 size={12} className="animate-spin" />}
                            {isActive ? 'Visível' : 'Oculto'}
                          </span>
                        </label>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className={styles.actionsCell}>
                          <Link
                            href={`/admin/produtos/novo?edit=${prod.id}`}
                            className={styles.btnActionIcon}
                            title="Editar este produto"
                          >
                            <Edit2 size={16} />
                          </Link>

                          <Link
                            href={`/produto/${prod.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.btnActionIcon}
                            title="Visualizar no catálogo público"
                          >
                            <ExternalLink size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(prod)}
                            className={`${styles.btnActionIcon} ${styles.btnActionDelete}`}
                            title="Excluir este produto"
                            aria-label={`Excluir modelo ${prod.title || prod.titulo}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className={styles.paginationBar}>
            <div className={styles.paginationInfo}>
              <span>
                Exibindo{' '}
                <strong>
                  {itemsPerPage === 'all'
                    ? `1–${totalItems}`
                    : `${(currentPage - 1) * (itemsPerPage as number) + 1}–${Math.min(
                        currentPage * (itemsPerPage as number),
                        totalItems
                      )}`}
                </strong>{' '}
                de <strong>{totalItems}</strong> modelos
              </span>

              <div className={styles.pageSizeSelector}>
                <span>Itens por página:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                    setItemsPerPage(val);
                    setCurrentPage(1);
                  }}
                  className={styles.pageSizeSelect}
                >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value="all">Todos ({totalItems})</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetching}
                  className={styles.btnPagination}
                  title="Página anterior"
                >
                  <ChevronLeft size={16} />
                  <span>Anterior</span>
                </button>

                <div className={styles.pageIndicator}>
                  <span>
                    Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                  </span>
                  {isFetching && (
                    <Loader2 size={14} className="animate-spin" color="var(--color-accent, #c5a96f)" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isFetching}
                  className={styles.btnPagination}
                  title="Próxima página"
                >
                  <span>Próxima</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Friendly Action Confirmation & Feedback Modal */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isLoading={isDeletingProduct || isTogglingStatus}
        onConfirm={modalConfig.onConfirm || closeModal}
        onCancel={modalConfig.onCancel || closeModal}
        onClose={closeModal}
      />
    </div>
  );
}
