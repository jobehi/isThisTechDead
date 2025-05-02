'use client';

import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  closeOnEsc?: boolean;
  closeOnOverlayClick?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'top';
}

/**
 * Dialog component provides a modal dialog with customizable appearance and behavior.
 * Features include animated transitions, backdrop overlay, and responsive sizing.
 *
 * @example
 * ```tsx
 * import { Dialog } from '@/components/organisms';
 *
 * const [isOpen, setIsOpen] = useState(false);
 *
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmation"
 * >
 *   <p>Are you sure you want to continue?</p>
 *   <div className="mt-4 flex justify-end space-x-2">
 *     <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *     <Button variant="primary">Confirm</Button>
 *   </div>
 * </Dialog>
 * ```
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  size = 'md',
  position = 'center',
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeOnEsc, isOpen, onClose]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Size variants
  const sizeVariants = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)]',
  };

  // Position variants
  const positionVariants = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-16',
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, delay: 0.1 },
    },
  };

  const contentVariants = {
    hidden: {
      opacity: 0,
      scale: 0.96,
      y: position === 'top' ? -10 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-auto">
          {/* Backdrop overlay */}
          <motion.div
            className={`fixed inset-0 bg-black/60 backdrop-blur-sm ${overlayClassName}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Dialog container */}
          <div className={`fixed inset-0 flex ${positionVariants[position]} p-4 z-50`}>
            <motion.div
              ref={dialogRef}
              className={`
                ${sizeVariants[size]}
                w-full
                relative
                overflow-hidden
                bg-zinc-900/90
                backdrop-blur-xl
                border
                border-zinc-800/60
                rounded-xl
                shadow-2xl
                my-auto
                ${className}
              `}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
              onClick={e => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-[100%] bg-gradient-to-br from-lime-500/5 via-transparent to-transparent rounded-full blur-2xl" />
              </div>

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Header with optional title */}
                {(title || showCloseButton) && (
                  <div className="flex items-start justify-between p-5 border-b border-zinc-800/60">
                    {title && (
                      <div>
                        <h2 className="text-xl font-semibold text-lime-300">{title}</h2>
                        {description && <p className="mt-1 text-sm text-zinc-400">{description}</p>}
                      </div>
                    )}

                    {showCloseButton && (
                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-lime-300 hover:bg-zinc-800/50 transition-colors"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Main content */}
                <div className="p-5">{children}</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Context for handling dialog state
interface DialogContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined);

/**
 * DialogProvider component provides dialog state management through React Context.
 * Used to manage dialog state at a higher level in the component tree.
 */
export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <DialogContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </DialogContext.Provider>
  );
}

/**
 * useDialog hook provides access to dialog state and controls.
 * Must be used within a DialogProvider component.
 *
 * @returns DialogContextType containing isOpen state and control functions
 */
export function useDialog() {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
