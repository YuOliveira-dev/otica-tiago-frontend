'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { WhatsAppIcon } from '../Icons';
import { Product } from '../../types';
import { generateWhatsAppLink } from '../../services/whatsapp';
import styles from './CardProduto.module.css';

export interface ProductCardProps {
  product?: Product;
  // Legacy alias
  produto?: Product;
}

export function ProductCard({ product, produto }: ProductCardProps) {
  const activeProduct = product || produto;
  const [isFavorite, setIsFavorite] = useState(false);

  const variations = activeProduct?.variations || activeProduct?.variacoes || [];
  const [selectedVarId, setSelectedVarId] = useState<string>(
    variations[0]?.id || ''
  );
  const [photoIndex, setPhotoIndex] = useState<number>(0);

  // Sync variations if product ID changes
  useEffect(() => {
    if (variations[0]?.id) {
      setSelectedVarId(variations[0].id);
      setPhotoIndex(0);
    }
  }, [activeProduct?.id]);

  // Wishlist check
  useEffect(() => {
    if (!activeProduct?.id) return;
    try {
      const saved = localStorage.getItem('ts_eyewear_favoritos');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setIsFavorite(ids.includes(activeProduct.id));
      }
    } catch {
      // Defensive silence
    }
  }, [activeProduct?.id]);

  if (!activeProduct) return null;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved = localStorage.getItem('ts_eyewear_favoritos');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      if (ids.includes(activeProduct.id)) {
        ids = ids.filter((id) => id !== activeProduct.id);
        setIsFavorite(false);
      } else {
        ids.push(activeProduct.id);
        setIsFavorite(true);
      }

      localStorage.setItem('ts_eyewear_favoritos', JSON.stringify(ids));
      window.dispatchEvent(
        new CustomEvent('wishlist:updated', { detail: { ids } })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const currentVariation =
    variations.find((v) => v.id === selectedVarId) || variations[0];

  // Derive photos for the active variation or full product gallery
  const mediaList = activeProduct.media || activeProduct.midias || [];
  const photosForVariation = useMemo(() => {
    if (!currentVariation) {
      return mediaList.map((m) => m.url);
    }
    // 1. Variation matching media
    const matching = mediaList.filter(
      (m) => m.variationId === currentVariation.id
    );
    if (matching.length > 0) {
      return matching.map((m) => m.url);
    }
    // 2. Direct variation image
    if (currentVariation.imageUrl) {
      return [currentVariation.imageUrl];
    }
    // 3. Fallback to product media
    return mediaList.length > 0
      ? mediaList.map((m) => m.url)
      : [
          'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
        ];
  }, [mediaList, currentVariation]);

  const currentPhoto =
    photosForVariation[photoIndex % photosForVariation.length] ||
    photosForVariation[0];

  const handleSelectVariation = (varId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedVarId(varId);
    setPhotoIndex(0);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex(
      (prev) => (prev - 1 + photosForVariation.length) % photosForVariation.length
    );
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photosForVariation.length);
  };

  const handleSelectPhoto = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex(idx);
  };

  const regularPrice = activeProduct.price ?? activeProduct.precoVenda ?? 0;
  const promoPrice =
    activeProduct.promotionalPrice ?? activeProduct.precoPromocional;
  const effectivePrice = promoPrice || regularPrice;
  const hasDiscount = !!promoPrice && promoPrice < regularPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100)
    : 0;

  const whatsAppLink = generateWhatsAppLink({
    product: {
      title: activeProduct.title || activeProduct.titulo || '',
      parentSku: activeProduct.parentSku || activeProduct.skuPai || '',
      price: effectivePrice,
      color: currentVariation?.colorName || currentVariation?.corNome,
    },
    type: 'purchase',
  });

  const productTitle = activeProduct.title || activeProduct.titulo || '';
  const isNew = activeProduct.isNew || activeProduct.novidade;

  return (
    <article className={styles.card}>
      {/* Wishlist Button */}
      <button
        onClick={toggleFavorite}
        className={`${styles.wishlistBtn} ${isFavorite ? styles.wishlistBtnActive : ''}`}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={isFavorite ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
        type="button"
      >
        <Heart size={20} fill={isFavorite ? 'var(--color-danger)' : 'none'} color={isFavorite ? 'var(--color-danger)' : 'var(--color-primary-800)'} />
      </button>

      {/* Product Image Area with Selectable Photos */}
      <div className={styles.imageArea}>
        <Link
          href={`/produto/${activeProduct.id}`}
          scroll={true}
          className={styles.imageLink}
          aria-label={`Ver detalhes de ${productTitle}`}
        >
          <img
            src={currentPhoto}
            alt={`${productTitle} - ${currentVariation?.colorName || ''}`}
            className={styles.productImage}
            loading="lazy"
          />
        </Link>

        {/* Photo Navigation Arrows (visible when multiple photos available) */}
        {photosForVariation.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className={`${styles.arrowBtn} ${styles.arrowPrev}`}
              aria-label="Foto anterior"
              type="button"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextPhoto}
              className={`${styles.arrowBtn} ${styles.arrowNext}`}
              aria-label="Próxima foto"
              type="button"
            >
              <ChevronRight size={16} />
            </button>

            {/* Photo Indicator Dots */}
            <div className={styles.photoDots}>
              {photosForVariation.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => handleSelectPhoto(i, e)}
                  className={`${styles.photoDot} ${i === photoIndex ? styles.photoDotActive : ''}`}
                  aria-label={`Foto ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        {/* Harmonious Badges Row using Design System Tokens */}
        <div className={styles.badgesRow}>
          <span className={styles.badgeExclusivo}>Só na TS</span>
          <span className={styles.badgeFrete}>Frete Grátis</span>
          {isNew && <span className={styles.badgeNovo}>Lançamento</span>}
        </div>

        {/* Title */}
        <Link href={`/produto/${activeProduct.id}`} scroll={true} className={styles.titleLink}>
          <h3 className={styles.title} title={productTitle}>
            {productTitle}
          </h3>
        </Link>

        {/* 5 Yellow Stars Rating */}
        <div className={styles.ratingRow} aria-label="Avaliação: 5 de 5 estrelas">
          <div className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={15} fill="var(--color-accent-400)" color="var(--color-accent-500)" />
            ))}
          </div>
        </div>

        {/* Color Swatches (Select color -> updates corresponding photo) */}
        {variations.length > 0 && (
          <div className={styles.colorSelectorArea}>
            <div className={styles.swatchesList}>
              {variations.map((v) => {
                const isSelected = v.id === currentVariation?.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => handleSelectVariation(v.id, e)}
                    className={`${styles.colorSwatch} ${isSelected ? styles.colorSwatchActive : ''}`}
                    style={{ backgroundColor: v.colorHex || '#1E293B' }}
                    title={v.colorName || v.corNome}
                    aria-label={`Selecionar cor ${v.colorName || v.corNome}`}
                  />
                );
              })}
            </div>
            {currentVariation && (
              <span className={styles.selectedColorLabel}>
                {currentVariation.colorName || currentVariation.corNome}
              </span>
            )}
          </div>
        )}

        {/* Price Section with Original strikethrough and Discount Pill */}
        <div className={styles.priceSection}>
          <div className={styles.priceHeader}>
            {hasDiscount && (
              <span className={styles.priceOriginal}>
                {regularPrice.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            )}
            {hasDiscount && (
              <span className={styles.discountBadge}>
                {discountPercentage}%
              </span>
            )}
          </div>

          <div className={styles.priceCurrent}>
            {effectivePrice.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </div>

          <div className={styles.installments}>
            à vista no <strong>PIX</strong> com Frete Grátis Brasil
          </div>
        </div>

        {/* Action Buttons: "Comprar Agora" and circular WhatsApp button */}
        <div className={styles.actionsRow}>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnBuyNow}
          >
            Comprar Agora
          </a>
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnCart}
            aria-label="Pedir no WhatsApp"
            title="Pedir no WhatsApp"
          >
            <WhatsAppIcon size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}

// Backward compatibility export
export const CardProduto = ProductCard;
export type CardProdutoProps = ProductCardProps;
