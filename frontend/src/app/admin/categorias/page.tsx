'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, Tag, PlusCircle } from 'lucide-react';
import {
  getCategories,
  saveCategory,
  deleteCategory,
  saveSubcategory,
  deleteSubcategory,
} from '../../../services/catalog.service';
import { Category, Subcategory } from '../../../types';
import styles from './categoriasAdmin.module.css';

export default function AdminCategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal for Create / Edit Category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [categoryOrder, setCategoryOrder] = useState(1);

  // Quick subcategory inputs per category { [catId]: string }
  const [subcategoryInputs, setSubcategoryInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories([...data]);
    } catch (err) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const openNewCategoryModal = () => {
    setEditCategoryId(null);
    setCategoryName('');
    setCategorySlug('');
    setCategoryOrder(categories.length + 1);
    setIsModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditCategoryId(cat.id);
    setCategoryName(cat.name || cat.nome || '');
    setCategorySlug(cat.slug);
    setCategoryOrder(cat.order ?? cat.ordem ?? 1);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setCategoryName(val);
    if (!editCategoryId) {
      const autoSlug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setCategorySlug(autoSlug);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const existingCat = editCategoryId ? categories.find((c) => c.id === editCategoryId) : null;
    const newCategory: Category = {
      id: editCategoryId || `cat-${Date.now()}`,
      name: categoryName.trim(),
      nome: categoryName.trim(),
      slug: categorySlug.trim() || categoryName.toLowerCase(),
      order: Number(categoryOrder),
      ordem: Number(categoryOrder),
      subcategories: existingCat?.subcategories || existingCat?.subcategorias || [],
      subcategorias: existingCat?.subcategories || existingCat?.subcategorias || [],
    };

    await saveCategory(newCategory);
    await loadCategories();
    setIsModalOpen(false);
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir a categoria "${name}"? Os produtos vinculados precisarão ser reclassificados.`
      )
    ) {
      await deleteCategory(id);
      await loadCategories();
    }
  };

  // Subcategories
  const handleAddSubcategory = async (catId: string) => {
    const subName = subcategoryInputs[catId];
    if (!subName || !subName.trim()) return;

    const subSlug = subName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newSub: Subcategory = {
      id: `sub-${Date.now()}`,
      name: subName.trim(),
      nome: subName.trim(),
      slug: subSlug,
      categoryId: catId,
    };

    await saveSubcategory(catId, newSub);
    setSubcategoryInputs((prev) => ({ ...prev, [catId]: '' }));
    await loadCategories();
  };

  const handleDeleteSubcategory = async (catId: string, subId: string) => {
    await deleteSubcategory(catId, subId);
    await loadCategories();
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h2>Categorias & Subcategorias</h2>
          <p>Organize a taxonomia de armações, solares e coleções da TS EYEWEAR.</p>
        </div>
        <button type="button" onClick={openNewCategoryModal} className={styles.btnNew}>
          <PlusCircle size={18} />
          Nova Categoria Principal
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ color: '#64748b' }}>Carregando categorias...</p>
        </div>
      ) : (
        <div className={styles.categoryGrid}>
          {categories.map((cat) => {
            const catName = cat.name || cat.nome || '';
            const subcategories = cat.subcategories || cat.subcategorias || [];
            return (
              <div key={cat.id} className={styles.categoryCard}>
                <div className={styles.cardTop}>
                  <div className={styles.catInfo}>
                    <h3>{catName}</h3>
                    <span className={styles.catSlug}>slug: /{cat.slug}</span>
                  </div>
                  <div className={styles.catActions}>
                    <button
                      type="button"
                      onClick={() => openEditCategoryModal(cat)}
                      className={styles.iconBtn}
                      title="Editar Categoria"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, catName)}
                      className={`${styles.iconBtn} ${styles.iconBtnDelete}`}
                      title="Excluir Categoria"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                <div className={styles.subcategoriesSection}>
                  <h4>
                    Subcategorias ({subcategories.length})
                  </h4>

                  <div className={styles.subcategoriesList}>
                    {subcategories.length > 0 ? (
                      subcategories.map((sub) => {
                        const subName = sub.name || sub.nome || '';
                        return (
                          <span key={sub.id} className={styles.subTag}>
                            <Tag size={12} color="#64748b" />
                            {subName}
                            <button
                              type="button"
                              onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                              className={styles.subTagRemove}
                              title="Remover subcategoria"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Nenhuma subcategoria vinculada.
                      </span>
                    )}
                  </div>

                  <div className={styles.addSubRow}>
                    <input
                      type="text"
                      placeholder="Adicionar subcategoria (ex: Acetato, Infantil)..."
                      value={subcategoryInputs[cat.id] || ''}
                      onChange={(e) =>
                        setSubcategoryInputs((prev) => ({ ...prev, [cat.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcategory(cat.id);
                        }
                      }}
                      className={styles.subInput}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubcategory(cat.id)}
                      className={styles.btnAddSub}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create/Edit Category */}
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalBox}>
            <div className={styles.modalHeader}>
              <h3>{editCategoryId ? 'Editar Categoria' : 'Nova Categoria Principal'}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Nome da Categoria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Óculos de Grau"
                  value={categoryName}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Slug URL</label>
                <input
                  type="text"
                  required
                  placeholder="ex: oculos-de-grau"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Ordem de Exibição</label>
                <input
                  type="number"
                  required
                  value={categoryOrder}
                  onChange={(e) => setCategoryOrder(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnCancel}
                >
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSubmit}>
                  {editCategoryId ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
