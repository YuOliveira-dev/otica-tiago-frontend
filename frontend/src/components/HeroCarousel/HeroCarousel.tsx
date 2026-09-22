'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Award, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { getActiveBanners, INITIAL_BANNERS } from '../../services/banner.service';
import { Banner } from '../../types';
import styles from './HeroCarousel.module.css';

const SLIDE_DURATION = 6000;

export function HeroCarousel() {
  const [slides, setSlides] = useState<Banner[]>(INITIAL_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getActiveBanners();
        if (data && data.length > 0) {
          setSlides(data);
          setCurrentSlide(0);
        }
      } catch (err) {
        console.error(err);
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

  const totalSlides = slides.length;
  const activeIndex = currentSlide >= totalSlides ? 0 : currentSlide;

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, SLIDE_DURATION);

    return () => clearTimeout(timer);
  }, [currentSlide, isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  if (totalSlides === 0) return null;

  return (
    <section className={styles.heroSection}>
      <div
        className={styles.bannerWrapper}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.slidesTrack}>
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.id || index}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                aria-hidden={!isActive}
              >
                <div className={styles.slideBg} />
                <div className={styles.sparkleOne} />
                <div className={styles.sparkleTwo} />

                <div className={styles.slideContent}>
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

        {totalSlides > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowPrev}`}
              onClick={prevSlide}
              aria-label="Slide anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowNext}`}
              onClick={nextSlide}
              aria-label="Próximo slide"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        {totalSlides > 1 && (
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
