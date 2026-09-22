'use client';

import { useState, useSyncExternalStore } from 'react';
import { FileText, Truck, ShieldCheck, Ruler, Check, Heart } from 'lucide-react';
import { WhatsAppIcon } from '../../../components/Icons';
import { Product } from '../../../types';
import { MeasurementsModal } from '../../../components/ModalMedidas/ModalMedidas';
import { generateWhatsAppLink } from '../../../services/whatsapp';
import styles from './produto.module.css';

export interface ProductDetailsClientProps {
  product?: Product;
  // Legacy alias
  produto?: Product;
}

function subscribeWishlist(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('wishlist:updated', callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener('wishlist:updated', callback);
    window.removeEventListener('storage', callback);
  };
}

function getWishlistSnapshot(): string {
  try {
    return localStorage.getItem('ts_eyewear_favoritos') || '[]';
  } catch {
    return '[]';
  }
}

function getWishlistServerSnapshot(): string {
  return '[]';
}

export function ProductDetailsClient({ product, produto }: ProductDetailsClientProps) {
  const activeProduct = product || produto;
  const variations = activeProduct?.variations || activeProduct?.variacoes || [];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState(variations[0]);
  const [isMeasurementsModalOpen, setIsMeasurementsModalOpen] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [isShippingCalculated, setIsShippingCalculated] = useState(false);

  const rawWishlist = useSyncExternalStore(
    subscribeWishlist,
    getWishlistSnapshot,
    getWishlistServerSnapshot
  );
  const isFavorite = activeProduct ? rawWishlist.includes(activeProduct.id) : false;

  if (!activeProduct) return null;

  const toggleFavorite = () => {
    try {
      const saved = localStorage.getItem('ts_eyewear_favoritos');
      let ids: string[] = saved ? JSON.parse(saved) : [];
      if (ids.includes(activeProduct.id)) {
        ids = ids.filter((id) => id !== activeProduct.id);
      } else {
        ids.push(activeProduct.id);
      }
      localStorage.setItem('ts_eyewear_favoritos', JSON.stringify(ids));
      window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { ids } }));
    } catch {
      // Silence storage error
    }
  };

  const mediaList = activeProduct.media || activeProduct.midias || [];
  const images = mediaList.length > 0
    ? mediaList.map((m) => m.url)
    : ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80'];

  const regularPrice = activeProduct.price ?? activeProduct.precoVenda ?? 0;
  const promoPrice = activeProduct.promotionalPrice ?? activeProduct.precoPromocional;
  const effectivePrice = promoPrice || regularPrice;
  const hasDiscount = !!promoPrice && promoPrice < regularPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100)
    : 0;

  const productTitle = activeProduct.title || activeProduct.titulo || '';
  const parentSku = activeProduct.parentSku || activeProduct.skuPai || '';
  const productDescription = activeProduct.description || activeProduct.descricao || '';
  const frameShape = activeProduct.shape || activeProduct.formato;

  const colorName = selectedVariation?.colorName || selectedVariation?.corNome;
  const lensWidth = selectedVariation?.lensWidthMm ?? selectedVariation?.aroMm;
  const bridge = selectedVariation?.bridgeMm ?? selectedVariation?.ponteMm;
  const temple = selectedVariation?.templeMm ?? selectedVariation?.hasteMm;

  const whatsAppBuyLink = generateWhatsAppLink({
    product: {
      title: productTitle,
      parentSku,
      price: effectivePrice,
      color: colorName,
    },
    type: 'purchase',
  });

  const whatsAppPrescriptionLink = generateWhatsAppLink({
    product: {
      title: productTitle,
      parentSku,
      price: effectivePrice,
    },
    type: 'prescription',
  });

  const handleCalculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode.replace(/\D/g, '').length >= 8) {
      setIsShippingCalculated(true);
    }
  };

  return (
    <>
      <div className={styles.productGrid}>
        {/* Column 1: Sticky Photo Gallery */}
        <div className={styles.gallerySticky}>
          <div className={styles.mainImageWrapper}>
            <img
              src={images[activeImageIndex] || images[0]}
              alt={productTitle}
              className={styles.mainImage}
            />
          </div>

          {images.length > 1 && (
            <div className={styles.thumbnailsRow}>
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`${styles.thumbBtn} ${i === activeImageIndex ? styles.thumbBtnActive : ''}`}
                  aria-label={`Visualizar foto ${i + 1}`}
                >
                  <img src={url} alt={`miniatura ${i + 1}`} className={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Technical Info & Purchasing Actions */}
        <div className={styles.infoCol}>
          <div className={styles.metaHeader}>
            <span className={styles.brandBadge}>TS EYEWEAR • 100% ORIGINAL</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={styles.skuText}>SKU: {parentSku}</span>
              <button
                type="button"
                onClick={toggleFavorite}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isFavorite ? '#ef4444' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  transition: 'transform 0.2s',
                }}
                title={isFavorite ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              >
                <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
              </button>
            </div>
          </div>

          <h1 className={styles.title}>{productTitle}</h1>

          {/* Pricing Block */}
          <div className={styles.priceCard}>
            {hasDiscount && (
              <div className={styles.priceFrom}>
                De: {regularPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} (-{discountPercentage}%)
              </div>
            )}
            <div className={styles.priceMain}>
              <span>{effectivePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <span className={styles.pixDiscount}>à vista no PIX</span>
            </div>
            <div className={styles.installmentText}>
              ou em até <strong>10x de {(effectivePrice / 10).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong> sem juros no cartão
            </div>
          </div>

          {/* Free Shipping & Warranty Notice */}
          <div className={styles.freteBox}>
            <Truck size={24} style={{ flexShrink: 0 }} />
            <div>
              <strong>Frete Grátis para todo o Brasil!</strong>
              <div>Envio rápido e seguro via Correios (SEDEX/PAC) com rastreamento no WhatsApp.</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.8rem', color: '#047857' }}>
                <ShieldCheck size={16} />
                <span>Garantia de 90 Dias e Primeira Troca Grátis (7 Dias)</span>
              </div>
            </div>
          </div>

          {/* Color Variations Selector */}
          {variations.length > 0 && (
            <div className={styles.sectionBlock}>
              <div className={styles.blockTitle}>
                <span>Cor Selecionada:</span>
                <strong style={{ color: 'var(--color-primary-950)' }}>{colorName}</strong>
              </div>
              <div className={styles.colorOptions}>
                {variations.map((v) => {
                  const isSelected = v.id === selectedVariation?.id;
                  const vColorName = v.colorName || v.corNome;
                  const vColorHex = v.colorHex || v.corHex;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`${styles.colorBtn} ${isSelected ? styles.colorBtnSelected : ''}`}
                    >
                      {vColorHex && (
                        <span
                          className={styles.colorDot}
                          style={{ backgroundColor: vColorHex }}
                        />
                      )}
                      <span>{vColorName}</span>
                      {isSelected && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Technical Measurements */}
          {selectedVariation && (
            <div className={styles.sectionBlock}>
              <div className={styles.blockTitle}>
                <span>Dimensões Técnicas:</span>
                <button
                  onClick={() => setIsMeasurementsModalOpen(true)}
                  className={styles.btnModalMedidas}
                >
                  <Ruler size={14} />
                  <span>Como saber meu tamanho?</span>
                </button>
              </div>

              <div className={styles.specsBox}>
                <table className={styles.specsTable}>
                  <tbody>
                    <tr>
                      <td className={styles.specKey}>Largura do Aro</td>
                      <td className={styles.specVal}>{lensWidth} mm</td>
                    </tr>
                    <tr>
                      <td className={styles.specKey}>Ponte Nasal</td>
                      <td className={styles.specVal}>{bridge} mm</td>
                    </tr>
                    <tr>
                      <td className={styles.specKey}>Comprimento da Haste</td>
                      <td className={styles.specVal}>{temple} mm</td>
                    </tr>
                    <tr>
                      <td className={styles.specKey}>Material da Armação</td>
                      <td className={styles.specVal}>{selectedVariation.material}</td>
                    </tr>
                    {frameShape && (
                      <tr>
                        <td className={styles.specKey}>Formato do Rosto</td>
                        <td className={styles.specVal}>{frameShape}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className={styles.ctaContainer}>
            <a
              href={whatsAppBuyLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnComprarWhatsApp}
            >
              <WhatsAppIcon size={22} />
              <span>Comprar pelo WhatsApp</span>
            </a>

            <a
              href={whatsAppPrescriptionLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnOrcarGrau}
            >
              <FileText size={18} />
              <span>Orçar com Minha Receita de Grau</span>
            </a>
          </div>

          {/* Shipping Simulator */}
          <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-primary-950)' }}>
              Calcular prazo de entrega:
            </div>
            <form onSubmit={handleCalculateShipping} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Digite seu CEP (ex: 01032-000)"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength={9}
                style={{
                  flex: 1,
                  height: '40px',
                  padding: '0 12px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0 16px',
                  backgroundColor: 'var(--color-primary-950)',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Calcular
              </button>
            </form>

            {isShippingCalculated && (
              <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-xs)', fontSize: '0.8125rem', color: '#166534' }}>
                ✓ <strong>Frete Grátis Brasil</strong>: Entrega estimada em <strong>3 a 7 dias úteis</strong> com rastreamento completo via SEDEX / Transportadora.
              </div>
            )}
          </div>

          {/* Product Description */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary-950)', marginBottom: '8px' }}>
              Sobre este Modelo
            </h4>
            <p style={{ fontSize: '0.9375rem', lineHeight: '1.7', color: 'var(--color-text-body)' }}>
              {productDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className={styles.stickyBottomBar}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Preço à vista:</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-950)' }}>
            {effectivePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </div>
        </div>
        <a
          href={whatsAppBuyLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px',
            backgroundColor: 'var(--color-whatsapp)',
            color: '#FFFFFF',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.875rem',
          }}
        >
          <WhatsAppIcon size={18} />
          <span>Comprar</span>
        </a>
      </div>

      {/* Measurements Modal */}
      <MeasurementsModal
        isOpen={isMeasurementsModalOpen}
        onClose={() => setIsMeasurementsModalOpen(false)}
        lensWidth={lensWidth}
        bridge={bridge}
        temple={temple}
      />
    </>
  );
}

// Backward compatibility export
export const ProdutoDetalhesClient = ProductDetailsClient;
export default ProductDetailsClient;
