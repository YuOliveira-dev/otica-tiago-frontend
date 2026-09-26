'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Glasses,
  PlusCircle,
  Tag,
  Sliders,
  ExternalLink,
  Menu,
  X,
  LogOut,
  Loader2,
  Sparkles,
} from 'lucide-react';
import {
  logoutAdmin,
  getAdminUser,
  verifyAdminSession,
} from '../../services/auth.service';
import styles from './adminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [adminUser, setAdminUser] = useState<{ nome: string; email: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthChecked(true);
      return;
    }

    let isMounted = true;

    verifyAdminSession().then((isValid) => {
      if (!isMounted) return;

      if (!isValid) {
        setIsAuthChecked(false);
        router.replace('/admin');
      } else {
        setAdminUser(getAdminUser());
        setIsAuthChecked(true);
      }
    });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isLoginPage]);

  // Se estiver na tela de login (/admin), renderiza diretamente o conteúdo sem sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Enquanto valida autenticação
  if (!isAuthChecked) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b0f17',
          color: '#94a3b8',
          gap: '0.75rem',
        }}
      >
        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span>Carregando painel administrativo...</span>
      </div>
    );
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
      router.replace('/admin');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Produtos',
      href: '/admin/produtos',
      icon: <Glasses size={18} />,
    },
    {
      label: 'Novo Produto',
      href: '/admin/produtos/novo',
      icon: <PlusCircle size={18} />,
    },
    {
      label: 'Mais Desejados',
      href: '/admin/destaques',
      icon: <Sparkles size={18} />,
    },
    {
      label: 'Categorias',
      href: '/admin/categorias',
      icon: <Tag size={18} />,
    },
    {
      label: 'Banners',
      href: '/admin/banners',
      icon: <Sliders size={18} />,
    },
  ];

  const getPageTitle = () => {
    if (pathname.includes('/admin/dashboard')) return 'Painel de Controle';
    if (pathname.includes('/admin/produtos/novo')) return 'Cadastrar Produto';
    if (pathname.includes('/admin/produtos')) return 'Catálogo de Produtos';
    if (pathname.includes('/admin/destaques')) return 'Modelos Mais Desejados (Home)';
    if (pathname.includes('/admin/categorias')) return 'Gestão de Categorias';
    if (pathname.includes('/admin/banners')) return 'Gestão de Banners';
    return 'Painel Administrativo';
  };

  return (
    <div className={styles.adminWrapper}>
      {/* Backdrop mobile */}
      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.brandArea}>
          <Link href="/admin/dashboard" className={styles.brandLink}>
            <img
              src="/logo.png"
              alt="TS EYEWEAR Logo"
              className={styles.brandLogoImg}
            />
            <div className={styles.brandTextGroup}>
              <span className={styles.brandLogo}>TS EYEWEAR</span>
              <span className={styles.brandTag}>ADMIN CONTROL</span>
            </div>
          </Link>
          {sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className={styles.closeSidebarBtn}
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className={styles.navSection}>
          <span className={styles.navLabel}>Gerenciamento</span>
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`${styles.navItem} ${
                  isActive ? styles.navItemActive : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}

          <span className={styles.navLabel} style={{ marginTop: '1.5rem' }}>
            Acesso Rápido
          </span>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkStore}
          >
            <ExternalLink size={16} />
            <span>Ver Loja Pública</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userBadge}>
            <div className={styles.avatar}>TS</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {adminUser?.nome || 'Administrador'}
              </span>
              <span className={styles.userRole}>
                {adminUser?.email || ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={styles.navItem}
            style={{
              color: '#ef4444',
              padding: '0.5rem 0',
              background: 'transparent',
              border: 'none',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              opacity: isLoggingOut ? 0.6 : 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              font: 'inherit',
            }}
          >
            {isLoggingOut ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
            <span>{isLoggingOut ? 'Saindo...' : 'Sair do Painel'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              type="button"
              className={styles.menuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir Menu"
            >
              <Menu size={24} />
            </button>
            <h1 className={styles.pageHeaderTitle}>{getPageTitle()}</h1>
          </div>

          <div className={styles.topBarRight}>
            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              <span>Catálogo Sincronizado</span>
            </div>
          </div>
        </header>

        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
