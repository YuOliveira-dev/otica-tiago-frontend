'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CheckCircle2, Award, Sparkles } from 'lucide-react';
import { getActiveBanners, INITIAL_BANNERS } from '../../services/banner.service';
import { Banner } from '../../types';
import styles from './HeroCarousel.module.css';

export function HeroCarousel() {
  const [slides, setSlides] = useState<Banner[]>(INITIAL_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load active banners from banner service and sync on updates
  useEffect(() => {
    async function loadData() {
      const data = await getActiveBanners();
      if (data && data.length > 0) {
        setSlides(data);
      }
    }

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('banners:updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('banners:updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Safe active slide index if slides count changes
  const activeIndex = currentSlide >= slides.length ? 0 : currentSlide;

  // Auto transition every 5 seconds (5000ms) as requested
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length]);

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetTimer();
  };

  if (slides.length === 0) return null;

  return (
    <section className={styles.heroSection}>
      <div
        className={styles.bannerWrapper}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slides Track */}
        <div className={styles.slidesTrack}>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id || index}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                aria-hidden={!isActive}
              >
                {/* Background Luxury Gradient from Design System */}
                <div className={styles.slideBg} />

                {/* Decorative Brand Sparkles */}
                <div className={styles.sparkleOne} />
                <div className={styles.sparkleTwo} />

                {/* Main Content Layout (1330x400 standard) */}
                <div className={styles.slideContent}>
                  {/* Left Column: Headlines and CTA */}
                  <div className={styles.leftCol}>
                    <div className={styles.eyebrow}>
                      <Sparkles size={13} />
                      <span>Coleção Exclusiva TS</span>
                    </div>
                    <h2 className={styles.title}>{slide.title}</h2>
                    <p className={styles.subtitle}>{slide.subtitle}</p>

                    <div className={styles.ctaArea}>
                      <Link href={slide.ctaUrl || '/catalogo'} className={styles.btnCta}>
                        {slide.ctaText || 'CONFERIR COLEÇÃO'}
                      </Link>
                    </div>
                  </div>

                  {/* Center Column: Model / Eyewear Visual */}
                  <div className={styles.centerCol}>
                    <div className={styles.modelFrame}>
                      <img
                        src={slide.imageUrl}
                        alt={`Banner TS EYEWEAR - ${slide.title}`}
                        className={styles.modelImg}
                        loading={index === 0 ? 'eager' : 'lazy'}
                      />
                      <div className={styles.interactiveChip}>
                        <span className={styles.chipBrand}>TS EYEWEAR</span>
                        <CheckCircle2 size={16} color="var(--color-success)" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Accreditation Badge & Brand */}
                  <div className={styles.rightCol}>
                    <div className={styles.trustBadge}>
                      <div className={styles.badgeIconArea}>
                        <Award size={26} color="var(--color-accent-600)" />
                      </div>
                      <span className={styles.badgeCompany}>TS EYEWEAR</span>
                      <strong className={styles.badgeName}>
                        {slide.badgeTitle || 'Excelência Óptica'}
                      </strong>
                      <span className={styles.badgeMeta}>
                        {slide.badgeSub || '5 Anos de Tradição'}
                      </span>
                    </div>

                    <div className={styles.brandSignature}>
                      <span className={styles.brandSignatureSub}>ÓTICA TS</span>
                      <span className={styles.brandSignatureMain}>EYEWEAR</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Pagination Dots (Matching Reference Pill Layout) */}
        {slides.length > 1 && (
          <div
            className={styles.dotsContainer}
            role="tablist"
            aria-label="Seleção de slides"
          >
            <div className={styles.dotsCapsule}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                  aria-label={`Slide ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
