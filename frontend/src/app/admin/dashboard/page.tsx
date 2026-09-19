'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Glasses,
  Eye,
  EyeOff,
  AlertTriangle,
  PlusCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { getDashboardMetrics, getAdminProducts } from '../../../services/catalog.service';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [met, prods] = await Promise.all([
          getDashboardMetrics(),
          getAdminProducts(),
        ]);
        setMetrics(met);
        setProducts(prods);
      } catch (err) {
        console.error('Erro ao carregar métricas:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getTotalStock = (p: Product) => {
    const variations = p.variations || p.variacoes || [];
    return variations.reduce((acc, v) => acc + (v.stock ?? v.estoqueAtual ?? 0), 0);
  };

  const formatPrice = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className={styles.dashboardGrid}>
      {/* KPI Cards Row */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Total de Modelos</h3>
            <span className={styles.kpiNumber}>{isLoading ? '...' : metrics.totalProducts}</span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconTotal}`}>
            <Glasses size={24} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Modelos Ativos</h3>
            <span className={styles.kpiNumber}>{isLoading ? '...' : metrics.activeProducts}</span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconActive}`}>
            <Eye size={24} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Ocultos / Rascunho</h3>
            <span className={styles.kpiNumber}>{isLoading ? '...' : metrics.hiddenProducts}</span>
          </div>
          <div className={`${styles.kpiIcon} ${styles.iconHidden}`}>
            <EyeOff size={24} />
          </div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiContent}>
            <h3>Atenção ao Estoque</h3>
            <span className={styles.kpiNumber}>
              {isLoading ? '...' : metrics.lowStock + metrics.outOfStock}
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

      {/* Recent Products and Stock Alerts Table */}
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
            Ver todos ({products.length})
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Produto / Referência</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Variações</th>
                <th>Estoque Geral</th>
                <th>Visibilidade</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 8).map((prod) => {
                const totalStock = getTotalStock(prod);
                const mediaList = prod.media || prod.midias || [];
                const thumb = mediaList.find((m) => m.isPrimary || m.principal) || mediaList[0];
                const title = prod.title || prod.titulo || '';
                const parentSku = prod.parentSku || prod.skuPai || '';
                const categoryName = prod.categoryName || prod.categoriaNome || '';
                const variations = prod.variations || prod.variacoes || [];
                const effectivePrice = prod.promotionalPrice || prod.precoPromocional || prod.price || prod.precoVenda || 0;
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

                    <td>
                      <strong>
                        {formatPrice(effectivePrice)}
                      </strong>
                    </td>

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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
