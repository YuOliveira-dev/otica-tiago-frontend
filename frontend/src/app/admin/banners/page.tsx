'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  PlusCircle,
  Edit2,
  Trash2,
  X,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sliders,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LayoutGrid,
  ChevronRight,
  Save,
  Check,
  Loader2,
} from 'lucide-react';
import {
  getBanners,
  saveBanner,
  deleteBanner,
  toggleBannerStatus,
} from '../../../services/banner.service';
import {
  getHomeCategoryCards,
  saveHomeCategoryCard,
  deleteHomeCategoryCard,
  toggleHomeCategoryCardStatus,
  getHomeCategorySectionConfig,
  saveHomeCategorySectionConfig,
  INITIAL_CATEGORY_SECTION_CONFIG,
} from '../../../services/home-categories.service';
import { Banner, HomeCategoryCard, HomeCategorySectionConfig } from '../../../types';
import { ActionModal, ActionModalType } from '../../../components/Admin/ActionModal';
import styles from './bannersAdmin.module.css';

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'categories'>('hero');

  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);
  const [togglingBannerId, setTogglingBannerId] = useState<string | null>(null);
  const [isSavingBanner, setIsSavingBanner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editBannerId, setEditBannerId] = useState<string | null>(null);

  const [actionModalConfig, setActionModalConfig] = useState<{
    isOpen: boolean;
    type: ActionModalType;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    message: '',
  });

  const closeActionModal = () => {
    setActionModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Banner Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('CONFERIR COLEÇÃO');
  const [ctaUrl, setCtaUrl] = useState('/catalogo');
  const [badgeTitle, setBadgeTitle] = useState('Excelência Óptica');
  const [badgeSub, setBadgeSub] = useState('5 Anos de Tradição');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Banner Media Upload Feedback
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeStr?: string } | null>(null);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // 2. STATE - CARDS DE CATEGORIAS (HOME)
  // ==========================================
  const [categoryCards, setCategoryCards] = useState<HomeCategoryCard[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [togglingCategoryId, setTogglingCategoryId] = useState<string | null>(null);
  const [isSavingCategoryCard, setIsSavingCategoryCard] = useState(false);

  const [sectionConfig, setSectionConfig] = useState<HomeCategorySectionConfig>(INITIAL_CATEGORY_SECTION_CONFIG);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configSuccessFeedback, setConfigSuccessFeedback] = useState(false);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editCatId, setEditCatId] = useState<string | null>(null);

  // Category Card Form Fields
  const [catTitle, setCatTitle] = useState('');
  const [catSub, setCatSub] = useState('');
  const [catLink, setCatLink] = useState('/catalogo');
  const [catImgUrl, setCatImgUrl] = useState('');
  const [catOrder, setCatOrder] = useState(1);
  const [catIsActive, setCatIsActive] = useState(true);

  // Category Media Upload Feedback
  const [catUploadError, setCatUploadError] = useState<string | null>(null);
  const [catUploadWarning, setCatUploadWarning] = useState<string | null>(null);
  const [catUploadSuccess, setCatUploadSuccess] = useState<string | null>(null);
  const [catImageMeta, setCatImageMeta] = useState<{ width: number; height: number; sizeStr?: string } | null>(null);
  const [catManualUrlInput, setCatManualUrlInput] = useState('');
  const [catIsDragging, setCatIsDragging] = useState(false);
  const catFileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================
  // INITIALIZATION & SCROLL LOCK
  // ==========================================
  useEffect(() => {
    loadAllData();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('newBanner') === '1') {
        openNewBannerModal();
      } else if (params.get('newCat') === '1') {
        setActiveTab('categories');
        openNewCategoryModal();
      }
    }
  }, []);

  // Trava o scroll da página de fundo quando qualquer modal estiver aberto
  useEffect(() => {
    if (isBannerModalOpen || isCatModalOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isBannerModalOpen, isCatModalOpen]);

  const loadAllData = async () => {
    await Promise.all([loadBanners(), loadCategories(), loadSectionConfig()]);
  };

  const loadBanners = async () => {
    try {
      const data = await getBanners();
      setBanners([...data]);
    } catch (err) {
      console.error('Erro ao buscar banners:', err);
    } finally {
      setIsLoadingBanners(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getHomeCategoryCards();
      setCategoryCards([...data]);
    } catch (err) {
      console.error('Erro ao buscar cards de categoria:', err);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadSectionConfig = async () => {
    try {
      const cfg = await getHomeCategorySectionConfig();
      if (cfg) setSectionConfig(cfg);
    } catch (err) {
      console.error('Erro ao buscar configuração da seção:', err);
    }
  };

  // ==========================================
  // BANNERS HERO HANDLERS
  // ==========================================
  const handleTabChange = async (tab: 'hero' | 'categories') => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === 'hero') {
      setIsLoadingBanners(true);
      await loadBanners();
    } else {
      setIsLoadingCategories(true);
      await Promise.all([loadCategories(), loadSectionConfig()]);
    }
  };

  const openNewBannerModal = () => {
    setEditBannerId(null);
    setTitle('');
    setSubtitle('');
    setCtaText('CONFERIR COLEÇÃO');
    setCtaUrl('/catalogo');
    setBadgeTitle('Excelência Óptica');
    setBadgeSub('5 Anos de Tradição');
    setImageUrl('https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1330&h=400&q=80');
    setOrder(banners.length + 1);
    setIsActive(true);
    setUploadError(null);
    setUploadWarning(null);
    setUploadSuccess(null);
    setImageMeta(null);
    setManualUrlInput('');
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (banner: Banner) => {
    setEditBannerId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setCtaText(banner.ctaText);
    setCtaUrl(banner.ctaUrl);
    setBadgeTitle(banner.badgeTitle || '');
    setBadgeSub(banner.badgeSub || '');
    setImageUrl(banner.imageUrl);
    setOrder(banner.order);
    setIsActive(banner.isActive);
    setUploadError(null);
    setUploadWarning(null);
    setUploadSuccess(null);
    setImageMeta(null);
    setManualUrlInput('');
    setIsBannerModalOpen(true);
  };

  const validateAndProcessBannerFile = (file: File) => {
    setUploadError(null);
    setUploadWarning(null);
    setUploadSuccess(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setUploadError(
        'Formato de arquivo inválido! O banner suporta exclusivamente imagens nos formatos WebP, PNG ou JPG.'
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setUploadError(
        `Arquivo muito pesado! O arquivo possui ${fileSizeMb} MB. O tamanho máximo permitido para banners é de ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setImageMeta({ width: w, height: h, sizeStr: `${fileSizeMb} MB` });

        const ratio = w / h;
        if (w < 900) {
          setUploadWarning(
            `Resolução baixa detectada (${w}×${h}px). Para garantir máxima nitidez no carrossel hero, recomendamos imagens com largura mínima de 1330px.`
          );
        } else if (ratio < 2.0 || ratio > 4.5) {
          setUploadWarning(
            `Atenção à proporção: A imagem possui ${w}×${h}px. O tamanho fixo padrão do banner hero é de 1330×400px. A imagem será recortada proporcionalmente no carrossel.`
          );
        } else {
          setUploadSuccess(
            `Imagem validada com sucesso! Resolução de ${w}×${h}px perfeitamente adequada ao padrão 1330×400.`
          );
        }

        setImageUrl(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyBannerManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    setUploadError(null);
    setUploadWarning(null);

    const testImg = new Image();
    testImg.onload = () => {
      setImageMeta({ width: testImg.naturalWidth, height: testImg.naturalHeight });
      setImageUrl(manualUrlInput.trim());
      setUploadSuccess('URL de imagem carregada e validada com sucesso!');
      setManualUrlInput('');
    };
    testImg.onerror = () => {
      setUploadError('Não foi possível carregar a imagem a partir da URL fornecida. Verifique o link.');
    };
    testImg.src = manualUrlInput.trim();
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setUploadError('Por favor, informe o título e forneça uma imagem para o banner.');
      return;
    }

    setIsSavingBanner(true);
    try {
      const newBanner: Banner = {
        id: editBannerId || `banner-${Date.now()}`,
        title: title.trim(),
        subtitle: subtitle.trim(),
        ctaText: ctaText.trim() || 'CONFERIR COLEÇÃO',
        ctaUrl: ctaUrl.trim() || '/catalogo',
        badgeTitle: badgeTitle.trim(),
        badgeSub: badgeSub.trim(),
        imageUrl: imageUrl.trim(),
        order: Number(order) || 1,
        isActive,
      };

      await saveBanner(newBanner);
      await loadBanners();
      setIsBannerModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar banner:', err);
      setUploadError('Falha ao salvar banner. Tente novamente.');
    } finally {
      setIsSavingBanner(false);
    }
  };

  const handleDeleteBanner = (id: string, bannerTitle: string) => {
    setActionModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Excluir Banner',
      message: `Tem certeza que deseja remover o banner "${bannerTitle}" do carrossel principal?`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteBanner(id);
          await loadBanners();
          closeActionModal();
        } catch (err) {
          console.error('Erro ao excluir banner:', err);
        } finally {
          setIsDeleting(false);
        }
      },
      onCancel: closeActionModal,
    });
  };

  const handleToggleBannerActive = async (id: string) => {
    if (togglingBannerId) return;
    setTogglingBannerId(id);
    try {
      await toggleBannerStatus(id);
      await loadBanners();
    } catch (err) {
      console.error('Erro ao alternar banner:', err);
    } finally {
      setTogglingBannerId(null);
    }
  };

  // ==========================================
  // SECTION TEXT CONFIG HANDLERS
  // ==========================================
  const handleSaveSectionConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await saveHomeCategorySectionConfig(sectionConfig);
      setConfigSuccessFeedback(true);
      setTimeout(() => setConfigSuccessFeedback(false), 3000);
    } catch (err) {
      console.error('Erro ao salvar configuração da seção:', err);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // ==========================================
  // CATEGORY CARDS HANDLERS
  // ==========================================
  const openNewCategoryModal = () => {
    setEditCatId(null);
    setCatTitle('');
    setCatSub('');
    setCatLink('/catalogo');
    setCatImgUrl('https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80');
    setCatOrder(categoryCards.length + 1);
    setCatIsActive(true);
    setCatUploadError(null);
    setCatUploadWarning(null);
    setCatUploadSuccess(null);
    setCatImageMeta(null);
    setCatManualUrlInput('');
    setIsCatModalOpen(true);
  };

  const openEditCategoryModal = (card: HomeCategoryCard) => {
    setEditCatId(card.id);
    setCatTitle(card.title);
    setCatSub(card.sub);
    setCatLink(card.link);
    setCatImgUrl(card.img);
    setCatOrder(card.order);
    setCatIsActive(card.isActive);
    setCatUploadError(null);
    setCatUploadWarning(null);
    setCatUploadSuccess(null);
    setCatImageMeta(null);
    setCatManualUrlInput('');
    setIsCatModalOpen(true);
  };

  // Validates category image format, size and dimensions (Standard: 800x500px, aspect ratio ~ 1.6:1)
  const validateAndProcessCategoryFile = (file: File) => {
    setCatUploadError(null);
    setCatUploadWarning(null);
    setCatUploadSuccess(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setCatUploadError(
        'Formato inválido! Os cards de vitrine aceitam exclusivamente imagens nos formatos WebP, PNG ou JPG.'
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setCatUploadError(
        `Arquivo muito pesado (${fileSizeMb} MB). O tamanho máximo para imagens de categoria é de ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        setCatImageMeta({ width: w, height: h, sizeStr: `${fileSizeMb} MB` });

        const ratio = w / h;
        if (w < 600) {
          setCatUploadWarning(
            `Resolução modesta (${w}×${h}px). Para máxima nitidez na vitrine, recomendamos resolução padrão de 800×500px.`
          );
        } else if (ratio < 1.1 || ratio > 2.2) {
          setCatUploadWarning(
            `Atenção à proporção (${w}×${h}px). O padrão ideal é 800×500 (~1.6:1). A imagem será ajustada proporcionalmente ao card de 240px de altura.`
          );
        } else {
          setCatUploadSuccess(
            `Imagem validada com sucesso! Resolução de ${w}×${h}px adequada ao padrão 800×500.`
          );
        }

        setCatImgUrl(result);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCategoryManualUrl = () => {
    if (!catManualUrlInput.trim()) return;
    setCatUploadError(null);
    setCatUploadWarning(null);

    const testImg = new Image();
    testImg.onload = () => {
      setCatImageMeta({ width: testImg.naturalWidth, height: testImg.naturalHeight });
      setCatImgUrl(catManualUrlInput.trim());
      setCatUploadSuccess('URL de imagem validada com sucesso!');
      setCatManualUrlInput('');
    };
    testImg.onerror = () => {
      setCatUploadError('Não foi possível carregar a imagem a partir da URL informada. Verifique o link.');
    };
    testImg.src = catManualUrlInput.trim();
  };

  const handleSaveCategoryCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTitle.trim() || !catImgUrl.trim()) {
      setCatUploadError('Por favor, informe o título e forneça uma imagem para o card.');
      return;
    }

    setIsSavingCategoryCard(true);
    try {
      const newCard: HomeCategoryCard = {
        id: editCatId || `cat-card-${Date.now()}`,
        title: catTitle.trim(),
        sub: catSub.trim(),
        link: catLink.trim() || '/catalogo',
        img: catImgUrl.trim(),
        order: Number(catOrder) || 1,
        isActive: catIsActive,
      };

      await saveHomeCategoryCard(newCard);
      await loadCategories();
      setIsCatModalOpen(false);
    } catch (err) {
      console.error('Erro ao salvar card de categoria:', err);
      setCatUploadError('Falha ao salvar card. Tente novamente.');
    } finally {
      setIsSavingCategoryCard(false);
    }
  };

  const handleDeleteCategoryCard = (id: string, cardTitle: string) => {
    setActionModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Excluir Card de Categoria',
      message: `Tem certeza que deseja remover o card de categoria "${cardTitle}" da vitrine?`,
      confirmText: 'Sim, Excluir',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteHomeCategoryCard(id);
          await loadCategories();
          closeActionModal();
        } catch (err) {
          console.error('Erro ao excluir card:', err);
        } finally {
          setIsDeleting(false);
        }
      },
      onCancel: closeActionModal,
    });
  };

  const handleToggleCategoryActive = async (id: string) => {
    if (togglingCategoryId) return;
    setTogglingCategoryId(id);
    try {
      await toggleHomeCategoryCardStatus(id);
      await loadCategories();
    } catch (err) {
      console.error('Erro ao alternar status do card de categoria:', err);
    } finally {
      setTogglingCategoryId(null);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h2>Banners & Vitrines da Home</h2>
          <p>
            Central de controle visual da página inicial: gerencie o carrossel hero e os cards da seção de categorias.
          </p>
        </div>

        {activeTab === 'hero' ? (
          <button type="button" onClick={openNewBannerModal} className={styles.btnNew}>
            <PlusCircle size={18} />
            Novo Banner Hero
          </button>
        ) : (
          <button type="button" onClick={openNewCategoryModal} className={styles.btnNew}>
            <PlusCircle size={18} />
            Novo Card de Categoria
          </button>
        )}
      </div>

      {/* Tabs Selector */}
      <div className={styles.tabsRow}>
        <button
          type="button"
          onClick={() => handleTabChange('hero')}
          className={`${styles.tabBtn} ${activeTab === 'hero' ? styles.tabBtnActive : ''}`}
        >
          <Sliders size={18} />
          <span>Banners Hero (Carrossel)</span>
          <span className={styles.tabBadge}>
            {isLoadingBanners ? <Loader2 size={12} className="animate-spin" /> : banners.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('categories')}
          className={`${styles.tabBtn} ${activeTab === 'categories' ? styles.tabBtnActive : ''}`}
        >
          <LayoutGrid size={18} />
          <span>Cards de Categorias (Home)</span>
          <span className={styles.tabBadge}>
            {isLoadingCategories ? <Loader2 size={12} className="animate-spin" /> : categoryCards.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ABA 1: BANNERS HERO (CARROSSEL PRINCIPAL 1330x400)                        */}
      {/* ========================================================================= */}
      {activeTab === 'hero' && (
        <>
          {/* Box de Padrões Técnicos Mandatórios */}
          <div className={styles.specsBox}>
            <div className={styles.specItem}>
              <ImageIcon size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Tamanho Fixo Exigido</div>
                <div className={styles.specItemValue}>1330 × 400 pixels</div>
              </div>
            </div>

            <div className={styles.specItem}>
              <UploadCloud size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Formatos Aceitos</div>
                <div className={styles.specItemValue}>WebP, PNG ou JPG</div>
              </div>
            </div>

            <div className={styles.specItem}>
              <AlertTriangle size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Tamanho Máximo</div>
                <div className={styles.specItemValue}>Até 5 MB por arquivo</div>
              </div>
            </div>

            <div className={styles.specItem}>
              <Sparkles size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Transição Carrossel</div>
                <div className={styles.specItemValue}>5 segundos (Automático)</div>
              </div>
            </div>
          </div>

          {/* Grid de Banners Cadastrados */}
          {isLoadingBanners ? (
            <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--color-text-muted)' }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-accent, #c5a96f)" />
              <span>Carregando banners do banco de dados...</span>
            </div>
          ) : banners.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Nenhum banner cadastrado. Clique em &quot;Novo Banner Hero&quot; para adicionar.
            </div>
          ) : (
            <div className={styles.bannersGrid}>
              {banners.map((banner) => (
                <div key={banner.id} className={styles.bannerCard}>
                  {/* Thumbnail Proporcional Fixa 1330x400 */}
                  <div className={styles.thumbnailWrapper}>
                    <img src={banner.imageUrl} alt={banner.title} className={styles.bannerThumb} />
                    <div className={styles.thumbOverlay}>
                      <div className={styles.thumbTitlePreview}>{banner.title}</div>
                    </div>

                    <span className={styles.orderBadge}>#{banner.order}</span>

                    <span
                      className={`${styles.statusPill} ${
                        banner.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {banner.isActive ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className={styles.bannerBody}>
                    <div>
                      <h3 className={styles.bannerTitle}>{banner.title}</h3>
                      <p className={styles.bannerSub}>{banner.subtitle}</p>

                      <div className={styles.metaRow}>
                        <span className={styles.ctaTag}>Botão: {banner.ctaText}</span>
                        <span className={styles.ctaTag}>Link: {banner.ctaUrl}</span>
                        {banner.badgeTitle && (
                          <span className={styles.ctaTag}>Selo: {banner.badgeTitle}</span>
                        )}
                      </div>
                    </div>

                    {/* Ações */}
                    <div className={styles.cardFooter}>
                      <button
                        type="button"
                        onClick={() => handleToggleBannerActive(banner.id)}
                        className={styles.toggleBtn}
                        title={banner.isActive ? 'Pausar exibição do banner' : 'Ativar banner no carrossel'}
                        disabled={togglingBannerId === banner.id}
                      >
                        {togglingBannerId === banner.id ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Loader2 size={14} className="animate-spin" /> Processando...
                          </span>
                        ) : banner.isActive ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <EyeOff size={14} /> Pausar
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={14} /> Ativar
                          </span>
                        )}
                      </button>

                      <div className={styles.actionsGroup}>
                        <button
                          type="button"
                          onClick={() => openEditBannerModal(banner)}
                          className={styles.iconBtn}
                          title="Editar Banner"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id, banner.title)}
                          className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                          title="Excluir Banner"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: CARDS DE CATEGORIAS (VITRINE DA HOME page-module___8aEwW__section)  */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <>
          {/* Card de Configuração dos Textos da Seção (Eyebrow, Título, Descrição) */}
          <form onSubmit={handleSaveSectionConfig} className={styles.sectionConfigBox}>
            <div className={styles.configHeader}>
              <div>
                <h3 className={styles.configTitle}>
                  <Sparkles size={18} color="var(--color-accent-600)" />
                  Textos da Seção de Categorias
                </h3>
                <p className={styles.configDesc}>
                  Edite a categoria/eyebrow, o título e o texto de apoio da seção exibida na página inicial.
                </p>
              </div>
              <button type="submit" disabled={isSavingConfig} className={styles.btnSaveConfig}>
                <Save size={16} />
                {isSavingConfig ? 'Salvando...' : 'Salvar Textos da Seção'}
              </button>
            </div>

            <div className={styles.configFormGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Eyebrow / Categoria da Seção</label>
                <input
                  type="text"
                  value={sectionConfig.eyebrow}
                  onChange={(e) => setSectionConfig({ ...sectionConfig, eyebrow: e.target.value })}
                  placeholder="Ex: Categorias em Destaque"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Título Principal da Seção</label>
                <input
                  type="text"
                  value={sectionConfig.title}
                  onChange={(e) => setSectionConfig({ ...sectionConfig, title: e.target.value })}
                  placeholder="Ex: Encontre Seu Estilo Ideal"
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descrição da Seção</label>
              <textarea
                value={sectionConfig.description}
                onChange={(e) => setSectionConfig({ ...sectionConfig, description: e.target.value })}
                placeholder="Ex: Do design clássico às armações ultraleves em titânio e acetato italiano..."
                className={styles.textarea}
                rows={2}
                required
              />
            </div>

            {configSuccessFeedback && (
              <div className={styles.configFeedback}>
                <Check size={16} />
                Textos da seção atualizados com sucesso e aplicados à Home Page!
              </div>
            )}
          </form>

          {/* Padrões Técnicos Mandatórios para Cards de Categorias */}
          <div className={styles.specsBox}>
            <div className={styles.specItem}>
              <ImageIcon size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Tamanho Padrão dos Cards</div>
                <div className={styles.specItemValue}>800 × 500 pixels (~1.6:1)</div>
              </div>
            </div>

            <div className={styles.specItem}>
              <UploadCloud size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Formatos Aceitos</div>
                <div className={styles.specItemValue}>WebP, PNG ou JPG</div>
              </div>
            </div>

            <div className={styles.specItem}>
              <AlertTriangle size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Tamanho Máximo</div>
                <div className={styles.specItemValue}>Até 5 MB por arquivo</div>
              </div>
            </div>

            <div className={styles.specItem}>
              <Sparkles size={22} className={styles.specIcon} />
              <div>
                <div className={styles.specItemTitle}>Altura no Layout</div>
                <div className={styles.specItemValue}>240px (Proporção Responsiva)</div>
              </div>
            </div>
          </div>

          {/* Grid de Cards de Categoria Cadastrados */}
          {isLoadingCategories ? (
            <div style={{ padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--color-text-muted)' }}>
              <Loader2 size={32} className="animate-spin" color="var(--color-accent, #c5a96f)" />
              <span>Carregando cards de categoria do banco de dados...</span>
            </div>
          ) : categoryCards.length === 0 ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Nenhum card de categoria cadastrado. Clique em &quot;Novo Card de Categoria&quot; para adicionar.
            </div>
          ) : (
            <div className={styles.bannersGrid}>
              {categoryCards.map((card) => (
                <div key={card.id} className={styles.bannerCard}>
                  {/* Thumbnail do Card idêntica ao design da Home */}
                  <div className={styles.catThumbnailWrapper}>
                    <img src={card.img} alt={card.title} className={styles.catThumbImg} />
                    <div className={styles.catThumbOverlay}>
                      <div className={styles.catThumbTitle}>{card.title}</div>
                      <div className={styles.catThumbSub}>
                        <span>{card.sub}</span>
                        <ChevronRight size={13} />
                      </div>
                    </div>

                    <span className={styles.orderBadge}>#{card.order}</span>

                    <span
                      className={`${styles.statusPill} ${
                        card.isActive ? styles.statusActive : styles.statusInactive
                      }`}
                    >
                      {card.isActive ? 'Ativo' : 'Pausado'}
                    </span>
                  </div>

                  {/* Informações */}
                  <div className={styles.bannerBody}>
                    <div>
                      <h3 className={styles.bannerTitle}>{card.title}</h3>
                      <p className={styles.bannerSub}>{card.sub}</p>

                      <div className={styles.metaRow}>
                        <span className={styles.ctaTag}>Link: {card.link}</span>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className={styles.cardFooter}>
                      <button
                        type="button"
                        onClick={() => handleToggleCategoryActive(card.id)}
                        className={styles.toggleBtn}
                        title={card.isActive ? 'Pausar exibição do card' : 'Ativar card na vitrine'}
                        disabled={togglingCategoryId === card.id}
                      >
                        {togglingCategoryId === card.id ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Loader2 size={14} className="animate-spin" /> Processando...
                          </span>
                        ) : card.isActive ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <EyeOff size={14} /> Pausar
                          </span>
                        ) : (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Eye size={14} /> Ativar
                          </span>
                        )}
                      </button>

                      <div className={styles.actionsGroup}>
                        <button
                          type="button"
                          onClick={() => openEditCategoryModal(card)}
                          className={styles.iconBtn}
                          title="Editar Card"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategoryCard(card.id, card.title)}
                          className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                          title="Excluir Card"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: BANNERS HERO (1330x400)                                          */}
      {/* ========================================================================= */}
      {isBannerModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsBannerModalOpen(false);
          }}
        >
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{editBannerId ? 'Editar Banner Hero' : 'Novo Banner Hero (1330×400)'}</h3>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className={styles.closeBtn}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Título Principal do Banner *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: SEU ESTILO FAZ A DIFERENÇA!"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subtítulo / Texto Promocional</label>
                  <textarea
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Ex: Escolha TS EYEWEAR e tenha armações nobres em acetato italiano..."
                    className={styles.textarea}
                    rows={2}
                  />
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Texto do Botão (CTA)</label>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="Ex: CONFERIR COLEÇÃO"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Link do Botão (CTA)</label>
                    <input
                      type="text"
                      value={ctaUrl}
                      onChange={(e) => setCtaUrl(e.target.value)}
                      placeholder="Ex: /catalogo ou https://..."
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Título do Selo de Excelência</label>
                    <input
                      type="text"
                      value={badgeTitle}
                      onChange={(e) => setBadgeTitle(e.target.value)}
                      placeholder="Ex: Excelência Óptica"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Subtítulo do Selo</label>
                    <input
                      type="text"
                      value={badgeSub}
                      onChange={(e) => setBadgeSub(e.target.value)}
                      placeholder="Ex: 5 Anos de Tradição"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ordem de Exibição no Carrossel</label>
                    <input
                      type="number"
                      min={1}
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '16px' }}>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Exibir este banner no carrossel (Ativo)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Upload e Tratamento de Imagem Hero */}
                <div className={styles.mediaUploadSection}>
                  <div className={styles.mediaSectionTitle}>
                    <ImageIcon size={18} />
                    <span>Imagem do Banner Hero (Padrão 1330 × 400px)</span>
                  </div>

                  <label
                    className={styles.dropzone}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) validateAndProcessBannerFile(file);
                    }}
                    style={{
                      borderColor: isDragging ? 'var(--color-accent-500)' : undefined,
                      backgroundColor: isDragging ? 'rgba(245, 158, 11, 0.08)' : undefined,
                    }}
                  >
                    <UploadCloud size={32} className={styles.dropzoneIcon} />
                    <div className={styles.dropzoneTitle}>
                      Arraste a imagem aqui ou clique para selecionar
                    </div>
                    <div className={styles.dropzoneSubtitle}>
                      Recomendado: 1330 × 400 pixels • Formatos WebP, PNG ou JPG • Até 5 MB
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".webp,.png,.jpg,.jpeg,image/webp,image/png,image/jpeg"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) validateAndProcessBannerFile(file);
                      }}
                    />
                  </label>

                  {/* Inserção de URL Alternativa */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      value={manualUrlInput}
                      onChange={(e) => setManualUrlInput(e.target.value)}
                      placeholder="Ou cole o link direto de uma imagem na web..."
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={handleApplyBannerManualUrl}
                      className={styles.btnCancel}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Validar URL
                    </button>
                  </div>

                  {uploadError && (
                    <div className={styles.alertError}>
                      <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {uploadWarning && (
                    <div className={styles.alertWarning}>
                      <Info size={18} style={{ flexShrink: 0 }} />
                      <span>{uploadWarning}</span>
                    </div>
                  )}

                  {uploadSuccess && (
                    <div className={styles.alertSuccess}>
                      <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                      <span>{uploadSuccess}</span>
                    </div>
                  )}

                  {imageUrl && (
                    <div className={styles.previewSection}>
                      <span className={styles.previewLabel}>Pré-visualização Fixa (1330×400):</span>
                      <div className={styles.previewBox}>
                        <img src={imageUrl} alt="Pré-visualização do Banner" className={styles.previewImage} />
                        {imageMeta && (
                          <span className={styles.previewInfoChip}>
                            {imageMeta.width} × {imageMeta.height} px
                            {imageMeta.sizeStr ? ` • ${imageMeta.sizeStr}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões do Modal */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSave} disabled={isSavingBanner}>
                  {isSavingBanner ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      <Loader2 size={16} className="animate-spin" /> Salvando...
                    </span>
                  ) : (
                    'Salvar Banner'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CARDS DE CATEGORIA (HOME 800x500 / 240px)                       */}
      {/* ========================================================================= */}
      {isCatModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCatModalOpen(false);
          }}
        >
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{editCatId ? 'Editar Card de Categoria' : 'Novo Card de Categoria (800×500)'}</h3>
              <button
                type="button"
                onClick={() => setIsCatModalOpen(false)}
                className={styles.closeBtn}
                aria-label="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategoryCard} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Título do Card de Categoria *</label>
                  <input
                    type="text"
                    value={catTitle}
                    onChange={(e) => setCatTitle(e.target.value)}
                    placeholder="Ex: Óculos de Grau"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Subtítulo / Descrição Curta</label>
                  <input
                    type="text"
                    value={catSub}
                    onChange={(e) => setCatSub(e.target.value)}
                    placeholder="Ex: Conforto e alta precisão óptica"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Link de Destino / Rota *</label>
                  <input
                    type="text"
                    value={catLink}
                    onChange={(e) => setCatLink(e.target.value)}
                    placeholder="Ex: /catalogo?categoria=oculos-de-grau"
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ordem de Exibição</label>
                    <input
                      type="number"
                      min={1}
                      value={catOrder}
                      onChange={(e) => setCatOrder(Number(e.target.value))}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup} style={{ justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '16px' }}>
                      <input
                        type="checkbox"
                        checked={catIsActive}
                        onChange={(e) => setCatIsActive(e.target.checked)}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        Exibir este card na vitrine (Ativo)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Upload e Tratamento de Imagem de Categoria (Padrão 800x500) */}
                <div className={styles.mediaUploadSection}>
                  <div className={styles.mediaSectionTitle}>
                    <ImageIcon size={18} />
                    <span>Imagem de Fundo do Card (Padrão 800 × 500px)</span>
                  </div>

                  <label
                    className={styles.dropzone}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setCatIsDragging(true);
                    }}
                    onDragLeave={() => setCatIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setCatIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) validateAndProcessCategoryFile(file);
                    }}
                    style={{
                      borderColor: catIsDragging ? 'var(--color-accent-500)' : undefined,
                      backgroundColor: catIsDragging ? 'rgba(245, 158, 11, 0.08)' : undefined,
                    }}
                  >
                    <UploadCloud size={32} className={styles.dropzoneIcon} />
                    <div className={styles.dropzoneTitle}>
                      Arraste a imagem aqui ou clique para selecionar
                    </div>
                    <div className={styles.dropzoneSubtitle}>
                      Padrão recomendado: 800 × 500 pixels (~1.6:1) • WebP, PNG ou JPG • Até 5 MB
                    </div>
                    <input
                      ref={catFileInputRef}
                      type="file"
                      accept=".webp,.png,.jpg,.jpeg,image/webp,image/png,image/jpeg"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) validateAndProcessCategoryFile(file);
                      }}
                    />
                  </label>

                  {/* Inserção de URL Alternativa */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="url"
                      value={catManualUrlInput}
                      onChange={(e) => setCatManualUrlInput(e.target.value)}
                      placeholder="Ou cole o link direto de uma imagem na web..."
                      className={styles.input}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCategoryManualUrl}
                      className={styles.btnCancel}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Validar URL
                    </button>
                  </div>

                  {catUploadError && (
                    <div className={styles.alertError}>
                      <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                      <span>{catUploadError}</span>
                    </div>
                  )}

                  {catUploadWarning && (
                    <div className={styles.alertWarning}>
                      <Info size={18} style={{ flexShrink: 0 }} />
                      <span>{catUploadWarning}</span>
                    </div>
                  )}

                  {catUploadSuccess && (
                    <div className={styles.alertSuccess}>
                      <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                      <span>{catUploadSuccess}</span>
                    </div>
                  )}

                  {catImgUrl && (
                    <div className={styles.previewSection}>
                      <span className={styles.previewLabel}>
                        Pré-visualização do Card na Vitrine (Proporção da Home):
                      </span>
                      <div className={styles.catPreviewBox}>
                        <img src={catImgUrl} alt="Pré-visualização do Card" className={styles.catThumbImg} />
                        <div className={styles.catThumbOverlay}>
                          <div className={styles.catThumbTitle}>{catTitle || 'Título do Card'}</div>
                          <div className={styles.catThumbSub}>
                            <span>{catSub || 'Subtítulo do card'}</span>
                            <ChevronRight size={13} />
                          </div>
                        </div>
                        {catImageMeta && (
                          <span className={styles.previewInfoChip}>
                            {catImageMeta.width} × {catImageMeta.height} px
                            {catImageMeta.sizeStr ? ` • ${catImageMeta.sizeStr}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Botões do Modal */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSave} disabled={isSavingCategoryCard}>
                  {isSavingCategoryCard ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                      <Loader2 size={16} className="animate-spin" /> Salvando...
                    </span>
                  ) : (
                    'Salvar Card'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Friendly Action Confirmation & Feedback Modal */}
      <ActionModal
        isOpen={actionModalConfig.isOpen}
        type={actionModalConfig.type}
        title={actionModalConfig.title}
        message={actionModalConfig.message}
        confirmText={actionModalConfig.confirmText}
        cancelText={actionModalConfig.cancelText}
        isLoading={isDeleting}
        onConfirm={actionModalConfig.onConfirm || closeActionModal}
        onCancel={actionModalConfig.onCancel || closeActionModal}
        onClose={closeActionModal}
      />
    </div>
  );
}
