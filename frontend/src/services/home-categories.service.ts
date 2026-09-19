import { HomeCategoryCard, HomeCategorySectionConfig } from '../types';

export const INITIAL_CATEGORY_SECTION_CONFIG: HomeCategorySectionConfig = {
  eyebrow: 'Categorias em Destaque',
  title: 'Encontre Seu Estilo Ideal',
  description:
    'Do design clássico às armações ultraleves em titânio e acetato italiano. Navegue pelas nossas coleções exclusivas.',
};

export const INITIAL_CATEGORY_CARDS: HomeCategoryCard[] = [
  {
    id: 'cat-card-1',
    title: 'Óculos de Grau',
    sub: 'Conforto e alta precisão óptica',
    link: '/catalogo?categoria=oculos-de-grau',
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isActive: true,
  },
  {
    id: 'cat-card-2',
    title: 'Óculos de Sol',
    sub: 'Lentes polarizadas com proteção UV400',
    link: '/catalogo?categoria=oculos-de-sol',
    img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isActive: true,
  },
  {
    id: 'cat-card-3',
    title: 'Clip-On Magnético',
    sub: 'Grau e sol em uma só armação',
    link: '/catalogo?categoria=clip-on',
    img: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isActive: true,
  },
  {
    id: 'cat-card-4',
    title: 'Lançamentos 2026',
    sub: 'Tendências mundiais de eyewear',
    link: '/catalogo?ordenar=novidades',
    img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80',
    order: 4,
    isActive: true,
  },
  {
    id: 'cat-card-5',
    title: 'Outlet Especial',
    sub: 'Descontos de até 50% OFF',
    link: '/catalogo?categoria=outlet',
    img: 'https://images.unsplash.com/photo-1546180205-4eee9685a73e?auto=format&fit=crop&w=800&q=80',
    order: 5,
    isActive: true,
  },
  {
    id: 'cat-card-6',
    title: 'Consultoria de Estilo',
    sub: 'Encontre o óculos pro seu rosto',
    link: '/institucional#medidas',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    order: 6,
    isActive: true,
  },
];

const CARDS_STORAGE_KEY = 'ts_eyewear_home_category_cards';
const CONFIG_STORAGE_KEY = 'ts_eyewear_home_category_config';

function notifySubscribers() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('home_categories:updated'));
  }
}

/**
 * Returns section configuration (eyebrow, title, description)
 */
export async function getHomeCategorySectionConfig(): Promise<HomeCategorySectionConfig> {
  if (typeof window === 'undefined') {
    return INITIAL_CATEGORY_SECTION_CONFIG;
  }

  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORY_SECTION_CONFIG));
      return INITIAL_CATEGORY_SECTION_CONFIG;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler configuração da seção de categorias:', err);
    return INITIAL_CATEGORY_SECTION_CONFIG;
  }
}

/**
 * Saves section configuration (eyebrow, title, description)
 */
export async function saveHomeCategorySectionConfig(
  config: HomeCategorySectionConfig
): Promise<HomeCategorySectionConfig> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    notifySubscribers();
  }
  return config;
}

/**
 * Returns all category cards stored or defaults
 */
export async function getHomeCategoryCards(): Promise<HomeCategoryCard[]> {
  if (typeof window === 'undefined') {
    return INITIAL_CATEGORY_CARDS;
  }

  try {
    const raw = localStorage.getItem(CARDS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORY_CARDS));
      return INITIAL_CATEGORY_CARDS;
    }
    const parsed: HomeCategoryCard[] = JSON.parse(raw);
    return parsed.sort((a, b) => a.order - b.order);
  } catch (err) {
    console.error('Erro ao ler cards de categoria do localStorage:', err);
    return INITIAL_CATEGORY_CARDS;
  }
}

/**
 * Returns only active category cards sorted by order
 */
export async function getActiveHomeCategoryCards(): Promise<HomeCategoryCard[]> {
  const all = await getHomeCategoryCards();
  const active = all.filter((c) => c.isActive);
  return active.length > 0 ? active : INITIAL_CATEGORY_CARDS;
}

/**
 * Saves or updates a category card
 */
export async function saveHomeCategoryCard(card: HomeCategoryCard): Promise<HomeCategoryCard> {
  const all = await getHomeCategoryCards();
  const index = all.findIndex((c) => c.id === card.id);

  let updatedList: HomeCategoryCard[];
  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = { ...card };
  } else {
    updatedList = [...all, card];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedList));
    notifySubscribers();
  }

  return card;
}

/**
 * Deletes a category card by ID
 */
export async function deleteHomeCategoryCard(id: string): Promise<boolean> {
  const all = await getHomeCategoryCards();
  const filtered = all.filter((c) => c.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(filtered));
    notifySubscribers();
  }

  return true;
}

/**
 * Toggles a category card's active status
 */
export async function toggleHomeCategoryCardStatus(id: string): Promise<boolean> {
  const all = await getHomeCategoryCards();
  const card = all.find((c) => c.id === id);
  if (!card) return false;

  card.isActive = !card.isActive;
  if (typeof window !== 'undefined') {
    localStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(all));
    notifySubscribers();
  }
  return true;
}
