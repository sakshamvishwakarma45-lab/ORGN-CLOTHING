'use client';

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, AlertCircle, Info, X, ShoppingBag } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'cart';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const ICONS: Record<ToastType, ReactNode> = {
  success: <Check className="h-4 w-4" />,
  error: <AlertCircle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  cart: <ShoppingBag className="h-4 w-4" />,
};

const STYLES: Record<ToastType, string> = {
  success: 'bg-ink text-beige border-success/40',
  error: 'bg-ink text-beige border-orgn-orange/60',
  info: 'bg-ink text-beige border-offwhite/20',
  cart: 'bg-ink text-beige border-orgn-orange/40',
};

const ICON_STYLES: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-orgn-orange',
  info: 'text-offwhite/70',
  cart: 'text-orgn-orange',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 sm:right-6 sm:top-6">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`flex items-center gap-3 border-l-[3px] px-4 py-3 shadow-lg ${STYLES[t.type]}`}
            >
              <span className={ICON_STYLES[t.type]}>{ICONS[t.type]}</span>
              <p className="text-sm font-medium">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-2 rounded p-0.5 opacity-50 transition hover:opacity-100"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
