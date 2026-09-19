'use client';

import { X, HelpCircle } from 'lucide-react';
import styles from './ModalMedidas.module.css';

export interface MeasurementsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  lensWidth?: number;
  bridge?: number;
  temple?: number;

  // Legacy aliases
  aberto?: boolean;
  onFechar?: () => void;
  aro?: number;
  ponte?: number;
  haste?: number;
}

export function MeasurementsModal({
  isOpen,
  onClose,
  lensWidth = 52,
  bridge = 18,
  temple = 140,
  aberto,
  onFechar,
  aro,
  ponte,
  haste,
}: MeasurementsModalProps) {
  const activeIsOpen = isOpen ?? aberto ?? false;
  const handleClose = onClose || onFechar || (() => {});
  const activeLensWidth = lensWidth ?? aro ?? 52;
  const activeBridge = bridge ?? ponte ?? 18;
  const activeTemple = temple ?? haste ?? 140;

  if (!activeIsOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="var(--color-primary-500)" />
            <h3 className={styles.title}>Guia de Medidas da Armação</h3>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeBtn}
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Caixa de Diagrama e Inscrição */}
          <div className={styles.diagramBox}>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Na haste interna do seu óculos atual existe uma numeração gravada:
            </p>
            <div className={styles.diagramInscricao}>
              {activeLensWidth} ◽ {activeBridge} &nbsp; {activeTemple}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
              Exemplo gravado na haste: Largura do Aro ◽ Ponte Nasal &nbsp; Comprimento da Haste
            </p>
          </div>

          {/* Cards com as 3 Dimensões */}
          <div className={styles.gridMedidas}>
            <div className={styles.cardMedida}>
              <div className={styles.medidaValor}>{activeLensWidth} mm</div>
              <div className={styles.medidaNome}>Aro (Largura)</div>
              <div className={styles.medidaDesc}>
                Largura horizontal de cada lente. Determina se o óculos é tamanho P (até 50mm), M (51 a 54mm) ou G (acima de 55mm).
              </div>
            </div>

            <div className={styles.cardMedida}>
              <div className={styles.medidaValor}>{activeBridge} mm</div>
              <div className={styles.medidaNome}>Ponte Nasal</div>
              <div className={styles.medidaDesc}>
                Distância entre as duas lentes sobre o dorso do nariz. Crucial para o apoio e conforto sem marcas.
              </div>
            </div>

            <div className={styles.cardMedida}>
              <div className={styles.medidaValor}>{activeTemple} mm</div>
              <div className={styles.medidaNome}>Haste Total</div>
              <div className={styles.medidaDesc}>
                Comprimento total da haste da frente até a curvatura atrás da orelha (padrão entre 135 e 145mm).
              </div>
            </div>
          </div>

          {/* Dica da TS EYEWEAR */}
          <div className={styles.tipsBox}>
            <strong>💡 Dica do Consultor TS EYEWEAR:</strong>
            <p style={{ marginTop: '4px' }}>
              Pegue um óculos que você já usa e confira a gravação na parte interna de uma das hastes. Se as medidas forem parecidas (variação de 1 a 2mm), este modelo vestirá perfeitamente no seu rosto!
            </p>
          </div>

          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--color-primary-900)',
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Entendi, Voltar para o Produto
          </button>
        </div>
      </div>
    </div>
  );
}

// Backward compatibility export
export const ModalMedidas = MeasurementsModal;
export type ModalMedidasProps = MeasurementsModalProps;
