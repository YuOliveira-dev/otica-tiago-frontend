import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lightbulb, ChevronLeft, ChevronRight, BookOpen, Smartphone } from 'lucide-react';
import { MANUAL_MODULES } from '../manualData';
import styles from '../manual.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string }[] = [];
  for (const m of MANUAL_MODULES) {
    params.push({ slug: m.slug });
    params.push({ slug: m.folder });
  }
  return params;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const normalized = (slug || '').toLowerCase();
  const mod = MANUAL_MODULES.find(
    (m) => m.slug.toLowerCase() === normalized || m.folder.toLowerCase() === normalized
  );
  if (!mod) return { title: 'Módulo não encontrado — TS EYEWEAR' };

  return {
    title: `${mod.title} — Manual do Usuário TS EYEWEAR`,
    description: mod.subtitle,
  };
}

export default async function ManualModulePage({ params }: Props) {
  const { slug } = await params;
  const normalized = (slug || '').toLowerCase();
  const currentIndex = MANUAL_MODULES.findIndex(
    (m) => m.slug.toLowerCase() === normalized || m.folder.toLowerCase() === normalized
  );

  if (currentIndex === -1) {
    notFound();
  }

  const mod = MANUAL_MODULES[currentIndex];
  const prevMod = currentIndex > 0 ? MANUAL_MODULES[currentIndex - 1] : null;
  const nextMod = currentIndex < MANUAL_MODULES.length - 1 ? MANUAL_MODULES[currentIndex + 1] : null;

  const videoUrl = `/manual/${mod.slug}/${mod.videoFile}`;
  const qrUrl = `/manual/${mod.slug}/qr-video.png`;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.brandGroup}>
            <Link href="/" className={styles.brandLogo}>TS EYEWEAR</Link>
            <span className={styles.badge}>MANUAL DO USUÁRIO</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link href="/admin" className={styles.btnSecondary}>
              Painel Admin
            </Link>
            <Link href="/manual" className={styles.btnSecondary}>
              ← Todos os Módulos
            </Link>
          </div>
        </header>

        {/* Title */}
        <h1 className={styles.title}>{mod.title}</h1>
        <p className={styles.subtitle}>{mod.subtitle}</p>

        {/* Overview Box */}
        <div className={styles.overviewBox}>
          <div className={styles.overviewTitle}>Objetivo do Módulo</div>
          <p className={styles.overviewText}>{mod.overview}</p>
        </div>

        {/* Video Player Card */}
        <div className={styles.videoCard}>
          <video
            controls
            autoPlay
            playsInline
            preload="auto"
            className={styles.videoPlayer}
          >
            <source src={videoUrl} type="video/mp4" />
            Seu navegador não suporta a exibição direta deste vídeo.
          </video>
        </div>

        {/* Informative Action Bar (No download buttons, purely user guidance) */}
        <div className={styles.actions} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8', fontSize: 13 }}>
            <span style={{ color: '#c5a96f', fontWeight: 700 }}>Duração do Vídeo:</span>
            <span>{mod.duration} • Gravado em Tela Real (HD)</span>
          </div>

          <div className={styles.qrBox}>
            <img className={styles.qrImg} src={qrUrl} alt="QR Code para Celular" />
            <div>
              <div className={styles.qrTitle} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Smartphone size={13} />
                <span>Assistir no Celular</span>
              </div>
              <div className={styles.qrSub}>Aponte a câmera para abrir</div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Breakdown (Rich Text + Screenshots + Tips) */}
        <div className={styles.stepsSection}>
          <h2 className={styles.stepsHeading}>
            Passo a Passo Detalhado
          </h2>

          <div>
            {mod.steps.map((step) => (
              <div key={step.num} className={styles.stepItem}>
                <div className={styles.stepBadge}>{step.num}</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDesc}>{step.desc}</div>

                  {/* Bulleted details */}
                  {step.details && step.details.length > 0 && (
                    <ul className={styles.stepDetails}>
                      {step.details.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {/* Operational Tip */}
                  {step.tip && (
                    <div className={styles.stepTip}>
                      <Lightbulb size={16} color="#c5a96f" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{step.tip}</span>
                    </div>
                  )}

                  {/* Step Screenshot Illustration */}
                  {step.screenshot && (
                    <div className={styles.stepScreenshotWrapper}>
                      <img
                        src={step.screenshot}
                        alt={`Passo ${step.num} - ${step.title}`}
                        className={styles.stepScreenshotImg}
                      />
                      <div className={styles.stepScreenshotCaption}>
                        Ilustração do Passo {step.num}: {step.title}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation between modules */}
        <div className={styles.moduleNavRow}>
          {prevMod ? (
            <Link href={`/manual/${prevMod.slug}`} className={styles.btnNav}>
              <ChevronLeft size={16} />
              <span>Anterior: {prevMod.title}</span>
            </Link>
          ) : (
            <span />
          )}

          <Link href="/manual" className={styles.btnNav}>
            <BookOpen size={16} />
            <span>Índice Geral do Manual</span>
          </Link>

          {nextMod ? (
            <Link href={`/manual/${nextMod.slug}`} className={styles.btnNav}>
              <span>Próximo: {nextMod.title}</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
