'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { type ReactNode, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
}

export function MagneticButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className,
  type = 'button',
  loading = false,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.2 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.2 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.35);
    y.set(relY * 0.35);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const handleRipple = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.className = 'ripple';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  const base =
    'inline-flex items-center justify-center gap-2 px-8 py-4 font-body font-semibold uppercase tracking-wide text-sm transition-all duration-200';
  const styles =
    variant === 'primary'
      ? 'bg-ink text-beige shadow-orgn hover:bg-orgn-orange hover:text-ink shine-sweep ripple-effect'
      : 'bg-transparent text-ink border-2 border-ink hover:bg-ink hover:text-beige ripple-effect';

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleRipple}
      style={{ x: springX, y: springY }}
      className={cn('inline-block', className)}
    >
      <span className={cn(base, styles, 'w-full relative', disabled && 'opacity-60 cursor-not-allowed', className)}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
      </span>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cn('inline-block', className)}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cn('inline-block', className)}>
      {content}
    </button>
  );
}
