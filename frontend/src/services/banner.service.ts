import { Banner } from '../types';

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
      'https://wa.me/5584996160968?text=Ol%C3%A1%2C%20TS%20EYEWEAR!%20Gostaria%20de%20consultoria%20personalizada%20para%20minhas%20lentes%20de%20grau.',
    badgeTitle: 'Atendimento 100% Online',
    badgeSub: 'Suporte Óptico Especializado',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1330&h=400&q=80',
    order: 3,
    isActive: true,
  },
];

const STORAGE_KEY = 'ts_eyewear_banners';

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('banners:updated'));
  }
}

/**
 * Returns all banners stored or defaults
 */
export async function getBanners(): Promise<Banner[]> {
  if (typeof window === 'undefined') {
    return INITIAL_BANNERS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BANNERS));
      return INITIAL_BANNERS;
    }
    const parsed: Banner[] = JSON.parse(raw);
    return parsed.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error('Erro ao ler banners do localStorage:', err);
    return INITIAL_BANNERS;
  }
}

/**
 * Returns only active banners sorted by display order
 */
export async function getActiveBanners(): Promise<Banner[]> {
  const all = await getBanners();
  const active = all.filter((b) => b.isActive);
  return active.length > 0 ? active : INITIAL_BANNERS;
}

/**
 * Retrieves a banner by its ID
 */
export async function getBannerById(id: string): Promise<Banner | null> {
  const all = await getBanners();
  return all.find((b) => b.id === id) || null;
}

/**
 * Creates or updates a banner
 */
export async function saveBanner(banner: Banner): Promise<Banner> {
  const all = await getBanners();
  const index = all.findIndex((b) => b.id === banner.id);

  let updatedList: Banner[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = { ...banner };
  } else {
    updatedList = [...all, banner];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    notifySubscribers();
  }

  return banner;
}

/**
 * Deletes a banner by its ID
 */
export async function deleteBanner(id: string): Promise<boolean> {
  const all = await getBanners();
  const filtered = all.filter((b) => b.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    notifySubscribers();
  }

  return true;
}

/**
 * Toggles a banner's active status
 */
export async function toggleBannerStatus(id: string): Promise<boolean> {
  const all = await getBanners();
  const banner = all.find((b) => b.id === id);
  if (!banner) return false;

  banner.isActive = !banner.isActive;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    notifySubscribers();
  }
  return true;
}
