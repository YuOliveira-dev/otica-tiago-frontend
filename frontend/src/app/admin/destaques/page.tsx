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
import { ActionModal, ActionModalType } from '../../../components/Admin/ActionModal';
import styles from './destaquesAdmin.module.css';

export default function DestaquesAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isLançamentoChecked, setIsLançamentoChecked] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingNewId, setTogglingNewId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

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
      const selectedTitle = selected?.title || selected?.titulo || 'Modelo';

      setSelectedProductId('');
      await loadData();

      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Modelo Adicionado!',
        message: `"${selectedTitle}" adicionado à seção Mais Desejados da Home!`,
        confirmText: 'Entendido',
        onConfirm: closeModal,
      });
    } catch (err) {
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Erro ao Adicionar',
        message: 'Falha ao adicionar modelo aos destaques da Home.',
        confirmText: 'Fechar',
        onConfirm: closeModal,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Alternar se o produto é Lançamento (badge verde)
  const handleToggleLançamento = async (product: Product) => {
    if (togglingNewId) return;
    setTogglingNewId(product.id);
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
    } catch {
      await loadData();
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Erro de Atualização',
        message: 'Erro ao atualizar status de lançamento.',
        confirmText: 'Fechar',
        onConfirm: closeModal,
      });
    } finally {
      setTogglingNewId(null);
    }
  };

  // Efetiva a remoção da vitrine após confirmação
  const performRemoval = async (product: Product) => {
    setIsRemoving(true);
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
      await loadData();
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Modelo Removido',
        message: `"${product.title || product.titulo}" foi removido da vitrine da página inicial.`,
        confirmText: 'Entendido',
        onConfirm: closeModal,
      });
    } catch {
      await loadData();
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Erro ao Remover',
        message: 'Erro ao remover produto da vitrine.',
        confirmText: 'Fechar',
        onConfirm: closeModal,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Remover dos Mais Desejados da Home (abre modal amigável de confirmação)
  const handleRemoveHighlight = (product: Product) => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Confirmar Remoção',
      message: `Remover "${product.title || product.titulo}" da seção Mais Desejados da Home?\n\n(O produto continuará existindo no catálogo normal)`,
      confirmText: 'Sim, Remover',
      cancelText: 'Cancelar',
      onConfirm: () => performRemoval(product),
      onCancel: closeModal,
    });
  };

  const formatPrice = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className={styles.container}>


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
                        disabled={togglingNewId === prod.id}
                        className={`${styles.toggleBtn} ${
                          isNew ? styles.toggleBtnActive : ''
                        }`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {togglingNewId === prod.id ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Salvando...</span>
                          </>
                        ) : isNew ? (
                          '✓ Sim (Ativo)'
                        ) : (
                          'Não'
                        )}
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
      {/* Friendly Action Confirmation & Feedback Modal */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        isLoading={isRemoving}
        onConfirm={modalConfig.onConfirm || closeModal}
        onCancel={modalConfig.onCancel || closeModal}
        onClose={closeModal}
      />
    </div>
  );
}
