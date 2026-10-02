'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, X, Check, Glasses, AlertCircle } from 'lucide-react';
import { Product } from '../../../types';
import styles from './ProductSearchSelect.module.css';

export interface ProductSearchSelectProps {
  products: Product[];
  selectedProductId: string;
  onSelect: (productId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ProductSearchSelect({
  products,
  selectedProductId,
  onSelect,
  disabled = false,
  placeholder = 'Buscar por modelo, SKU ou nome do produto...',
}: ProductSearchSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Produto atualmente selecionado
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  // Normalizador de texto para busca sem distinção de acentos/maiúsculas
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  // Filtragem rápida
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = normalize(searchTerm);
    return products.filter((p) => {
      const title = normalize(p.title || p.titulo || '');
      const sku = normalize(p.parentSku || p.skuPai || '');
      const cat = normalize(p.categoryName || p.categoriaNome || '');
      const shape = normalize(p.shape || '');
      return (
        title.includes(term) ||
        sku.includes(term) ||
        cat.includes(term) ||
        shape.includes(term)
      );
    });
  }, [products, searchTerm]);

  // Fecha o dropdown ao clicar fora ou apertar Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectProduct = (product: Product) => {
    onSelect(product.id);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect('');
    setSearchTerm('');
    setIsOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const getProductThumb = (p: Product) => {
    const mediaList = p.media || p.midias || [];
    return mediaList.find((m) => m.isPrimary || m.principal)?.url || mediaList[0]?.url;
  };

  const isListEmpty = products.length === 0;

  return (
    <div className={styles.container} ref={containerRef}>
      <div
        className={`${styles.searchBox} ${
          disabled || isListEmpty ? styles.searchBoxDisabled : ''
        }`}
      >
        {/* Se já há produto selecionado e dropdown fechado, exibe card do produto selecionado */}
        {selectedProduct && !isOpen ? (
          <div
            className={styles.selectedWrapper}
            onClick={() => {
              if (!disabled) {
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            title="Clique para pesquisar ou alterar o produto selecionado"
          >
            {getProductThumb(selectedProduct) ? (
              <img
                src={getProductThumb(selectedProduct)}
                alt=""
                className={styles.selectedThumb}
              />
            ) : (
              <div className={styles.selectedThumbPlaceholder}>
                <Glasses size={16} />
              </div>
            )}
            <span className={styles.selectedSku}>
              {selectedProduct.parentSku || selectedProduct.skuPai || 'SEM SKU'}
            </span>
            <span className={styles.selectedTitle}>
              {selectedProduct.title || selectedProduct.titulo}
            </span>
            {(selectedProduct.categoryName || selectedProduct.categoriaNome) && (
              <span className={styles.selectedCategory}>
                {selectedProduct.categoryName || selectedProduct.categoriaNome}
              </span>
            )}
          </div>
        ) : (
          <>
            <Search size={18} className={styles.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder={
                isListEmpty
                  ? 'Todos os produtos já estão adicionados na Home'
                  : placeholder
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => {
                if (!disabled && !isListEmpty) setIsOpen(true);
              }}
              disabled={disabled || isListEmpty}
            />
          </>
        )}

        {/* Controles à direita */}
        <div className={styles.controlsRight}>
          {(selectedProduct || searchTerm) && !disabled && (
            <button
              type="button"
              className={styles.btnAction}
              onClick={handleClearSelection}
              aria-label="Limpar seleção"
              title="Limpar seleção"
            >
              <X size={16} />
            </button>
          )}

          {!disabled && !isListEmpty && (
            <button
              type="button"
              className={styles.btnAction}
              onClick={() => {
                setIsOpen((prev) => !prev);
                if (!isOpen) {
                  setTimeout(() => inputRef.current?.focus(), 50);
                }
              }}
              aria-label={isOpen ? 'Fechar lista' : 'Abrir lista'}
            >
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown com a lista pesquisável */}
      {isOpen && !disabled && !isListEmpty && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <span>
              {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'modelo disponível' : 'modelos disponíveis'}
            </span>
            {searchTerm && <span>Filtro: &quot;{searchTerm}&quot;</span>}
          </div>

          {filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertCircle size={24} color="#94a3b8" />
              <span>Nenhum modelo encontrado para &quot;{searchTerm}&quot;</span>
            </div>
          ) : (
            filteredProducts.map((prod) => {
              const thumb = getProductThumb(prod);
              const title = prod.title || prod.titulo || '';
              const sku = prod.parentSku || prod.skuPai || '';
              const cat = prod.categoryName || prod.categoriaNome || '';
              const isSelected = prod.id === selectedProductId;

              return (
                <div
                  key={prod.id}
                  className={`${styles.optionItem} ${
                    isSelected ? styles.optionSelected : ''
                  }`}
                  onClick={() => handleSelectProduct(prod)}
                >
                  {thumb ? (
                    <img src={thumb} alt="" className={styles.optionThumb} />
                  ) : (
                    <div className={styles.optionThumbPlaceholder}>
                      <Glasses size={18} />
                    </div>
                  )}

                  <div className={styles.optionInfo}>
                    <div className={styles.optionTitleRow}>
                      {sku && <span className={styles.optionSku}>{sku}</span>}
                      <span className={styles.optionTitle}>{title}</span>
                    </div>
                    {cat && <span className={styles.optionCategory}>{cat}</span>}
                  </div>

                  {isSelected && <Check size={18} className={styles.optionCheck} />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
