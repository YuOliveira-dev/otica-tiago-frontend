'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { loginAdmin, verifyAdminSession } from '../../services/auth.service';
import styles from './adminLogin.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Se já possuir sessão válida confirmada pelo backend, redireciona ao Dashboard
  useEffect(() => {
    let isMounted = true;
    verifyAdminSession().then((isValid) => {
      if (!isMounted) return;
      if (isValid) {
        router.replace('/admin/dashboard');
      } else {
        setCheckingAuth(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    setIsLoading(true);

    try {
      await loginAdmin(email, senha);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className={styles.loginWrapper}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8' }}>
          <Loader2 size={24} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
          <span>Verificando credenciais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.loginCard}>
        <div className={styles.headerSection}>
          <div className={styles.logoBadge}>
            <img src="/logo.png" alt="TS EYEWEAR" className={styles.logoImg} />
          </div>
          <h1 className={styles.title}>Painel Administrativo</h1>
          <p className={styles.subtitle}>TS EYEWEAR • Gestão do Catálogo</p>
          <div className={styles.securityBadge}>
            <ShieldCheck size={14} />
            <span>Área Exclusiva</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {errorMessage && (
            <div className={styles.errorBox}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="admin-email">
              E-mail de Acesso
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} />
              <input
                id="admin-email"
                type="email"
                className={styles.input}
                placeholder="ex: seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="admin-password">
              Senha de Segurança
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.togglePassBtn}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span>Entrar no Painel</span>
              </>
            )}
          </button>
        </form>

        <div className={styles.footerActions}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Voltar para a Loja Pública</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
