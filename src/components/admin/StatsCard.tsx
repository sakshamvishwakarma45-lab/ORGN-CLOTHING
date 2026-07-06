'use client';

import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingCart, Package, AlertTriangle, Users, Tag, FileText, Image as ImageIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const ICON_MAP: Record<string, LucideIcon> = {
  rupee: IndianRupee,
  cart: ShoppingCart,
  package: Package,
  alert: AlertTriangle,
  users: Users,
  tag: Tag,
  file: FileText,
  image: ImageIcon,
};

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return count;
}

export function StatsCard({
  label,
  value,
  numericValue,
  iconName,
  accent = false,
  trend,
}: {
  label: string;
  value: string;
  numericValue?: number;
  iconName: keyof typeof ICON_MAP;
  accent?: boolean;
  trend?: { value: number; label: string };
}) {
  const animatedNum = useCountUp(numericValue ?? 0);
  const displayValue = numericValue != null ? (value.includes('₹') ? `₹${animatedNum.toLocaleString('en-IN')}` : String(animatedNum)) : value;
  const Icon = ICON_MAP[iconName] ?? Package;

  return (
    <div className="group border-2 border-ink bg-offwhite p-5 shadow-orgn-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orgn">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-ink/50">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${accent ? 'bg-orgn-orange/10 text-orgn-orange' : 'bg-ink/5 text-ink/40 group-hover:bg-orgn-orange/10 group-hover:text-orgn-orange'}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="font-display text-3xl font-black">{displayValue}</p>
      {trend && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${trend.value >= 0 ? 'text-success' : 'text-danger'}`}>
          {trend.value >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{trend.value >= 0 ? '+' : ''}{trend.value}%</span>
          <span className="text-ink/40">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
