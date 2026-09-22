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

let inMemoryToken: string | null = null;
let inMemoryAdmin: AdminUser | null = null;
let verificationInFlight: Promise<boolean> | null = null;

if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('ts_eyewear_admin_token');
    localStorage.removeItem('ts_eyewear_admin_user');
    sessionStorage.removeItem('ts_eyewear_admin_token');
    sessionStorage.removeItem('ts_eyewear_admin_user');
  } catch {}
}

const getApiBaseUrl = () => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

function notifyAuthChange(isAuthenticated: boolean) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('admin:auth-changed', {
        detail: { isAuthenticated, admin: inMemoryAdmin },
      })
    );
  }
}

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

  inMemoryToken = data.token || null;
  inMemoryAdmin = data.admin || null;
  notifyAuthChange(true);

  return data;
}

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

export function isAdminAuthenticated(): boolean {
  return !!(inMemoryToken && inMemoryAdmin);
}

export function getAdminUser(): AdminUser | null {
  return inMemoryAdmin;
}

export function getAdminToken(): string | null {
  return inMemoryToken;
}

export async function verifyAdminSession(force = false): Promise<boolean> {
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

export async function ensureAdminSession(): Promise<boolean> {
  return verifyAdminSession(true);
}

