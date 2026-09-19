'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ShieldCheck,
} from 'lucide-react';
import styles from './adminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    if (pathname.includes('/admin/categorias')) return 'Gestão de Categorias';
    if (pathname.includes('/admin/banners')) return 'Gestão de Banners ';
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
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''
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
              <span className={styles.userName}>Administrador</span>
              <span className={styles.userRole}>admin@tseyewear.com.br</span>
            </div>
          </div>
          <Link
            href="/"
            className={styles.navItem}
            style={{ color: '#ef4444', padding: '0.4rem 0' }}
          >
            <LogOut size={16} />
            <span>Sair do Painel</span>
          </Link>
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
