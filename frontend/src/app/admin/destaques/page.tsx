'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Star,
  Tag,
  ExternalLink,
  Glasses,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  getAdminProducts,
  toggleProductHighlight,
} from '../../../services/catalog.service';
import { Product } from '../../../types';
import styles from './destaquesAdmin.module.css';

export default function DestaquesAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isLançamentoChecked, setIsLançamentoChecked] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const all = await getAdminProducts();
      setProducts(all);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Produtos que estão nos "Mais Desejados" da Home
  const featuredProducts = products.filter(
    (p) => p.featuredHome || p.destaqueHome
  );

  // Produtos disponíveis para adicionar (não estão nos Mais Desejados)
  const availableProducts = products.filter(
    (p) => !p.featuredHome && !p.destaqueHome
  );

  // Adicionar produto selecionado aos Mais Desejados
  const handleAddHighlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;

    setIsSubmitting(true);
    try {
      await toggleProductHighlight(selectedProductId, {
        destaqueHome: true,
        novidade: isLançamentoChecked,
      });

      const selected = products.find((p) => p.id === selectedProductId);
      showToast(
        `"${selected?.title || selected?.titulo}" adicionado à seção Mais Desejados da Home!`
      );

      setSelectedProductId('');
      await loadData();
    } catch (err) {
      alert('Falha ao adicionar modelo aos destaques da Home.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternar se o produto é Lançamento (badge verde)
  const handleToggleLançamento = async (product: Product) => {
    const currentIsNew = Boolean(product.isNew || product.novidade);
    const newIsNew = !currentIsNew;

    // Atualização otimista
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, isNew: newIsNew, novidade: newIsNew }
          : p
      )
    );

    try {
      await toggleProductHighlight(product.id, {
        novidade: newIsNew,
      });
      showToast(
        `Etiqueta "Lançamento" ${newIsNew ? 'ativada' : 'desativada'} para este modelo.`
      );
    } catch {
      await loadData();
      alert('Erro ao atualizar status de lançamento.');
    }
  };

  // Remover dos Mais Desejados da Home
  const handleRemoveHighlight = async (product: Product) => {
    if (
      !confirm(
        `Remover "${product.title || product.titulo}" da seção Mais Desejados da Home? (O produto continuará existindo no catálogo normal)`
      )
    ) {
      return;
    }

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, featuredHome: false, destaqueHome: false }
          : p
      )
    );

    try {
      await toggleProductHighlight(product.id, {
        destaqueHome: false,
      });
      showToast(`Modelo removido da vitrine da página inicial.`);
    } catch {
      await loadData();
      alert('Erro ao remover produto da vitrine.');
    }
  };

  const formatPrice = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className={styles.container}>
      {toastMessage && (
        <div className={styles.toast}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className={styles.headerCard}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>
            <Sparkles size={22} color="#D97706" />
            <span>Modelos Mais Desejados (Vitrine da Home)</span>
          </h1>
          <p className={styles.subtitle}>
            Escolha quais armações já cadastradas devem aparecer na seção principal da loja pública e defina se possuem a etiqueta de Lançamento.
          </p>
        </div>

        <div className={styles.statsRow}>
          <div className={`${styles.statBadge} ${styles.statBadgeActive}`}>
            <Star size={16} />
            <span>{featuredProducts.length} na Home</span>
          </div>
          <div className={styles.statBadge}>
            <Tag size={16} />
            <span>
              {featuredProducts.filter((p) => p.isNew || p.novidade).length} Lançamentos
            </span>
          </div>
        </div>
      </div>

      {/* Adicionar Produto à Seção */}
      <div className={styles.actionCard}>
        <h2 className={styles.actionCardTitle}>
          <Plus size={18} color="#D97706" />
          <span>Adicionar Produto Existente ao Container da Home</span>
        </h2>

        <form onSubmit={handleAddHighlight} className={styles.addForm}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={isSubmitting || availableProducts.length === 0}
            >
              <option value="">
                {availableProducts.length === 0
                  ? 'Todos os produtos já estão adicionados na Home'
                  : 'Selecione um produto cadastrado no catálogo...'}
              </option>
              {availableProducts.map((p) => {
                const title = p.title || p.titulo || '';
                const sku = p.parentSku || p.skuPai || '';
                const cat = p.categoryName || p.categoriaNome || '';
                return (
                  <option key={p.id} value={p.id}>
                    {sku} • {title} ({cat})
                  </option>
                );
              })}
            </select>
          </div>

          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isLançamentoChecked}
              onChange={(e) => setIsLançamentoChecked(e.target.checked)}
            />
            <span>Marcar como Lançamento</span>
          </label>

          <button
            type="submit"
            className={styles.btnAdd}
            disabled={!selectedProductId || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Adicionando...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Adicionar à Home</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Grid de Modelos Atuais na Home */}
      {isLoading ? (
        <div className={styles.emptyCard}>
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Carregando vitrine de modelos...</span>
        </div>
      ) : featuredProducts.length === 0 ? (
        <div className={styles.emptyCard}>
          <AlertCircle size={32} color="#D97706" />
          <strong>Nenhum modelo selecionado para a Home</strong>
          <p>
            Utilize o seletor acima para adicionar as armações que devem ser exibidas na seção &quot;Modelos Mais Desejados&quot; da página inicial.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {featuredProducts.map((prod) => {
            const mediaList = prod.media || prod.midias || [];
            const thumb =
              mediaList.find((m) => m.isPrimary || m.principal)?.url ||
              mediaList[0]?.url;
            const title = prod.title || prod.titulo || '';
            const parentSku = prod.parentSku || prod.skuPai || '';
            const price = prod.price ?? prod.precoVenda ?? 0;
            const isNew = Boolean(prod.isNew || prod.novidade);

            return (
              <div key={prod.id} className={styles.card}>
                <div className={styles.cardImageArea}>
                  <div className={styles.badgesOverlay}>
                    <span className={styles.badgeHighlight}>Mais Desejado</span>
                    {isNew && <span className={styles.badgeNew}>Lançamento</span>}
                  </div>
                  {thumb ? (
                    <img src={thumb} alt={title} className={styles.productImg} />
                  ) : (
                    <Glasses size={40} color="#cbd5e1" />
                  )}
                </div>

                <div className={styles.cardBody}>
                  <div>
                    <span className={styles.productSku}>{parentSku}</span>
                    <h3 className={styles.productTitle}>{title}</h3>
                  </div>

                  <div className={styles.priceRow}>
                    <span className={styles.price}>{formatPrice(price)}</span>
                    <Link
                      href={`/produto/${prod.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginLeft: 'auto',
                        color: '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.75rem',
                        textDecoration: 'none',
                      }}
                      title="Ver na loja pública"
                    >
                      <span>Ver</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className={styles.cardActions}>
                    <div className={styles.toggleRow}>
                      <span className={styles.toggleLabel}>
                        <Tag size={14} />
                        <span>Etiqueta Lançamento:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleLançamento(prod)}
                        className={`${styles.toggleBtn} ${
                          isNew ? styles.toggleBtnActive : ''
                        }`}
                      >
                        {isNew ? '✓ Sim (Ativo)' : 'Não'}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(prod)}
                      className={styles.btnRemove}
                    >
                      <Trash2 size={14} />
                      <span>Remover da Home</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
