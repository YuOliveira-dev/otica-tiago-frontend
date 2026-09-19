import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { WhatsAppFloat } from '../components/WhatsAppFloat/WhatsAppFloat';

export const metadata: Metadata = {
  title: 'TS EYEWEAR | Catálogo Online - Óculos de Grau, Sol e Clip-On',
  description:
    'Há 5 anos transformando sua visão com muito estilo. Armações de alta tecnologia, lentes com proteção UV400 certificada e Frete Grátis para todo o Brasil.',
  keywords: [
    'óculos de grau',
    'óculos de sol',
    'armações',
    'clip-on magnético',
    'TS EYEWEAR',
    'ótica online',
    'frete grátis brasil',
  ],
  openGraph: {
    title: 'TS EYEWEAR | Sua Visão em Boas Mãos. Seu Estilo com Nitidez.',
    description:
      'Catálogo online oficial TS EYEWEAR. Produtos 100% originais com garantia, consultoria de estilo no WhatsApp e Frete Grátis para todo o Brasil.',
    url: 'https://tseyewear.com.br',
    siteName: 'TS EYEWEAR',
    locale: 'pt_BR',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'OnlineStore',
              name: 'TS EYEWEAR',
              legalName: 'TS comércio de óculos e negócios Ltda',
              url: 'https://tseyewear.com.br',
              logo: 'https://tseyewear.com.br/assets/brand/logo.svg',
              description:
                'Loja online especializada em armações de grau, óculos de sol e saúde visual com 5 anos de atuação.',
              email: 'tnoculos05.07@gmail.com',
              sameAs: ['https://instagram.com/tseyewear'],
              shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingRate: {
                  '@type': 'MonetaryAmount',
                  value: '0.00',
                  currency: 'BRL',
                },
                shippingDestination: {
                  '@type': 'DefinedRegion',
                  addressCountry: 'BR',
                },
              },
            }),
          }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <WhatsAppFloat />
        <Footer />
      </body>
    </html>
  );
}
