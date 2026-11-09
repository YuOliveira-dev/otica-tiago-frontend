'use client';

import React from 'react';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  circle?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Base shimmering Skeleton component.
 */
export function Skeleton({
  width,
  height,
  borderRadius,
  circle = false,
  className = '',
  style,
}: SkeletonProps) {
  const inlineStyle: React.CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height !== undefined ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...(borderRadius !== undefined ? { borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius } : {}),
  };

  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.skeletonCircle : ''} ${className}`}
      style={inlineStyle}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for Public Catalog and Favorites Product Card.
 */
export function SkeletonProductCard() {
  return (
    <div className={styles.productCard} aria-busy="true" aria-label="Carregando produto...">
      <Skeleton className={styles.productCardImage} />
      <div className={styles.productCardBody}>
        {/* Badges placeholder */}
        <div className={styles.badgesRow}>
          <Skeleton width={55} height={18} borderRadius={4} />
          <Skeleton width={70} height={18} borderRadius={4} />
        </div>

        {/* Title placeholder */}
        <Skeleton width="85%" height={20} borderRadius={4} style={{ marginTop: 4 }} />

        {/* Rating stars */}
        <div className={styles.starsRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={14} height={14} borderRadius={2} />
          ))}
        </div>

        {/* Color swatches */}
        <div className={styles.colorsRow}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width={18} height={18} circle />
          ))}
        </div>

        {/* Price & Action button */}
        <div className={styles.priceBlock}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Skeleton width={50} height={12} borderRadius={3} />
            <Skeleton width={80} height={22} borderRadius={4} />
          </div>
          <Skeleton width={110} height={36} borderRadius={20} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Table Row for Admin Products & Dashboard tables.
 */
export function SkeletonTableRow({ columns = 6 }: { columns?: number }) {
  return (
    <tr className={styles.tableRow} aria-busy="true">
      {/* 1. Thumbnail + Title/SKU */}
      <td className={styles.tableCell}>
        <div className={styles.cellProdInfo}>
          <Skeleton width={48} height={48} borderRadius={8} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton width={140} height={16} borderRadius={4} />
            <Skeleton width={80} height={12} borderRadius={3} />
          </div>
        </div>
      </td>

      {/* 2. Category */}
      <td className={styles.tableCell}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Skeleton width={90} height={15} borderRadius={4} />
          <Skeleton width={60} height={11} borderRadius={3} />
        </div>
      </td>

      {/* 3. Variations */}
      <td className={styles.tableCell}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Skeleton width={18} height={18} circle />
          <Skeleton width={18} height={18} circle />
          <Skeleton width={40} height={13} borderRadius={3} />
        </div>
      </td>

      {/* 4. Stock */}
      <td className={styles.tableCell}>
        <Skeleton width={75} height={22} borderRadius={12} />
      </td>

      {/* 5. Status / Visibility */}
      {columns >= 5 && (
        <td className={styles.tableCell}>
          <Skeleton width={65} height={22} borderRadius={12} />
        </td>
      )}

      {/* 6. Actions */}
      {columns >= 6 && (
        <td className={styles.tableCell} style={{ textAlign: 'right' }}>
          <div className={styles.cellActions}>
            <Skeleton width={32} height={32} borderRadius={6} />
            <Skeleton width={32} height={32} borderRadius={6} />
            <Skeleton width={32} height={32} borderRadius={6} />
          </div>
        </td>
      )}
    </tr>
  );
}

/**
 * Skeleton for Admin Category Cards Grid.
 */
export function SkeletonCategoryCard() {
  return (
    <div className={styles.categoryCard} aria-busy="true">
      <div className={styles.categoryCardHeader}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width={130} height={20} borderRadius={4} />
          <Skeleton width={90} height={13} borderRadius={3} />
        </div>
        <div className={styles.categoryCardActions}>
          <Skeleton width={30} height={30} borderRadius={6} />
          <Skeleton width={30} height={30} borderRadius={6} />
        </div>
      </div>
      <div>
        <Skeleton width={110} height={14} borderRadius={3} style={{ marginBottom: 10 }} />
        <div className={styles.tagList}>
          <Skeleton width={70} height={24} borderRadius={12} />
          <Skeleton width={85} height={24} borderRadius={12} />
          <Skeleton width={60} height={24} borderRadius={12} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Admin Banners & Category Cards in Vitrine.
 */
export function SkeletonBannerCard() {
  return (
    <div className={styles.bannerCard} aria-busy="true">
      <Skeleton className={styles.bannerThumb} />
      <div className={styles.bannerBody}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton width={160} height={18} borderRadius={4} />
          <Skeleton width={80} height={13} borderRadius={3} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Skeleton width={65} height={26} borderRadius={13} />
          <Skeleton width={32} height={32} borderRadius={6} />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Admin Product Edit Form (/admin/produtos/novo).
 */
export function SkeletonProductForm() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }} aria-busy="true">
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton width={180} height={36} borderRadius={8} />
        <Skeleton width={140} height={42} borderRadius={8} />
      </div>

      {/* Form sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton width={160} height={22} borderRadius={4} />
          <Skeleton width="100%" height={40} borderRadius={8} />
          <Skeleton width="100%" height={40} borderRadius={8} />
          <Skeleton width="60%" height={40} borderRadius={8} />
        </div>
        <div style={{ background: '#ffffff', borderRadius: 12, padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton width={140} height={22} borderRadius={4} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <Skeleton width="100%" height={80} borderRadius={8} />
            <Skeleton width="100%" height={80} borderRadius={8} />
            <Skeleton width="100%" height={80} borderRadius={8} />
          </div>
        </div>
      </div>
    </div>
  );
}
