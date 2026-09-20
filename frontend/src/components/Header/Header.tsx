'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Heart, Search, Menu, X, ShieldCheck, Truck, ChevronRight } from 'lucide-react';
import { generateWhatsAppLink } from '../../services/whatsapp';
import { isAdminAuthenticated } from '../../services/auth.service';
import styles from './Header.module.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Listen to favorite count stored in localStorage
  useEffect(() => {
    const updateFavorites = () => {
      try {
        const saved = localStorage.getItem('ts_eyewear_favoritos');
        if (saved) {
          const ids = JSON.parse(saved);
          setTotalFavorites(Array.isArray(ids) ? ids.length : 0);
        } else {
          setTotalFavorites(0);
        }
      } catch {
        setTotalFavorites(0);
      }
    };

    updateFavorites();
    window.addEventListener('wishlist:updated', updateFavorites);
    window.addEventListener('storage', updateFavorites);

    // Listen to admin authentication status
    const updateAdminStatus = () => {
      setIsAdmin(isAdminAuthenticated());
    };
    updateAdminStatus();
    window.addEventListener('admin:auth-changed', updateAdminStatus);

    return () => {
      window.removeEventListener('wishlist:updated', updateFavorites);
      window.removeEventListener('storage', updateFavorites);
      window.removeEventListener('admin:auth-changed', updateAdminStatus);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const whatsAppHeaderLink = generateWhatsAppLink({ type: 'inquiry' });

  return (
    <>
      {/* Top Bar Oficial de Avisos */}
      <div className={styles.topbar}>
        <div className={`container ${styles.topbarContent}`}>
          <div className={styles.topbarHighlight}>
            <span className={styles.topbarBadge}>Exclusivo</span>
            <Truck size={14} />
            <span>Frete Grátis para todo o Brasil em todos os pedidos!</span>
          </div>
          <div>
            <a
              href={whatsAppHeaderLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.topbarLink}
            >
              <span>Atendimento Consultivo via WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header Principal */}
      <header className={styles.header}>
        <div className={`container ${styles.navContainer}`}>
          {/* Logo TS EYEWEAR */}
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="TS EYEWEAR Logo" className={styles.logoImg} />
            <div className={styles.logoText}>
              <span>TS EYEWEAR</span>
              <span className={styles.logoSub}>Ótica & Sol</span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className={styles.navMenu}>
            <Link
              href="/catalogo?categoria=oculos-de-grau"
              className={`${styles.navLink} ${
                pathname === '/catalogo' && typeof window !== 'undefined' && window.location.search.includes('grau')
                  ? styles.navLinkActive
                  : ''
              }`}
            >
              Óculos de Grau
            </Link>
            <Link
              href="/catalogo?categoria=oculos-de-sol"
              className={styles.navLink}
            >
              Óculos de Sol
            </Link>
            <Link
              href="/catalogo?categoria=clip-on"
              className={styles.navLink}
            >
              Clip-On
            </Link>
            <Link
              href="/catalogo?ordenar=novidades"
              className={styles.navLink}
            >
              Lançamentos
            </Link>
            <Link
              href="/catalogo?categoria=outlet"
              className={styles.navLink}
            >
              Outlet
            </Link>
            <Link
              href="/institucional"
              className={styles.navLink}
            >
              Quem Somos
            </Link>
          </nav>

          {/* Quick Search Box */}
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por modelo, cor ou estilo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </form>

          {/* Right Action Buttons */}
          <div className={styles.actions}>
            {/* Wishlist Button */}
            <Link
              href="/favoritos"
              className={styles.actionBtn}
              aria-label="Ver modelos favoritos"
            >
              <Heart size={20} />
              {totalFavorites > 0 && (
                <span className={styles.badge}>{totalFavorites}</span>
              )}
            </Link>

            {/* Admin Dashboard Link - Exibido apenas se o administrador estiver autenticado */}
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className={styles.adminBtn}
                title="Acessar Painel Administrativo"
              >
                <ShieldCheck size={16} />
                <span>Painel Admin</span>
              </Link>
            )}

            {/* Hamburger Mobile Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={styles.menuHamburger}
              aria-label="Abrir menu de navegação"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div
          className={styles.drawerOverlay}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={styles.drawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className={styles.drawerHeader}>
                <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
                  <img src="/logo.png" alt="TS EYEWEAR Logo" className={styles.logoImg} />
                  <div className={styles.logoText}>
                    <span>TS EYEWEAR</span>
                    <span className={styles.logoSub}>Ótica & Sol</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fechar menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Mobile Drawer Search */}
              <form onSubmit={handleSearch} style={{ marginTop: '16px' }}>
                <input
                  type="text"
                  placeholder="Buscar modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  style={{ width: '100%' }}
                />
              </form>

              {/* Category Links */}
              <nav className={styles.drawerLinks}>
                <Link
                  href="/catalogo?categoria=oculos-de-grau"
                  className={styles.drawerLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Óculos de Grau</span>
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/catalogo?categoria=oculos-de-sol"
                  className={styles.drawerLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Óculos de Sol</span>
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/catalogo?categoria=clip-on"
                  className={styles.drawerLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Clip-On Magnético</span>
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/catalogo?ordenar=novidades"
                  className={styles.drawerLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Lançamentos</span>
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/catalogo?categoria=outlet"
                  className={styles.drawerLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Outlet / Ofertas</span>
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/institucional"
                  className={styles.drawerLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Quem Somos (5 Anos)</span>
                  <ChevronRight size={18} />
                </Link>
                {/* Link do Painel Admin no menu mobile - Somente se logado */}
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className={styles.drawerLink}
                    onClick={() => setIsMenuOpen(false)}
                    style={{ color: 'var(--color-primary-500)' }}
                  >
                    <span>Acessar Painel Admin</span>
                    <ChevronRight size={18} />
                  </Link>
                )}
              </nav>
            </div>

            <div className={styles.drawerFooter}>
              <a
                href={whatsAppHeaderLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnWhatsAppMobile}
              >
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
