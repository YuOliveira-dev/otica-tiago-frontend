import { Banner } from '../types';
import { getAdminToken, getAdminUser } from './auth.service';

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-1',
    title: 'SEU ESTILO FAZ A DIFERENÇA!',
    subtitle:
      'Escolha TS EYEWEAR e tenha armações nobres em acetato italiano e titânio com lentes de tecnologia óptica certificada e Frete Grátis.',
    ctaText: 'CONFERIR COLEÇÃO',
    ctaUrl: '/catalogo',
    badgeTitle: 'Excelência Óptica',
    badgeSub: '5 Anos de Tradição',
    imageUrl: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1330&h=400&q=80',
    order: 1,
    isActive: true,
  },
  {
    id: 'banner-2',
    title: 'CLIP-ON MAGNÉTICO 2 EM 1',
    subtitle:
      'Grau e Solar em apenas 1 segundo com fixação magnética de alta precisão. Lentes solares polarizadas com proteção total UV400.',
    ctaText: 'VER MODELOS CLIP-ON',
    ctaUrl: '/catalogo?categoria=clip-on',
    badgeTitle: 'Lentes Polarizadas',
    badgeSub: 'Proteção UV400 Certificada',
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1330&h=400&q=80',
    order: 2,
    isActive: true,
  },
  {
    id: 'banner-3',
    title: 'CONSULTORIA & LENTES DE GRAU',
    subtitle:
      'Envie sua receita médica direto pelo WhatsApp. Orientação especializada no melhor índice de refração para o seu grau sem sair de casa.',
    ctaText: 'FALAR COM CONSULTOR',
    ctaUrl:
      'https://wa.me/5511987729981?text=Ol%C3%A1%2C%20TS%20EYEWEAR!%20Gostaria%20de%20consultoria%20personalizada%20para%20minhas%20lentes%20de%20grau.',
    badgeTitle: 'Atendimento 100% Online',
    badgeSub: 'Suporte Óptico Especializado',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1330&h=400&q=80',
    order: 3,
    isActive: true,
  },
];

const getApiBaseUrl = () => {
  let url = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('banners:updated'));
  }
}

export async function getBanners(): Promise<Banner[]> {
  const baseUrl = getApiBaseUrl();
  const isAdmin = !!getAdminUser();

  try {
    const url = isAdmin ? `${baseUrl}/admin/banners` : `${baseUrl}/banners`;
    const res = await fetch(url, {
      headers: isAdmin ? getAuthHeaders() : { Accept: 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.sucesso && Array.isArray(data.dados)) {
        return data.dados;
      }
    }
  } catch (err) {
    console.warn('Falha ao buscar banners da API:', err);
  }

  return [];
}

export async function getActiveBanners(): Promise<Banner[]> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/banners`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.sucesso && Array.isArray(data.dados)) {
        return data.dados;
      }
    }
  } catch (err) {
    console.warn('Falha ao buscar banners ativos da vitrine:', err);
  }

  return [];
}

export async function getBannerById(id: string): Promise<Banner | null> {
  const all = await getBanners();
  return all.find((b) => b.id === id) || null;
}

export async function saveBanner(banner: Banner): Promise<Banner> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();
  const isEdit = banner.id && !banner.id.startsWith('new-');

  const url = isEdit
    ? `${baseUrl}/admin/banners/${banner.id}`
    : `${baseUrl}/admin/banners`;
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: JSON.stringify(banner),
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso && data.dados) {
    notifySubscribers();
    return data.dados;
  }

  throw new Error(data.erro || 'Falha ao salvar banner na API administrativa.');
}

export async function deleteBanner(id: string): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(`${baseUrl}/admin/banners/${id}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    notifySubscribers();
    return true;
  }

  throw new Error(data.erro || 'Falha ao excluir banner na API administrativa.');
}

export async function toggleBannerStatus(id: string): Promise<boolean> {
  const baseUrl = getApiBaseUrl();
  const headers = getAuthHeaders();

  const res = await fetch(`${baseUrl}/admin/banners/${id}/status`, {
    method: 'PATCH',
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));
  if (res.ok && data.sucesso) {
    notifySubscribers();
    return true;
  }

  throw new Error(data.erro || 'Falha ao alternar status do banner na API.');
}
