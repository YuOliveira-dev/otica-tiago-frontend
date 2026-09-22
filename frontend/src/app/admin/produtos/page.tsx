'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  PlusCircle,
  Edit2,
  ExternalLink,
  Glasses,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import {
  getAdminProducts,
  toggleProductVisibility,
  getCategories,
} from '../../../services/catalog.service';
import { Product, Category, ProductStatus } from '../../../types';
import { ActionModal, ActionModalType } from '../../../components/Admin/ActionModal';
import styles from './produtosAdmin.module.css';

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingProductId, setTogglingProductId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('TODOS');
  const [categoryFilter, setCategoryFilter] = useState<string>('TODAS');
  const [stockFilter, setStockFilter] = useState<string>('TODOS');

  // Friendly Action Modal State
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

  useEffect(() => {
    async function loadData() {
      try {
        const [prods, cats] = await Promise.all([
          getAdminProducts(),
          getCategories(),
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (err) {
        console.error('Erro ao carregar lista admin:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Perform toggle visibility status
  const performToggleStatus = async (product: Product, newStatus: ProductStatus) => {
    if (togglingProductId) return;
    setTogglingProductId(product.id);
    const title = product.title || product.titulo || '';

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
    );

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

  // Filtering
  const filteredProducts = products.filter((p) => {
    const title = p.title || p.titulo || '';
    const parentSku = p.parentSku || p.skuPai || '';
    const categoryName = p.categoryName || p.categoriaNome || '';
    const categoryId = p.categoryId || p.categoriaId || '';
    const variations = p.variations || p.variacoes || [];

    // Search query
    if (searchQuery.trim() !== '') {
      const term = searchQuery.toLowerCase();
      const matched =
        title.toLowerCase().includes(term) ||
        parentSku.toLowerCase().includes(term) ||
        categoryName.toLowerCase().includes(term);
      if (!matched) return false;
    }

    // Status filter
    if (statusFilter !== 'TODOS') {
      const isActive = p.status === 'ACTIVE' || p.status === 'ATIVO';
      if (statusFilter === 'ATIVO' && !isActive) return false;
      if (statusFilter === 'OCULTO' && isActive) return false;
    }

    // Category filter
    if (categoryFilter !== 'TODAS' && categoryId !== categoryFilter) {
      return false;
    }

    // Stock filter
    const totalStock = variations.reduce((acc, v) => acc + (v.stock ?? v.estoqueAtual ?? 0), 0);
    if (stockFilter === 'EM_ESTOQUE' && totalStock <= 0) return false;
    if (stockFilter === 'ESTOQUE_BAIXO' && (totalStock === 0 || totalStock > 3)) return false;
    if (stockFilter === 'ESGOTADO' && totalStock > 0) return false;

    return true;
  });

  const formatPrice = (val?: number) =>
    (val ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className={styles.container}>


      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h2>Gestão de Produtos</h2>
          <p>
            {filteredProducts.length} de {products.length} modelos listados
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
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name || cat.nome}
            </option>
          ))}
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
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto & Referência</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Cores & Variações</th>
                <th>Controle de Estoque</th>
                <th>Visibilidade</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    Carregando catálogo de produtos...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
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

                      {/* Price */}
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
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Friendly Action Confirmation & Feedback Modal */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm || closeModal}
        onCancel={modalConfig.onCancel || closeModal}
        onClose={closeModal}
      />
    </div>
  );
}
