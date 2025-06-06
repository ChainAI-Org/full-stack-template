"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  dialogClassName?: string;
  hideCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  dialogClassName,
  hideCloseButton = false,
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      modalRef.current?.focus(); // Focus the modal for accessibility
    } else {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = ''; // Ensure overflow is reset on unmount
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full h-full rounded-none',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      className={cn(
        'fixed inset-0 z-[100] flex items-center justify-center p-4',
        'bg-brand-dark-overlay/80 backdrop-blur-sm',
        'transition-opacity duration-subtle ease-apple',
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        className
      )}
      onClick={onClose} // Close on overlay click
    >
      <div
        ref={modalRef}
        tabIndex={-1} // Make it focusable
        className={cn(
          'relative bg-brand-dark-surface text-brand-dark-text-primary rounded-lg shadow-subtle-lg',
          'flex flex-col overflow-hidden',
          'transition-transform duration-subtle ease-apple',
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
          sizeClasses[size],
          'w-full',
          dialogClassName
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        {/* Modal Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between p-4 md:p-5 border-b border-brand-dark-border">
            {title && (
              <h3 id="modal-title" className="text-lg font-semibold text-brand-dark-text-primary">
                {title}
              </h3>
            )}
            {!hideCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                aria-label="Close modal"
                className="ml-auto -mr-2 -my-2 text-brand-dark-text-tertiary hover:text-brand-dark-text-primary"
              >
                <X size={20} />
              </Button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 md:p-5 flex-grow overflow-y-auto">
          {children}
        </div>
        
        {/* Modal Footer can be added as part of children or as a separate slot if needed */}
      </div>
    </div>
  );
};

Modal.displayName = 'Modal';

export { Modal };
