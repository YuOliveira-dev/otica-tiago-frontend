import React from 'react';
import Link from 'next/link';
import { MANUAL_MODULES } from './manualData';
import styles from './manual.module.css';

export const metadata = {
  title: 'Manual de Operação do Sistema — TS EYEWEAR',
  description: 'Documentação operacional completa com vídeos em alta definição e tutoriais passo a passo da TS EYEWEAR.',
};

export default function ManualHubPage() {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.brandGroup}>
            <Link href="/" className={styles.brandLogo}>TS EYEWEAR</Link>
            <span className={styles.badge}>Manual Operacional</span>
          </div>
          <Link href="/admin" className={styles.btnSecondary}>
            Ir para o Painel Admin →
          </Link>
        </header>

        <h1 className={styles.title}>Manual de Operação com Vídeos Práticos</h1>
        <p className={styles.subtitle}>
          Selecione qualquer módulo abaixo para assistir ao vídeo gravado em tela real com todas as operações e baixar a documentação oficial em PDF.
        </p>

        <div className={styles.actions} style={{ marginBottom: '28px' }}>
          <a
            href="/manual/Manual-Completo-TS-EYEWEAR.pdf"
            target="_blank"
            rel="noopener noreferrer"
            download="Manual-Completo-TS-EYEWEAR.pdf"
            className={styles.btnPrimary}
          >
            📕 Baixar Apostila Mestre Completa (PDF)
          </a>
        </div>

        <div className={styles.hubGrid}>
          {MANUAL_MODULES.map((m) => (
            <Link key={m.id} href={`/manual/${m.slug}`} className={styles.moduleCard}>
              <div>
                <div className={styles.cardTop}>
                  <span className={styles.cardNum}>MÓDULO {m.id}</span>
                  <span className={styles.cardDuration}>{m.duration} • Vídeo HD</span>
                </div>
                <h2 className={styles.cardTitle}>{m.title}</h2>
                <p className={styles.cardSub}>{m.subtitle}</p>
              </div>
              <div className={styles.cardAction}>
                ▶ Assistir Vídeo & Ver Manual →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

