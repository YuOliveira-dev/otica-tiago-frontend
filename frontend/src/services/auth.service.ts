/**
 * Serviço de Autenticação Administrativa - TS EYEWEAR
 * 
 * Diretrizes de Segurança (OWASP):
 * 1. Tokens de acesso NUNCA são gravados no localStorage ou sessionStorage (mitigação contra XSS).
 * 2. Token e dados de sessão são mantidos estritamente em memória do serviço durante a navegação.
 * 3. A sessão persistente exclusiva é mantida pelo Cookie HttpOnly emitido e deletado pelo backend.
 * 4. A cada decisão ou navegação no site, o serviço valida a autenticidade da sessão diretamente
 *    contra o backend (/api/admin/auth/me). Não existem fallbacks ou dados mockados no código.
 */

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

// Estado estritamente em memória (NÃO persistido em storage local)
let inMemoryToken: string | null = null;
let inMemoryAdmin: AdminUser | null = null;
let verificationInFlight: Promise<boolean> | null = null;

// Higienização de segurança: remove qualquer resquício legado no storage local do navegador
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('ts_eyewear_admin_token');
    localStorage.removeItem('ts_eyewear_admin_user');
    sessionStorage.removeItem('ts_eyewear_admin_token');
    sessionStorage.removeItem('ts_eyewear_admin_user');
  } catch {
    // Ignora restrições de sandbox
  }
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
 * Notifica a aplicação sobre mudança no estado de autenticação
 */
function notifyAuthChange(isAuthenticated: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('admin:auth-changed', {
        detail: { isAuthenticated, admin: inMemoryAdmin },
      })
    );
  }
}

/**
 * Realiza login do administrador exclusivamente contra a API do backend.
 * Sem credenciais hardcoded e sem fallbacks mockados.
 */
export async function loginAdmin(email: string, senha: string): Promise<LoginResponse> {
  const baseUrl = getApiBaseUrl();

  const res = await fetch(`${baseUrl}/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email: email.trim(), senha }),
  });

  const contentType = res.headers.get('content-type') || '';
  let data: any = {};

  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    throw new Error(
      'Falha na comunicação com o servidor de autenticação. Verifique se o backend está online.'
    );
  }

  if (!res.ok || !data.sucesso) {
    throw new Error(data.erro || 'E-mail ou senha incorretos.');
  }

  // Armazena sessão exclusivamente em memória
  inMemoryToken = data.token || null;
  inMemoryAdmin = data.admin || null;
  notifyAuthChange(true);

  return data;
}

/**
 * Encerra a sessão do administrador:
 * Notifica o backend para deletar a sessão exclusiva no banco e limpa a memória local.
 */
export async function logoutAdmin(): Promise<void> {
  const baseUrl = getApiBaseUrl();

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (inMemoryToken) {
      headers['Authorization'] = `Bearer ${inMemoryToken}`;
    }

    await fetch(`${baseUrl}/admin/auth/logout`, {
      method: 'POST',
      headers,
      credentials: 'include',
    }).catch(() => {});
  } finally {
    inMemoryToken = null;
    inMemoryAdmin = null;
    verificationInFlight = null;

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('ts_eyewear_admin_token');
        localStorage.removeItem('ts_eyewear_admin_user');
      } catch {}
      notifyAuthChange(false);
    }
  }
}

/**
 * Retorna se o administrador está com sessão ativa em memória
 */
export function isAdminAuthenticated(): boolean {
  return !!(inMemoryToken && inMemoryAdmin);
}

/**
 * Retorna os dados do administrador logado a partir da memória
 */
export function getAdminUser(): AdminUser | null {
  return inMemoryAdmin;
}

/**
 * Retorna o token JWT em memória (nunca de storage)
 */
export function getAdminToken(): string | null {
  return inMemoryToken;
}

/**
 * Valida a sessão administrativa diretamente contra o backend (/admin/auth/me).
 * Bate o token/cookie com a sessão salva no banco de dados.
 * Não utiliza fallbacks - se a API recusar ou estiver offline, a sessão é considerada inválida.
 */
export async function verifyAdminSession(force = false): Promise<boolean> {
  // Deduplicação de requisições concorrentes
  if (verificationInFlight && !force) {
    return verificationInFlight;
  }

  const baseUrl = getApiBaseUrl();

  const verifyPromise = (async () => {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/json',
      };
      if (inMemoryToken) {
        headers['Authorization'] = `Bearer ${inMemoryToken}`;
      }

      const res = await fetch(`${baseUrl}/admin/auth/me`, {
        method: 'GET',
        headers,
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        inMemoryToken = null;
        inMemoryAdmin = null;
        notifyAuthChange(false);
        return false;
      }

      const data = await res.json();
      if (data.sucesso && data.admin) {
        inMemoryAdmin = data.admin;
        if (data.token) {
          inMemoryToken = data.token;
        }
        notifyAuthChange(true);
        return true;
      }

      inMemoryToken = null;
      inMemoryAdmin = null;
      notifyAuthChange(false);
      return false;
    } catch {
      inMemoryToken = null;
      inMemoryAdmin = null;
      notifyAuthChange(false);
      return false;
    } finally {
      verificationInFlight = null;
    }
  })();

  verificationInFlight = verifyPromise;
  return verifyPromise;
}

/**
 * Assegura sessão ativa válida antes de executar uma decisão ou mutação no site.
 */
export async function ensureAdminSession(): Promise<boolean> {
  return verifyAdminSession(true);
}
