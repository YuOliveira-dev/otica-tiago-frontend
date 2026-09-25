'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Sparkles } from 'lucide-react';
import { WhatsAppIcon } from '../Icons';
import { generateWhatsAppLink } from '../../services/whatsapp';
import styles from './WhatsAppFloat.module.css';

export function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const whatsAppLink = generateWhatsAppLink({ type: 'inquiry' });

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div className={styles.container}>
      {showTooltip && (
        <div className={styles.tooltip}>
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipTitle}>
              <Sparkles size={13} />
              <span>Consultor Online</span>
            </span>
            <button
              onClick={() => setShowTooltip(false)}
              className={styles.closeBtn}
              aria-label="Fechar mensagem"
            >
              <X size={14} />
            </button>
          </div>
          <p>
            Dúvidas sobre o tamanho ideal ou como enviar sua receita de grau?
            Fale com a nossa equipe agora!
          </p>
        </div>
      )}

      <a
        href={whatsAppLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.floatBtn}
        aria-label="Conversar com consultor no WhatsApp"
        title="Atendimento Consultivo TS EYEWEAR"
      >
        <WhatsAppIcon size={30} />
      </a>
    </div>
  );
}
