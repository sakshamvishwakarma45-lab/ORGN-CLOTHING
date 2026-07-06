import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ORGN-${y}${m}${d}-${rand}`;
}

export function getPrimaryImage(images?: { url: string; is_primary: boolean }[]): string {
  if (!images || images.length === 0) return 'https://placehold.co/1000x1250/1C1B19/F4F1EA?text=ORGN';
  const primary = images.find((img) => img.is_primary);
  return (primary ?? images[0]).url;
}

export function isLowStock(totalStock: number, threshold: number): boolean {
  return totalStock <= threshold;
}
