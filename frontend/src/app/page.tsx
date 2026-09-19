import Link from 'next/link';
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel/HeroCarousel';
import { HomeCategorias } from '../components/HomeCategorias/HomeCategorias';
import { ProductCard } from '../components/CardProduto/CardProduto';
import { BenefitCard } from '../components/CardBeneficio/CardBeneficio';
import { getFeaturedProducts } from '../services/catalog.service';
import { generateWhatsAppLink } from '../services/whatsapp';
import styles from './page.module.css';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  const whatsAppConsultantLink = generateWhatsAppLink({
    type: 'prescription',
    product: {
      title: 'Consultoria de Lentes de Grau',
      parentSku: 'CONSULTORIA-GRAU',
      price: 0,
    },
  });

  return (
    <>
      {/* 1. Hero Promotional Carousel */}
      <HeroCarousel />

      {/* 2. Institutional Benefits */}
      <BenefitCard />

      {/* 3. Category Navigation (Vitrine Dinâmica da Home) */}
      <HomeCategorias />

      {/* 4. Featured Products Showcase */}
      <section className={styles.section} style={{ backgroundColor: 'var(--color-bg-surface)' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>Seleção Exclusiva</span>
            <h2 className={styles.sectionTitle}>Modelos Mais Desejados</h2>
            <p className={styles.sectionDesc}>
              Armações 100% originais com garantia, medidas técnicas gravadas e{' '}
              <strong style={{ color: 'var(--color-success)' }}>Frete Grátis para todo o Brasil</strong>.
            </p>
          </div>

          <div className={styles.produtosGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href="/catalogo" className={styles.btnVerTodos}>
              <span>Ver Catálogo Completo</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Prescription Eyeglasses Callout */}
      <div className="container">
        <section className={styles.consultoriaBanner}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-400)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '12px' }}>
            <Sparkles size={16} />
            <span>Consultoria Óptica Digital</span>
          </div>
          <h2 className={styles.consultoriaTitle}>
            Dúvidas sobre o seu grau ou como enviar a receita?
          </h2>
          <p className={styles.consultoriaDesc}>
            Você não precisa se preocupar com códigos complicados. Nossos consultores ópticos avaliam a foto da sua prescrição médica, conferem sua DNP e indicam a armação e lente ideais com conforto absoluto.
          </p>
          <a
            href={whatsAppConsultantLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnWhatsAppLargo}
          >
            <MessageCircle size={22} />
            <span>Enviar Minha Receita no WhatsApp</span>
          </a>
        </section>
      </div>
    </>
  );
}
