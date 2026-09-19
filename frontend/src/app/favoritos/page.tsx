'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Trash2, MessageCircle, ArrowRight, Truck, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../../components/CardProduto/CardProduto';
import { getProducts } from '../../services/catalog.service';
import { generateWhatsAppLink } from '../../services/whatsapp';
import { Product } from '../../types';
import styles from './favoritos.module.css';

export default function FavoritosPage() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorite IDs from localStorage
  useEffect(() => {
    const loadSavedFavorites = () => {
      try {
        const stored =
          localStorage.getItem('ts_eyewear_favoritos') ||
          localStorage.getItem('ts_favoritos');
        if (stored) {
          const ids: string[] = JSON.parse(stored);
          setFavoriteIds(Array.isArray(ids) ? ids : []);
        } else {
          setFavoriteIds([]);
        }
      } catch {
        // Silent error
      }
    };

    loadSavedFavorites();
    window.addEventListener('wishlist:updated', loadSavedFavorites);
    window.addEventListener('storage', loadSavedFavorites);

    return () => {
      window.removeEventListener('wishlist:updated', loadSavedFavorites);
      window.removeEventListener('storage', loadSavedFavorites);
    };
  }, []);

  // Fetch products matching favorite IDs
  useEffect(() => {
    async function loadProducts() {
      try {
        const allProducts = await getProducts();
        const filtered = allProducts.filter((p) => favoriteIds.includes(p.id));
        setProducts(filtered);
      } catch (err) {
        console.error('Erro ao carregar produtos favoritos:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, [favoriteIds]);

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja remover todos os modelos salvos?')) {
      localStorage.removeItem('ts_eyewear_favoritos');
      localStorage.removeItem('ts_favoritos');
      window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { ids: [] } }));
      setFavoriteIds([]);
      setProducts([]);
    }
  };

  const batchWhatsAppLink = generateWhatsAppLink({
    type: 'favorites_list',
    favoriteProducts: products.map((p) => ({
      title: p.title || p.titulo || '',
      parentSku: p.parentSku || p.skuPai || '',
      price: p.promotionalPrice || p.precoPromocional || p.price || p.precoVenda || 0,
    })),
  });

  return (
    <div className={styles.favoritosContainer}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/">Início</Link>
        <span>/</span>
        <span>Favoritos</span>
      </nav>

      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1>Meus Favoritos</h1>
          <p>
            {products.length === 1
              ? '1 modelo salvo na sua lista de desejos'
              : `${products.length} modelos salvos na sua lista de desejos`}
          </p>
        </div>

        {products.length > 0 && (
          <div className={styles.headerActions}>
            <button
              type="button"
              onClick={handleClearAll}
              className={styles.btnClear}
              title="Limpar todos os favoritos"
            >
              <Trash2 size={16} />
              Limpar Lista
            </button>

            <a
              href={batchWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnWhatsAppAll}
            >
              <MessageCircle size={18} />
              Pedir Orçamento da Lista ({products.length})
            </a>
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: 'var(--color-text-muted)' }}>Carregando seus favoritos...</p>
        </div>
      ) : products.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper}>
            <Heart size={36} />
          </div>
          <h2 className={styles.emptyTitle}>Sua lista está vazia</h2>
          <p className={styles.emptyDesc}>
            Você ainda não salvou nenhuma armação. Navegue pelo nosso catálogo e clique no ícone
            de coração para guardar seus modelos preferidos.
          </p>
          <Link href="/catalogo" className={styles.btnExplore}>
            Explorar Catálogo Completo
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Guarantee & Shipping Notice */}
          <div className={styles.infoBanner}>
            <div className={styles.infoBannerText}>
              <h4>Frete Grátis para todo o Brasil em todos os pedidos!</h4>
              <p>
                Garantia legal e de fábrica de 90 dias com primeira troca grátis em até 7 dias após
                a entrega.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-accent)' }}>
              <span title="Frete Grátis Brasil"><Truck size={24} /></span>
              <span title="Garantia 90 Dias"><ShieldCheck size={24} /></span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
