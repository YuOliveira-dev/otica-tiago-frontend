'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Mail, Clock, ShieldCheck, Truck, RotateCcw, Ruler, Lock, HelpCircle, Glasses } from 'lucide-react';
import { WhatsAppIcon } from '../Icons';
import { generateWhatsAppLink } from '../../services/whatsapp';
import styles from './Footer.module.css';

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const pathname = usePathname();
  const whatsAppGeneralLink = generateWhatsAppLink({ type: 'inquiry' });

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          {/* Coluna 1: Sobre a Marca */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogo} style={{ textDecoration: 'none' }}>
              <img src="/logo.png" alt="TS EYEWEAR Logo" className={styles.brandLogoImg} />
              <span className={styles.brandName}>TS EYEWEAR</span>
            </Link>
            <p className={styles.brandDesc}>
              Há 5 anos transformando a forma como você vê o mundo. Especialistas em armações de grau e óculos de sol com lentes de alta tecnologia, proteção UV certificada e consultoria de estilo exclusiva.
            </p>
            <div className={styles.socials}>
              <a
                href="https://instagram.com/tseyewear"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialBtn}
                aria-label="Seguir no Instagram"
              >
                <InstagramIcon size={16} />
                <span>@tseyewear</span>
              </a>
            </div>
          </div>

          {/* Coluna 2: Categorias */}
          <div>
            <h4 className={styles.colTitle}>Categorias</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/catalogo?categoria=oculos-de-grau" className={styles.linkItem}>
                  Óculos de Grau
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=oculos-de-sol" className={styles.linkItem}>
                  Óculos de Sol
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=clip-on" className={styles.linkItem}>
                  Clip-On 2 em 1
                </Link>
              </li>
              <li>
                <Link href="/catalogo?ordenar=novidades" className={styles.linkItem}>
                  Lançamentos
                </Link>
              </li>
              <li>
                <Link href="/catalogo?categoria=outlet" className={styles.linkItem}>
                  Outlet Especial
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className={styles.linkItem}>
                  Ver Todo o Catálogo
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda e Políticas */}
          <div>
            <h4 className={styles.colTitle}>Ajuda & Institucional</h4>
            <ul className={styles.linkList}>
              <li>
                <Link href="/institucional#historia" className={styles.linkItem}>
                  Nossa História
                </Link>
              </li>
              <li>
                <Link href="/institucional#medidas" className={styles.linkItem}>
                  <Ruler size={14} />
                  Guia de Medidas
                </Link>
              </li>
              <li>
                <Link href="/institucional#frete" className={styles.linkItem}>
                  <Truck size={14} />
                  Frete Grátis Brasil
                </Link>
              </li>
              <li>
                <Link href="/institucional#garantias" className={styles.linkItem}>
                  <ShieldCheck size={14} />
                  Garantia de 90 Dias
                </Link>
              </li>
              <li>
                <Link href="/institucional#trocas" className={styles.linkItem}>
                  <RotateCcw size={14} />
                  Política de Trocas
                </Link>
              </li>
              <li>
                <Link href="/institucional#privacidade" className={styles.linkItem}>
                  <Lock size={14} />
                  Privacidade & LGPD
                </Link>
              </li>
              <li>
                <Link href="/institucional#faq" className={styles.linkItem}>
                  <HelpCircle size={14} />
                  Dúvidas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Atendimento Online */}
          <div>
            <h4 className={styles.colTitle}>Atendimento Online</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactRow}>
                <WhatsAppIcon size={18} style={{ color: 'var(--color-whatsapp)', marginTop: '2px' }} />
                <div>
                  <strong>WhatsApp Oficial:</strong>
                  <div>
                    <a
                      href={whatsAppGeneralLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      (11) 98772-9981
                    </a>
                  </div>
                </div>
              </div>
              <div className={styles.contactRow}>
                <Mail size={16} style={{ color: 'var(--color-accent-400)', marginTop: '2px' }} />
                <div>
                  <strong>E-mail de Suporte:</strong>
                  <div>
                    <a
                      href="mailto:tnoculos05.07@gmail.com"
                      className={styles.contactLink}
                    >
                      tnoculos05.07@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              <div className={styles.contactRow}>
                <Clock size={16} style={{ color: '#94A3B8', marginTop: '2px' }} />
                <div>
                  <strong>Horário de Atendimento:</strong>
                  <div>Segunda a Domingo e Feriados</div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna 5: Pagamento & Segurança */}
          <div>
            <h4 className={styles.colTitle}>Formas de Pagamento</h4>
            <p style={{ fontSize: '0.8125rem', marginBottom: '8px' }}>
              Pagamento à vista com desconto exclusivo via PIX ou transferência direta.
            </p>
            <div className={styles.paymentBadges}>
              <span className={styles.badgePill}>PIX à Vista</span>
              <span className={styles.badgePill}>Transferência Bancária</span>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#10B981' }}>
              <ShieldCheck size={16} />
              <span>Ambiente 100% Seguro com Certificado SSL</span>
            </div>
          </div>
        </div>

        {/* Faixa Inferior de Conformidade Legal (Decreto 7.962/2013) */}
        <div className={styles.bottomLegal}>
          <div className={styles.legalInfo}>
            <div>
              <strong>TS comércio de óculos e negócios Ltda</strong> | CNPJ: 50.879.437/0001-37
            </div>
            <div>
              Operação 100% Online • Envio Seguro via Correios para todo o Brasil *(Sem loja física presencial)*
            </div>
            <div className={styles.disclaimer}>
              A TS EYEWEAR orienta seus clientes a consultarem regularmente um médico oftalmologista para emissão e atualização de suas receitas visuais.
            </div>
          </div>
          <div>
            Copyright © {new Date().getFullYear()} TS EYEWEAR. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
