'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  UploadCloud,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  Plus,
  Video,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import {
  getCategories,
  getProductById,
  saveAdminProduct,
} from '../../../../services/catalog.service';
import {
  Product,
  Category,
  ProductMedia,
  ProductVariation,
  ProductStatus,
} from '../../../../types';
import { ActionModal, ActionModalType } from '../../../../components/Admin/ActionModal';
import styles from './adminForm.module.css';

function ProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Friendly Action Modal State
  const [modalConfig, setModalConfig] = useState<{
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

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Basic Information
  const [id, setId] = useState<string>('');
  const [parentSku, setParentSku] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [shape, setShape] = useState<string>('Redondo');
  const [gender, setGender] = useState<'feminino' | 'masculino' | 'unissex' | 'infantil'>('unissex');

  // Pricing
  const [price, setPrice] = useState<number>(349.9);
  const [promotionalPrice, setPromotionalPrice] = useState<number | undefined>(undefined);

  // Highlights
  const [featuredHome, setFeaturedHome] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [isOutlet, setIsOutlet] = useState<boolean>(false);

  // Visibility
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');

  // Media
  const [mediaList, setMediaList] = useState<ProductMedia[]>([]);
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');

  // Variations (Colors, Measurements, Stock)
  const [variations, setVariations] = useState<ProductVariation[]>([
    {
      id: 'var-1',
      skuVariation: '',
      colorName: 'Tartaruga Havana',
      colorHex: '#8B4513',
      lensWidthMm: 52,
      bridgeMm: 19,
      templeMm: 142,
      material: 'Acetato Italiano',
      stock: 5,
      isActive: true,
    },
  ]);

  // Load categories and existing product if editing
  useEffect(() => {
    async function loadData() {
      try {
        const cats = await getCategories();
        setCategories(cats);
        if (cats.length > 0 && !categoryId) {
          setCategoryId(cats[0].id);
        }

        if (editId) {
          const existingProduct = await getProductById(editId);
          if (existingProduct) {
            setId(existingProduct.id);
            setParentSku(existingProduct.parentSku || existingProduct.skuPai || '');
            setTitle(existingProduct.title || existingProduct.titulo || '');
            setSlug(existingProduct.slug);
            setDescription(existingProduct.description || existingProduct.descricao || '');
            setCategoryId(existingProduct.categoryId || existingProduct.categoriaId || '');
            setSubcategoryId(existingProduct.subcategoryId || existingProduct.subcategoriaId || '');
            setShape(existingProduct.shape || existingProduct.formato || 'Redondo');

            const g = existingProduct.gender || existingProduct.genero;
            if (g === 'feminino' || g === 'masculino' || g === 'unissex' || g === 'infantil') {
              setGender(g);
            }

            setPrice(existingProduct.price ?? existingProduct.precoVenda ?? 0);
            setPromotionalPrice(existingProduct.promotionalPrice ?? existingProduct.precoPromocional);
            setFeaturedHome(!!(existingProduct.featuredHome || existingProduct.destaqueHome));
            setIsNew(!!(existingProduct.isNew || existingProduct.novidade));
            setIsOutlet(!!(existingProduct.isOutlet || existingProduct.outlet));
            setStatus(existingProduct.status);

            const prodsMedia = existingProduct.media || existingProduct.midias || [];
            setMediaList(
              prodsMedia.map((m) => ({
                id: m.id,
                url: m.url,
                type: m.type || m.tipo || 'IMAGE',
                order: m.order ?? m.ordem ?? 1,
                isPrimary: !!(m.isPrimary || m.principal),
                variationId: m.variationId,
              }))
            );

            const prodsVars = existingProduct.variations || existingProduct.variacoes || [];
            setVariations(
              prodsVars.map((v) => ({
                id: v.id,
                skuVariation: v.skuVariation || v.skuVariacao || '',
                colorName: v.colorName || v.corNome || '',
                colorHex: v.colorHex || v.corHex,
                lensWidthMm: v.lensWidthMm ?? v.aroMm ?? 52,
                bridgeMm: v.bridgeMm ?? v.ponteMm ?? 18,
                templeMm: v.templeMm ?? v.hasteMm ?? 140,
                material: v.material || 'Acetato Italiano',
                stock: v.stock ?? v.estoqueAtual ?? 0,
                isActive: v.isActive ?? v.statusAtivo ?? true,
                customPrice: v.customPrice ?? v.precoDiferenciado,
              }))
            );
          }
        } else {
          // Generate provisional parent SKU
          const randomSku = `TS-${Math.floor(1000 + Math.random() * 9000)}`;
          setParentSku(randomSku);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do formulário:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [editId]);

  // Automatically update slug on title input
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!editId) {
      const autoSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  // Subcategories available for selected category
  const availableSubcategories =
    categories.find((c) => c.id === categoryId)?.subcategories || [];

  // File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newMediaItems: ProductMedia[] = [];

    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith('video');
      const url = URL.createObjectURL(file);
      const isFirst = mediaList.length === 0 && index === 0;

      newMediaItems.push({
        id: `media-${Date.now()}-${index}`,
        url,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        order: mediaList.length + index + 1,
        isPrimary: isFirst,
      });
    });

    setMediaList((prev) => [...prev, ...newMediaItems]);
  };

  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    const newMedia: ProductMedia = {
      id: `video-${Date.now()}`,
      url: videoUrlInput.trim(),
      type: 'VIDEO',
      order: mediaList.length + 1,
      isPrimary: false,
    };
    setMediaList((prev) => [...prev, newMedia]);
    setVideoUrlInput('');
  };

  const setPrimaryMedia = (index: number) => {
    setMediaList((prev) =>
      prev.map((m, i) => ({
        ...m,
        isPrimary: i === index,
        principal: i === index,
      }))
    );
  };

  const moveMedia = (index: number, direction: 'left' | 'right') => {
    const newArray = [...mediaList];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newArray.length) return;

    const temp = newArray[index];
    newArray[index] = newArray[targetIndex];
    newArray[targetIndex] = temp;

    // Update order
    const updated = newArray.map((m, i) => ({ ...m, order: i + 1, ordem: i + 1 }));
    setMediaList(updated);
  };

  const removeMedia = (index: number) => {
    const filtered = mediaList.filter((_, i) => i !== index);
    if (filtered.length > 0 && !filtered.some((m) => m.isPrimary)) {
      filtered[0].isPrimary = true;
      filtered[0].principal = true;
    }
    setMediaList(filtered.map((m, i) => ({ ...m, order: i + 1, ordem: i + 1 })));
  };

  // Variations Management
  const addVariation = () => {
    const newVar: ProductVariation = {
      id: `var-${Date.now()}`,
      skuVariation: `${parentSku}-VAR${variations.length + 1}`,
      colorName: 'Nova Cor',
      colorHex: '#000000',
      lensWidthMm: variations[0]?.lensWidthMm || 52,
      bridgeMm: variations[0]?.bridgeMm || 19,
      templeMm: variations[0]?.templeMm || 142,
      material: variations[0]?.material || 'Acetato Italiano',
      stock: 3,
      isActive: true,
    };
    setVariations((prev) => [...prev, newVar]);
  };

  const updateVariation = (
    index: number,
    field: keyof ProductVariation,
    value: any
  ) => {
    setVariations((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: value };
      return clone;
    });
  };

  const removeVariation = (index: number) => {
    if (variations.length <= 1) {
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: 'Atenção',
        message: 'O produto precisa ter pelo menos 1 variação cadastrada.',
        confirmText: 'Entendido',
        onConfirm: closeModal,
      });
      return;
    }
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: 'Remover Variação',
      message: `Deseja realmente remover a variação "${
        variations[index].colorName ||
        variations[index].corNome ||
        `Variação ${index + 1}`
      }"?`,
      confirmText: 'Remover',
      cancelText: 'Cancelar',
      onConfirm: () => {
        setVariations((prev) => prev.filter((_, i) => i !== index));
        closeModal();
      },
      onCancel: closeModal,
    });
  };

  // Total stock calculation
  const totalStock = variations.reduce((acc, v) => acc + (Number(v.stock) || 0), 0);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: 'Campo Obrigatório',
        message: 'Por favor, informe o título do produto.',
        confirmText: 'Entendido',
        onConfirm: closeModal,
      });
      return;
    }
    if (!parentSku.trim()) {
      setModalConfig({
        isOpen: true,
        type: 'warning',
        title: 'Campo Obrigatório',
        message: 'Por favor, informe o código SKU Pai.',
        confirmText: 'Entendido',
        onConfirm: closeModal,
      });
      return;
    }

    setIsSaving(true);

    const selectedCategory = categories.find((c) => c.id === categoryId);
    const selectedSubcategory = availableSubcategories.find((s) => s.id === subcategoryId);

    const newProduct: Product = {
      id: id || `prod-${Date.now()}`,
      parentSku: parentSku.trim().toUpperCase(),
      skuPai: parentSku.trim().toUpperCase(),
      title: title.trim(),
      titulo: title.trim(),
      slug: slug.trim() || parentSku.toLowerCase(),
      description: description.trim(),
      descricao: description.trim(),
      price: Number(price),
      precoVenda: Number(price),
      promotionalPrice: promotionalPrice ? Number(promotionalPrice) : undefined,
      precoPromocional: promotionalPrice ? Number(promotionalPrice) : undefined,
      featuredHome,
      destaqueHome: featuredHome,
      isNew,
      novidade: isNew,
      isOutlet,
      outlet: isOutlet,
      status,
      categoryId,
      categoriaId: categoryId,
      categoryName: selectedCategory?.name || selectedCategory?.nome || 'Geral',
      categoriaNome: selectedCategory?.name || selectedCategory?.nome || 'Geral',
      subcategoryId: subcategoryId || undefined,
      subcategoriaId: subcategoryId || undefined,
      subcategoryName: selectedSubcategory?.name || selectedSubcategory?.nome || undefined,
      subcategoriaNome: selectedSubcategory?.name || selectedSubcategory?.nome || undefined,
      shape,
      formato: shape,
      gender,
      genero: gender,
      variations,
      variacoes: variations,
      media: mediaList,
      midias: mediaList,
    };

    try {
      await saveAdminProduct(newProduct);
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: 'Produto Salvo com Sucesso!',
        message: `Produto "${newProduct.title}" salvo com sucesso!`,
        confirmText: 'Ir para Lista de Produtos',
        onConfirm: () => {
          closeModal();
          router.push('/admin/produtos');
        },
      });
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setModalConfig({
        isOpen: true,
        type: 'danger',
        title: 'Erro ao Salvar',
        message: 'Ocorreu um erro ao salvar o produto.',
        confirmText: 'Tentar Novamente',
        onConfirm: closeModal,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem' }}>
        <p style={{ color: '#64748b' }}>Carregando dados do produto...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/admin/produtos" className={styles.btnBack}>
          <ArrowLeft size={18} />
          Voltar para Lista de Produtos
        </Link>

        <div className={styles.actionsHeader}>
          <button type="submit" disabled={isSaving} className={styles.btnSave}>
            <Save size={18} />
            {isSaving ? 'Salvando...' : editId ? 'Atualizar Produto' : 'Publicar Produto'}
          </button>
        </div>
      </div>

      {/* 1. Main Information & Categorization */}
      <div className={styles.formCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <Layers size={20} color="var(--color-accent)" />
              1. Informações Principais & Categorização
            </h2>
            <p className={styles.cardDesc}>
              Identificação comercial, SKU e taxonomia do modelo.
            </p>
          </div>
        </div>

        <div className={styles.grid2} style={{ marginBottom: '1.25rem' }}>
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.labelRequired}`}>
              Título do Produto
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Armação TS Milano Acetato Tartaruga"
              value={title}
              onChange={handleTitleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.labelRequired}`}>
              Código SKU Pai
            </label>
            <input
              type="text"
              required
              placeholder="Ex: TS-8812"
              value={parentSku}
              onChange={(e) => setParentSku(e.target.value.toUpperCase())}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.grid3} style={{ marginBottom: '1.25rem' }}>
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.labelRequired}`}>
              Categoria Principal
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId('');
              }}
              className={styles.select}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name || cat.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Subcategoria</label>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className={styles.select}
            >
              <option value="">Sem subcategoria</option>
              {availableSubcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name || sub.nome}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Gênero</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className={styles.select}
            >
              <option value="unissex">Unissex</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </div>
        </div>

        <div className={styles.grid2} style={{ marginBottom: '1.25rem' }}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Formato da Armação</label>
            <select
              value={shape}
              onChange={(e) => setShape(e.target.value)}
              className={styles.select}
            >
              <option value="Redondo">Redondo</option>
              <option value="Quadrado">Quadrado</option>
              <option value="Retangular">Retangular</option>
              <option value="Gatinho">Gatinho</option>
              <option value="Aviador">Aviador</option>
              <option value="Hexagonal">Hexagonal</option>
              <option value="Geométrico">Geométrico</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>URL Amigável (Slug)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={styles.input}
              placeholder="ex: armacao-ts-milano-tartaruga"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição Detalhada do Produto</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva os diferenciais técnicos, ergonomia, hastes e estilo da armação..."
            className={styles.textarea}
          />
        </div>
      </div>

      {/* 2. Pricing & Showcase Highlights */}
      <div className={styles.formCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <Sparkles size={20} color="var(--color-accent)" />
              2. Precificação & Destaques de Vitrine
            </h2>
            <p className={styles.cardDesc}>
              Defina preços de venda, promoções e posições de destaque.
            </p>
          </div>
        </div>

        <div className={styles.grid2} style={{ marginBottom: '1.5rem' }}>
          <div className={styles.formGroup}>
            <label className={`${styles.label} ${styles.labelRequired}`}>
              Preço Normal de Venda (R$)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Preço Promocional (R$) (Opcional)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Deixe em branco se não houver desconto"
              value={promotionalPrice || ''}
              onChange={(e) =>
                setPromotionalPrice(e.target.value ? parseFloat(e.target.value) : undefined)
              }
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.checkboxGroup}>
          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={featuredHome}
              onChange={(e) => setFeaturedHome(e.target.checked)}
              className={styles.checkInput}
            />
            <span>Destaque na Vitrine da Home</span>
          </label>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className={styles.checkInput}
            />
            <span>Sinalizar como Novidade / Lançamento</span>
          </label>

          <label className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={isOutlet}
              onChange={(e) => setIsOutlet(e.target.checked)}
              className={styles.checkInput}
            />
            <span>Marcar no Outlet</span>
          </label>
        </div>
      </div>

      {/* 3. Media Upload & Ordering */}
      <div className={styles.formCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <UploadCloud size={20} color="var(--color-accent)" />
              3. Fotos & Vídeos em Alta Resolução
            </h2>
            <p className={styles.cardDesc}>
              Mídias em proporção 1:1. O sistema processa e otimiza automaticamente para 600x600px WebP.
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <label className={styles.dropzone}>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <UploadCloud size={40} className={styles.dropzoneIcon} />
          <div className={styles.dropzoneText}>
            Clique aqui ou arraste fotos e vídeos do modelo
          </div>
          <div className={styles.dropzoneSubtext}>
            Formatos suportados: JPG, PNG, WebP e vídeos MP4 (Visão frontal, 45º e perfil)
          </div>
        </label>

        {/* Video URL Input */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <input
            type="url"
            placeholder="Adicionar link de vídeo (ex: MP4 ou YouTube Showcase)..."
            value={videoUrlInput}
            onChange={(e) => setVideoUrlInput(e.target.value)}
            className={styles.input}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={handleAddVideoUrl}
            className={styles.btnAddVariation}
          >
            <Video size={16} />
            Adicionar Vídeo
          </button>
        </div>

        {/* Media Grid */}
        {mediaList.length > 0 && (
          <div className={styles.mediaGrid}>
            {mediaList.map((media, index) => (
              <div
                key={media.id}
                className={`${styles.mediaItem} ${
                  media.isPrimary ? styles.mediaItemPrimary : ''
                }`}
              >
                <div className={styles.mediaThumbWrapper}>
                  {media.type === 'VIDEO' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Video size={36} color="#475569" />
                      <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Vídeo Demonstrativo
                      </span>
                    </div>
                  ) : (
                    <img
                      src={media.url}
                      alt={`Mídia ${index + 1}`}
                      className={styles.mediaThumb}
                    />
                  )}

                  {media.isPrimary && (
                    <span className={styles.mediaBadgePrincipal}>Principal</span>
                  )}
                  {media.type === 'VIDEO' && (
                    <span className={styles.mediaBadgeVideo}>
                      <Video size={12} /> Vídeo
                    </span>
                  )}
                </div>

                <div className={styles.mediaControls}>
                  <button
                    type="button"
                    onClick={() => moveMedia(index, 'left')}
                    disabled={index === 0}
                    className={styles.btnControl}
                    title="Mover para a esquerda"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPrimaryMedia(index)}
                    className={styles.btnControl}
                    title="Definir como Foto Principal"
                    style={{
                      color: media.isPrimary ? '#d97706' : '#64748b',
                    }}
                  >
                    <Star size={14} fill={media.isPrimary ? '#d97706' : 'none'} />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveMedia(index, 'right')}
                    disabled={index === mediaList.length - 1}
                    className={styles.btnControl}
                    title="Mover para a direita"
                  >
                    <ChevronRight size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className={`${styles.btnControl} ${styles.btnControlDelete}`}
                    title="Remover mídia"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Variations: Colors, Measurements & Stock */}
      <div className={styles.formCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <Layers size={20} color="var(--color-accent)" />
              4. Variações do Produto-Pai (Cores, Medidas & Estoque)
            </h2>
            <p className={styles.cardDesc}>
              Gerencie cores, dimensões técnicas em milímetros e estoque em tempo real.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              Estoque Total: {totalStock} un.
            </span>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {totalStock === 0
                ? 'Produto Esgotado'
                : totalStock <= 3
                ? 'Últimas Unidades'
                : 'Em Estoque'}
            </div>
          </div>
        </div>

        <div className={styles.variationsTableContainer}>
          <table className={styles.variationsTable}>
            <thead>
              <tr>
                <th>Cor (Nome & Hex)</th>
                <th style={{ width: '90px' }}>Aro (mm)</th>
                <th style={{ width: '90px' }}>Ponte (mm)</th>
                <th style={{ width: '90px' }}>Haste (mm)</th>
                <th>Material</th>
                <th style={{ width: '100px' }}>Estoque</th>
                <th>SKU Variação</th>
                <th style={{ width: '50px', textAlign: 'center' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {variations.map((v, idx) => (
                <tr key={v.id || idx}>
                  <td>
                    <div className={styles.colorInputRow}>
                      <input
                        type="color"
                        value={v.colorHex || '#000000'}
                        onChange={(e) =>
                          updateVariation(idx, 'colorHex', e.target.value)
                        }
                        className={styles.colorPicker}
                        title="Seletor de cor HEX"
                      />
                      <input
                        type="text"
                        value={v.colorName}
                        placeholder="Ex: Preto Fosco"
                        onChange={(e) =>
                          updateVariation(idx, 'colorName', e.target.value)
                        }
                        className={styles.inputCompact}
                      />
                    </div>
                  </td>

                  <td>
                    <input
                      type="number"
                      value={v.lensWidthMm}
                      onChange={(e) =>
                        updateVariation(idx, 'lensWidthMm', parseInt(e.target.value) || 0)
                      }
                      className={styles.inputCompact}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={v.bridgeMm}
                      onChange={(e) =>
                        updateVariation(idx, 'bridgeMm', parseInt(e.target.value) || 0)
                      }
                      className={styles.inputCompact}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={v.templeMm}
                      onChange={(e) =>
                        updateVariation(idx, 'templeMm', parseInt(e.target.value) || 0)
                      }
                      className={styles.inputCompact}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={v.material}
                      placeholder="Ex: Acetato Italiano"
                      onChange={(e) =>
                        updateVariation(idx, 'material', e.target.value)
                      }
                      className={styles.inputCompact}
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      value={v.stock}
                      onChange={(e) =>
                        updateVariation(
                          idx,
                          'stock',
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={styles.inputCompact}
                      style={{
                        fontWeight: 700,
                        color: v.stock === 0 ? '#dc2626' : '#059669',
                      }}
                    />
                  </td>

                  <td>
                    <input
                      type="text"
                      value={v.skuVariation}
                      placeholder={`${parentSku}-VAR${idx + 1}`}
                      onChange={(e) =>
                        updateVariation(idx, 'skuVariation', e.target.value)
                      }
                      className={styles.inputCompact}
                    />
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeVariation(idx)}
                      className={`${styles.btnControl} ${styles.btnControlDelete}`}
                      title="Excluir variação"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addVariation}
          className={styles.btnAddVariation}
        >
          <Plus size={16} />
          Adicionar Nova Variação (Cor/Tamanho)
        </button>
      </div>

      {/* 5. Visibility Selection */}
      <div className={styles.formCard}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>
              <Info size={20} color="var(--color-accent)" />
              5. Visibilidade do Produto no Catálogo
            </h2>
            <p className={styles.cardDesc}>
              Controle se o produto está público para os clientes ou salvo como rascunho sem excluir dados.
            </p>
          </div>
        </div>

        <div className={styles.statusSelector}>
          <div
            className={`${styles.statusOption} ${
              status === 'ACTIVE' || status === 'ATIVO' ? styles.statusOptionActive : ''
            }`}
            onClick={() => setStatus('ACTIVE')}
          >
            <div className={styles.statusOptionHeader}>
              <span>Ativo no Catálogo</span>
              {(status === 'ACTIVE' || status === 'ATIVO') && <CheckCircle size={16} color="#10b981" />}
            </div>
            <p className={styles.statusOptionDesc}>
              Visível na loja para todos os clientes realizarem orçamentos e compras.
            </p>
          </div>

          <div
            className={`${styles.statusOption} ${
              status === 'HIDDEN' || status === 'OCULTO' ? styles.statusOptionHidden : ''
            }`}
            onClick={() => setStatus('HIDDEN')}
          >
            <div className={styles.statusOptionHeader}>
              <span>Oculto / Rascunho</span>
              {(status === 'HIDDEN' || status === 'OCULTO') && <CheckCircle size={16} color="#f59e0b" />}
            </div>
            <p className={styles.statusOptionDesc}>
              Oculto temporariamente no catálogo público sem necessidade de exclusão.
            </p>
          </div>

          <div
            className={`${styles.statusOption} ${
              status === 'ARCHIVED' || status === 'ARQUIVADO' ? styles.statusOptionArchived : ''
            }`}
            onClick={() => setStatus('ARCHIVED')}
          >
            <div className={styles.statusOptionHeader}>
              <span>Arquivado</span>
              {(status === 'ARCHIVED' || status === 'ARQUIVADO') && <CheckCircle size={16} color="#64748b" />}
            </div>
            <p className={styles.statusOptionDesc}>
              Fora de linha ou descontinuado permanentemente pelo fornecedor.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Save Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button type="submit" disabled={isSaving} className={styles.btnSave}>
          <Save size={18} />
          {isSaving ? 'Salvando...' : editId ? 'Atualizar Produto' : 'Publicar Produto'}
        </button>
      </div>

      {/* Friendly Action Confirmation & Feedback Modal */}
      <ActionModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        onConfirm={modalConfig.onConfirm || closeModal}
        onCancel={modalConfig.onCancel || closeModal}
        onClose={closeModal}
      />
    </form>
  );
}

export default function NovoProdutoPage() {
  return (
    <Suspense fallback={<div style={{ padding: '3rem', textAlign: 'center' }}>Carregando formulário...</div>}>
      <ProductForm />
    </Suspense>
  );
}
