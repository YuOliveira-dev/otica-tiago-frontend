import { Award, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import styles from './CardBeneficio.module.css';

const BENEFITS = [
  {
    icon: Award,
    title: '5 Anos de Tradição',
    desc: 'Expertise óptica com lentes de alta tecnologia e curadoria refinada de estilo.',
  },
  {
    icon: ShieldCheck,
    title: '100% Originalidade',
    desc: 'Produtos certificados de procedência garantida e garantia oficial de fábrica.',
  },
  {
    icon: Truck,
    title: 'Frete Grátis Brasil',
    desc: 'Envio seguro, ágil e rastreado para todas as regiões do Brasil sem valor mínimo.',
  },
  {
    icon: RotateCcw,
    title: 'Troca Fácil (30 Dias)',
    desc: 'Prazo estendido de 30 dias corridos para trocas e suporte pós-venda humanizado.',
  },
];

export function BenefitCard() {
  return (
    <section className={styles.beneficiosSection}>
      <div className="container">
        <div className={styles.grid}>
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={styles.card}>
                <div className={styles.iconBox}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.desc}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Backward compatibility export
export const CardBeneficio = BenefitCard;
