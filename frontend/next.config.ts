import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/manual/01-Login',
        destination: '/manual/01-login',
        permanent: true,
      },
      {
        source: '/manual/02-Dashboard',
        destination: '/manual/02-dashboard',
        permanent: true,
      },
      {
        source: '/manual/03-Produtos',
        destination: '/manual/03-produtos',
        permanent: true,
      },
      {
        source: '/manual/04-Novo-Produto',
        destination: '/manual/04-novo-produto',
        permanent: true,
      },
      {
        source: '/manual/05-Destaques',
        destination: '/manual/05-destaques',
        permanent: true,
      },
      {
        source: '/manual/06-Categorias',
        destination: '/manual/06-categorias',
        permanent: true,
      },
      {
        source: '/manual/07-Banners',
        destination: '/manual/07-banners',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
