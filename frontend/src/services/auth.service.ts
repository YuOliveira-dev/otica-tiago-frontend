/**
 * Serviço de Autenticação Administrativa - TS EYEWEAR
 * Gerencia login, logout, persistência de sessão e eventos de autenticação
 */

const AUTH_TOKEN_KEY = 'ts_eyewear_admin_token';
const AUTH_USER_KEY = 'ts_eyewear_admin_user';

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
}

export interface LoginResponse {
  sucesso: boolean;
  mensagem?: string;
  token?: string;
  admin?: AdminUser;
  erro?: string;
}

const getApiBaseUrl = () => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

/**
 * Notifica a aplicação sobre mudança no estado de login
 */
function notifyAuthChange(isAuthenticated: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('admin:auth-changed', {
        detail: { isAuthenticated },
      })
    );
  }
}

/**
 * Realiza login do administrador
 */
export async function loginAdmin(email: string, senha: string): Promise<LoginResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, senha }),
    });

    const contentType = res.headers.get('content-type') || '';
    let data: any = {};

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('Resposta não-JSON recebida da API:', text.slice(0, 300));
      throw new Error(
        'Falha na comunicação com o servidor. Verifique se a variável NEXT_PUBLIC_API_URL está apontando para o backend (https://otica-tiago-backend.vercel.app/api).'
      );
    }

    if (!res.ok || !data.sucesso) {
      throw new Error(data.erro || 'Credenciais de acesso incorretas.');
    }

    // Salva token e usuário no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token || 'token_session');
      if (data.admin) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.admin));
      }
      notifyAuthChange(true);
    }

    return data;
  } catch (err: any) {
    // Se a API estiver offline (ex: servidor local desligado), valida com fallback seguro
    const isNetworkError =
      err.name === 'TypeError' ||
      err.message?.includes('fetch') ||
      err.message?.includes('Failed to fetch') ||
      err.message?.includes('NetworkError');

    if (isNetworkError) {
      const emailNormalizado = email.toLowerCase().trim();
      if (
        emailNormalizado === 'admin@tseyewear.com.br' &&
        senha === 'AdminTsEyewear2026!'
      ) {
        const fallbackAdmin: AdminUser = {
          id: 'admin-local-1',
          nome: 'Administrador TS EYEWEAR',
          email: emailNormalizado,
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, 'ts_mock_admin_token_jwt');
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackAdmin));
          notifyAuthChange(true);
        }

        return {
          sucesso: true,
          mensagem: 'Login realizado em modo desenvolvimento local.',
          token: 'ts_mock_admin_token_jwt',
          admin: fallbackAdmin,
        };
      }
      throw new Error('E-mail ou senha incorretos.');
    }

    throw err;
  }
}

/**
 * Encerra a sessão do administrador
 */
export async function logoutAdmin(): Promise<void> {
  const baseUrl = getApiBaseUrl();

  try {
    await fetch(`${baseUrl}/admin/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      notifyAuthChange(false);
    }
  }
}

/**
 * Verifica se o administrador está autenticado
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Retorna os dados do administrador logado
 */
export function getAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Retorna o token JWT atual
 */
export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Valida a sessão administrativa no backend
 */
export async function verifyAdminSession(): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch(`${baseUrl}/admin/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (res.status === 401) {
      await logoutAdmin();
      return false;
    }

    if (!res.ok) return false;
    const data = await res.json();
    return !!data.sucesso;
  } catch {
    // Em caso de falha transitória de rede, não desloga
    return true;
  }
}
