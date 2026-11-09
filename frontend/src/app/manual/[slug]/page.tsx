import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MANUAL_MODULES } from '../manualData';
import styles from '../manual.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return MANUAL_MODULES.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const mod = MANUAL_MODULES.find((m) => m.slug === slug.toLowerCase());
  if (!mod) return { title: 'Módulo não encontrado — TS EYEWEAR' };

  return {
    title: `${mod.title} — Manual TS EYEWEAR`,
    description: mod.subtitle,
  };
}

export default async function ManualModulePage({ params }: Props) {
  const { slug } = await params;
  const mod = MANUAL_MODULES.find((m) => m.slug === slug.toLowerCase());

  if (!mod) {
    notFound();
  }

  const videoUrl = `/manual/${mod.slug}/${mod.videoFile}`;
  const pdfUrl = `/manual/${mod.slug}/${mod.pdfFile}`;
  const qrUrl = `/manual/${mod.slug}/qr-video.png`;

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.brandGroup}>
            <Link href="/" className={styles.brandLogo}>TS EYEWEAR</Link>
            <span className={styles.badge}>MANUAL ONLINE</span>
          </div>
          <Link href="/manual" className={styles.btnSecondary}>
            ← Ver Todos os Módulos
          </Link>
        </header>

        <h1 className={styles.title}>{mod.title}</h1>
        <p className={styles.subtitle}>{mod.subtitle}</p>

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
            Seu navegador não suporta a exibição direta deste vídeo. Utilize o link abaixo para download.
          </video>
        </div>

        {/* Action Buttons: PDF Download and Mobile QR Code */}
        <div className={styles.actions}>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={mod.pdfFile}
            className={styles.btnPrimary}
          >
            📄 Baixar Manual em PDF
          </a>

          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            download={mod.videoFile}
            className={styles.btnSecondary}
          >
            🎬 Baixar Arquivo de Vídeo (MP4)
          </a>

          <div className={styles.qrBox}>
            <img className={styles.qrImg} src={qrUrl} alt="QR Code para Celular" />
            <div>
              <div className={styles.qrTitle}>Assistir no Celular</div>
              <div className={styles.qrSub}>Aponte a câmera para abrir</div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Breakdown */}
        <div className={styles.stepsSection}>
          <h2 className={styles.stepsHeading}>
            📋 Passo a Passo Executado no Vídeo
          </h2>
          <div>
            {mod.steps.map((step) => (
              <div key={step.num} className={styles.stepItem}>
                <div className={styles.stepBadge}>{step.num}</div>
                <div>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepDesc}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

