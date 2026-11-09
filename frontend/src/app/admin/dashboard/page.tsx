'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Glasses,
  Eye,
  EyeOff,
  AlertTriangle,
  PlusCircle,
  Tag,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Skeleton, SkeletonTableRow } from '../../../components/Skeleton';
import { getDashboardMetrics, getAdminProductsPaginated } from '../../../services/catalog.service';
import { DashboardMetrics, Product } from '../../../types';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProducts: 0,
    activeProducts: 0,
    hiddenProducts: 0,
    lowStock: 0,
    outOfStock: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);

  // Carrega métricas globais via SQL otimizado
  useEffect(() => {
    async function loadMetrics() {
      try {
        const met = await getDashboardMetrics();
        setMetrics(met);
      } catch (err) {
        console.error('Erro ao carregar métricas:', err);
      } finally {
        setIsLoadingMetrics(false);
      }
    }
    loadMetrics();
  }, []);

  // Carrega página de produtos sob demanda
  const loadProducts = useCallback(
    async (pageToLoad: number, limitToLoad: number, isInitial = false) => {
      if (isInitial) setIsLoadingProducts(true);
      else setIsFetchingProducts(true);

      try {
        const res = await getAdminProductsPaginated({
          pagina: pageToLoad,
          limite: limitToLoad,
        });
        setProducts(res.produtos);
        setTotalItems(res.paginacao.total);
        setTotalPages(res.paginacao.totalPaginas);
      } catch (err) {
        console.error('Erro ao carregar produtos do catálogo:', err);
      } finally {
        setIsLoadingProducts(false);
        setIsFetchingProducts(false);
      }
    },
    []
  );

  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1, itemsPerPage, true);
  }, [itemsPerPage, loadProducts]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage || isFetchingProducts) return;
    setCurrentPage(newPage);
    loadProducts(newPage, itemsPerPage, false);
  };

  const getTotalStock = (p: Product) => {
    const variations = p.variations || p.variacoes || [];
    return variations.reduce((acc, v) => acc + (v.stock ?? v.estoqueAtual ?? 0), 0);
  };

  return (
    <div className={styles.dashboardGrid}>
      {/* KPI Cards Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Total de Modelos</h3>
            <span className={styles.kpiNumber}>
              {isLoadingMetrics ? (
                <Skeleton width={50} height={28} borderRadius={6} />
              ) : (
                metrics.totalProducts
              )}
            </span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconTotal}`}>
            <Glasses size={24} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Modelos Ativos</h3>
            <span className={styles.kpiNumber}>
              {isLoadingMetrics ? (
                <Skeleton width={50} height={28} borderRadius={6} />
              ) : (
                metrics.activeProducts
              )}
            </span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconActive}`}>
            <Eye size={24} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Ocultos / Rascunho</h3>
            <span className={styles.kpiNumber}>
              {isLoadingMetrics ? (
                <Skeleton width={50} height={28} borderRadius={6} />
              ) : (
                metrics.hiddenProducts
              )}
            </span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconHidden}`}>
            <EyeOff size={24} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Atenção ao Estoque</h3>
            <span className={styles.kpiNumber}>
              {isLoadingMetrics ? (
                <Skeleton width={50} height={28} borderRadius={6} />
              ) : (
                metrics.lowStock + metrics.outOfStock
              )}
            </span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconAlert}`}>
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActionsCard}>
        <div className={styles.quickActionsText}>
          <h2>Gestão Rápida do Catálogo</h2>
          <p>Cadastre novos lançamentos, gerencie categorias e atualize o estoque em tempo real.</p>
        </div>
        <div className={styles.actionsButtons}>
          <Link href="/admin/produtos/novo" className={styles.btnPrimary}>
            <PlusCircle size={18} />
            Cadastrar Novo Produto
          </Link>
          <Link href="/admin/categorias" className={styles.btnSecondary}>
            <Tag size={18} />
            Gerenciar Categorias
          </Link>
        </div>
      </div>

      {/* Recent Products and Stock Overview Table */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Visão Geral dos Produtos Cadastrados</h3>
          <Link
            href="/admin/produtos"
            style={{
              fontSize: '0.85rem',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            Ver todos ({isLoadingMetrics ? '...' : metrics.totalProducts})
            <ArrowRight size={14} />
          </Link>
        </div>

        <div
          className={styles.tableContainer}
          style={{ opacity: isFetchingProducts ? 0.6 : 1, transition: 'opacity 0.2s ease' }}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto / Referência</th>
                <th>Categoria</th>
                <th>Variações</th>
                <th>Estoque Geral</th>
                <th>Visibilidade</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingProducts ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonTableRow key={i} columns={6} />
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    Nenhum produto cadastrado.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const totalStock = getTotalStock(prod);
                  const mediaList = prod.media || prod.midias || [];
                  const thumb = mediaList.find((m) => m.isPrimary || m.principal) || mediaList[0];
                  const title = prod.title || prod.titulo || '';
                  const parentSku = prod.parentSku || prod.skuPai || '';
                  const categoryName = prod.categoryName || prod.categoriaNome || '';
                  const variations = prod.variations || prod.variacoes || [];
                  const isActive = prod.status === 'ACTIVE' || prod.status === 'ATIVO';

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div className={styles.prodInfo}>
                          {thumb ? (
                            <img
                              src={thumb.url}
                              alt={title}
                              className={styles.thumbImg}
                            />
                          ) : (
                            <div
                              className={styles.thumbImg}
                              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Glasses size={20} color="#94a3b8" />
                            </div>
                          )}
                          <div>
                            <span className={styles.prodTitle}>{title}</span>
                            <span className={styles.prodSku}>SKU: {parentSku}</span>
                          </div>
                        </div>
                      </td>

                      <td>{categoryName}</td>

                      <td>{variations.length} variações</td>

                      <td>
                        {totalStock === 0 ? (
                          <span className={styles.badgeStockOut}>Esgotado (0)</span>
                        ) : totalStock <= 3 ? (
                          <span className={styles.badgeStockLow}>
                            Últimas ({totalStock})
                          </span>
                        ) : (
                          <span className={styles.badgeStockOk}>
                            Em Estoque ({totalStock})
                          </span>
                        )}
                      </td>

                      <td>
                        {isActive ? (
                          <span className={styles.badgeStatusActive}>
                            <Eye size={12} /> Ativo
                          </span>
                        ) : (
                          <span className={styles.badgeStatusHidden}>
                            <EyeOff size={12} /> Oculto
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <Link
                          href={`/admin/produtos?edit=${prod.id}`}
                          className={styles.btnAction}
                        >
                          Gerenciar
                        </Link>
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
                  {`${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                    currentPage * itemsPerPage,
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
                    const val = Number(e.target.value);
                    setItemsPerPage(val);
                    setCurrentPage(1);
                  }}
                  className={styles.pageSizeSelect}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {totalPages > 1 && (
              <div className={styles.paginationControls}>
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFetchingProducts}
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
                  {isFetchingProducts && (
                    <Loader2 size={14} className="animate-spin" color="var(--color-accent, #c5a96f)" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isFetchingProducts}
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
    </div>
  );
}
