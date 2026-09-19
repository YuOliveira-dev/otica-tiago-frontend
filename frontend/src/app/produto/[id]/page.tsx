import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getProductById, getFeaturedProducts } from '../../../services/catalog.service';
import { ProductCard } from '../../../components/CardProduto/CardProduto';
import { ProdutoDetalhesClient } from '@/components/ProdutoDetalhes/ProdutoDetalhesClient';
import styles from './produto.module.css';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) {
    return { title: 'Produto Não Encontrado | TS EYEWEAR' };
  }

  const title = product.title || product.titulo || '';
  const description = product.description || product.descricao || '';
  const effectivePrice = product.promotionalPrice || product.precoPromocional || product.price || product.precoVenda || 0;
  const mediaList = product.media || product.midias || [];

  return {
    title: `${title} | TS EYEWEAR`,
    description,
    openGraph: {
      title: `${title} - TS EYEWEAR`,
      description: `Armação 100% original por R$ ${effectivePrice.toFixed(2)}. Frete Grátis para todo o Brasil!`,
      images: [{ url: mediaList[0]?.url || '' }],
    },
  };
}

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const featured = await getFeaturedProducts();
  const relatedProducts = featured.filter((p) => p.id !== product.id).slice(0, 3);

  const categoryId = product.categoryId || product.categoriaId || '';
  const categoryName = product.categoryName || product.categoriaNome || '';
  const productTitle = product.title || product.titulo || '';

  return (
    <div className={`container ${styles.pageContainer}`}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação estrutural">
        <Link href="/">Início</Link>
        <ChevronRight size={14} />
        <Link href="/catalogo">Catálogo</Link>
        <ChevronRight size={14} />
        <Link href={`/catalogo?categoria=${categoryId}`}>{categoryName}</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--color-primary-950)', fontWeight: 600 }}>{productTitle}</span>
      </nav>

      {/* Interactive Product Details Client Component */}
      <ProdutoDetalhesClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-600)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Você também pode gostar
            </span>
            <h2 style={{ fontFamily: 'var(--font-family-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-950)', marginTop: '4px' }}>
              Modelos Semelhantes
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
