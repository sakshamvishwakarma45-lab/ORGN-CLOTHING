'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string | null;
  color: string | null;
  qty: number;
  maxStock: number;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (line: Omit<CartLine, 'qty'>, qty?: number) => void;
  removeItem: (productId: string, size: string | null, color: string | null) => void;
  updateQty: (productId: string, size: string | null, color: string | null, qty: number) => void;
  clear: () => void;
  subtotal: () => number;
  itemCount: () => number;
}

function lineKey(productId: string, size: string | null, color: string | null) {
  return `${productId}__${size ?? ''}__${color ?? ''}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (line, qty = 1) =>
        set((state) => {
          const key = lineKey(line.productId, line.size, line.color);
          const existing = state.lines.find(
            (l) => lineKey(l.productId, l.size, l.color) === key
          );
          if (existing) {
            const newQty = Math.min(existing.qty + qty, existing.maxStock);
            return {
              lines: state.lines.map((l) =>
                lineKey(l.productId, l.size, l.color) === key ? { ...l, qty: newQty } : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [...state.lines, { ...line, qty: Math.min(qty, line.maxStock) }],
            isOpen: true,
          };
        }),
      removeItem: (productId, size, color) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => lineKey(l.productId, l.size, l.color) !== lineKey(productId, size, color)
          ),
        })),
      updateQty: (productId, size, color, qty) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              lineKey(l.productId, l.size, l.color) === lineKey(productId, size, color)
                ? { ...l, qty: Math.max(1, Math.min(qty, l.maxStock)) }
                : l
            )
            .filter((l) => l.qty > 0),
        })),
      clear: () => set({ lines: [] }),
      subtotal: () => get().lines.reduce((sum, l) => sum + l.price * l.qty, 0),
      itemCount: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
    }),
    { name: 'orgn-cart' }
  )
);
