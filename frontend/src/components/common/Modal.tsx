import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  id,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm': return 'max-w-sm';
      case 'md': return 'max-w-md';
      case 'lg': return 'max-w-lg';
      case 'xl': return 'max-w-xl';
      case '2xl': return 'max-w-2xl';
      case '3xl': return 'max-w-3xl';
      case '4xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id={id}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#18131A]/30 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${getMaxWidthClass()} bg-white/95 backdrop-blur-xl border border-[#F3DCE8] rounded-3xl shadow-2xl shadow-pink-500/15 overflow-hidden z-10 my-auto`}
          >
            {/* Header */}
            {(title || subtitle) && (
              <div className="px-6 pt-6 pb-4 border-b border-[#F3DCE8]/70 flex items-start justify-between gap-4">
                <div>
                  {typeof title === 'string' ? (
                    <h3 className="text-xl font-bold text-[#18131A] tracking-tight">{title}</h3>
                  ) : (
                    title
                  )}
                  {subtitle && <p className="text-xs text-[#6B6470] mt-1">{subtitle}</p>}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-50 transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {!title && !subtitle && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-pink-50 text-[#6B6470] hover:text-[#EC4899] border border-[#F3DCE8] transition-colors cursor-pointer shadow-sm"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Content body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
