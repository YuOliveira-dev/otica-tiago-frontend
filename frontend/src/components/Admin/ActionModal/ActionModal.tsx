'use client';

import React, { useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Info,
  X,
  Loader2,
} from 'lucide-react';
import styles from './ActionModal.module.css';

export type ActionModalType =
  | 'success'
  | 'warning'
  | 'danger'
  | 'confirm'
  | 'info';

export interface ActionModalProps {
  isOpen: boolean;
  type?: ActionModalType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export function ActionModal({
  isOpen,
  type = 'info',
  title,
  message,
  confirmText,
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  onClose,
  isLoading = false,
}: ActionModalProps) {
  const handleClose = onCancel || onClose || onConfirm || (() => {});

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, handleClose]);

  if (!isOpen) return null;

  // Derive default title based on type if not supplied
  const defaultTitle = (() => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Sucesso!';
      case 'warning':
        return 'Atenção';
      case 'danger':
        return 'Atenção';
      case 'confirm':
        return 'Confirmar Ação';
      case 'info':
      default:
        return 'Aviso';
    }
  })();

  // Derive default confirm text based on type if not supplied
  const defaultConfirmText = (() => {
    if (confirmText) return confirmText;
    switch (type) {
      case 'success':
        return 'Entendido';
      case 'warning':
        return 'Entendido';
      case 'danger':
        return 'Fechar';
      case 'confirm':
        return 'Confirmar';
      case 'info':
      default:
        return 'OK';
    }
  })();

  // Icon and theme config
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>
            <CheckCircle2 size={32} strokeWidth={2.2} />
          </div>
        );
      case 'warning':
        return (
          <div className={`${styles.iconWrapper} ${styles.iconWarning}`}>
            <AlertTriangle size={30} strokeWidth={2.2} />
          </div>
        );
      case 'danger':
        return (
          <div className={`${styles.iconWrapper} ${styles.iconDanger}`}>
            <AlertCircle size={32} strokeWidth={2.2} />
          </div>
        );
      case 'confirm':
        return (
          <div className={`${styles.iconWrapper} ${styles.iconConfirm}`}>
            <HelpCircle size={32} strokeWidth={2.2} />
          </div>
        );
      case 'info':
      default:
        return (
          <div className={`${styles.iconWrapper} ${styles.iconInfo}`}>
            <Info size={32} strokeWidth={2.2} />
          </div>
        );
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case 'success':
        return styles.btnSuccess;
      case 'warning':
        return styles.btnWarning;
      case 'danger':
        return styles.btnDanger;
      case 'confirm':
        return styles.btnPrimary;
      default:
        return styles.btnPrimary;
    }
  };

  const isConfirmType = type === 'confirm';

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        if (!isLoading) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="action-modal-title"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {!isLoading && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        )}

        {renderIcon()}

        <h3 id="action-modal-title" className={styles.title}>
          {defaultTitle}
        </h3>

        <p className={styles.message}>{message}</p>

        <div className={styles.actionsRow}>
          {isConfirmType && (
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onCancel || onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className={`${styles.btnConfirm} ${getConfirmBtnClass()} ${
              !isConfirmType ? styles.btnSingle : ''
            }`}
            onClick={onConfirm || onCancel || onClose}
            disabled={isLoading}
            autoFocus
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            <span>{defaultConfirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
