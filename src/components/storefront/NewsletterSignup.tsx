'use client';

import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

function Confetti() {
  const colors = ['#FF4B1F', '#FF6B3D', '#F4F1EA', '#0A0A0A', '#FFD700'];
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    duration: `${2 + Math.random() * 1.5}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: `${Math.random() * 360}deg`,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="confetti-container">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${p.rotation})`,
          }}
        />
      ))}
    </div>
  );
}

export function NewsletterSignup({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const dark = variant === 'dark';
  const { toast } = useToast();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('done');
      setEmail('');
      setShowConfetti(true);
      toast('You\'re on the list! Check your email for 10% off.', 'success');
      setTimeout(() => setShowConfetti(false), 3000);
    } catch {
      setStatus('error');
      toast('Something went wrong — try again in a moment.', 'error');
    }
  }, [email, toast]);

  return (
    <>
      {showConfetti && <Confetti />}
      <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', dark ? 'text-offwhite' : 'text-ink')}>
        <div>
          <p className="font-display text-xl font-bold uppercase">Join the list</p>
          <p className={cn('text-sm', dark ? 'text-offwhite/60' : 'text-ink/60')}>
            First access to drops, restocks, and nothing else.
          </p>
        </div>
        {status === 'done' ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-orgn-orange">
            <Check className="h-4 w-4" /> You&apos;re on the list! 🎉
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-stretch gap-0 sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={cn(
                'w-full min-w-0 flex-1 border-2 px-4 py-3 text-sm outline-none transition-colors',
                dark
                  ? 'border-offwhite/20 bg-transparent text-offwhite placeholder:text-offwhite/40 focus:border-orgn-orange'
                  : 'border-ink/20 bg-transparent text-ink placeholder:text-ink/40 focus:border-orgn-orange'
              )}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Subscribe"
              className="flex flex-shrink-0 items-center justify-center bg-orgn-orange px-4 text-ink transition-colors hover:bg-ink hover:text-orgn-orange disabled:opacity-60"
            >
              {status === 'loading' ? (
                <Sparkles className="h-5 w-5 animate-spin" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
