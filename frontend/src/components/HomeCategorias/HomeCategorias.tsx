'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  getActiveHomeCategoryCards,
  getHomeCategorySectionConfig,
  INITIAL_CATEGORY_CARDS,
  INITIAL_CATEGORY_SECTION_CONFIG,
} from '../../services/home-categories.service';
import { HomeCategoryCard, HomeCategorySectionConfig } from '../../types';
import styles from '../../app/page.module.css';

export function HomeCategorias() {
  const [cards, setCards] = useState<HomeCategoryCard[]>(INITIAL_CATEGORY_CARDS);
  const [config, setConfig] = useState<HomeCategorySectionConfig>(INITIAL_CATEGORY_SECTION_CONFIG);

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedCards, loadedConfig] = await Promise.all([
          getActiveHomeCategoryCards(),
          getHomeCategorySectionConfig(),
        ]);
        if (loadedCards && loadedCards.length > 0) {
          setCards(loadedCards);
        }
        if (loadedConfig) {
          setConfig(loadedConfig);
        }
      } catch (err) {
        console.error('Erro ao carregar categorias da home:', err);
      }
    }

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('home_categories:updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('home_categories:updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>{config.eyebrow}</span>
          <h2 className={styles.sectionTitle}>{config.title}</h2>
          <p className={styles.sectionDesc}>{config.description}</p>
        </div>

        <div className={styles.categoriasGrid}>
          {cards.map((cat, i) => (
            <Link key={cat.id || i} href={cat.link} className={styles.categoriaCard}>
              <img
                src={cat.img}
                alt={cat.title}
                className={styles.categoriaBg}
                loading="lazy"
              />
              <div className={styles.categoriaOverlay} />
              <div className={styles.categoriaContent}>
                <h3 className={styles.categoriaTitulo}>{cat.title}</h3>
                <div className={styles.categoriaSub}>
                  <span>{cat.sub}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
