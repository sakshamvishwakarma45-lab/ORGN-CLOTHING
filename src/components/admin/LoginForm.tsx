'use client';

import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wordmark } from '@/components/ui/Wordmark';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'not-authorized'
      ? 'That account does not have admin access.'
      : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Incorrect email or password.');
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }

    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-beige px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] animate-drift rounded-full bg-orgn-orange/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] animate-drift rounded-full bg-orgn-orange/5 blur-[80px]" style={{ animationDelay: '-10s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-10 text-center">
          <Image src="/brand/orgn-mark.png" alt="" width={48} height={48} className="mx-auto mb-3 rounded-lg" />
          <Wordmark size="md" className="mx-auto" />
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ink/50">Admin Panel</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-5 border-2 border-ink bg-offwhite p-8 shadow-orgn-sm ${shaking ? 'shake' : ''}`}
        >
          {/* Email field */}
          <div className="floating-label-group">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="input-field pl-11"
                autoFocus
                id="login-email"
              />
              <label htmlFor="login-email" className="left-11">Email</label>
            </div>
          </div>

          {/* Password field */}
          <div className="floating-label-group">
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="input-field pl-11 pr-11"
                id="login-password"
              />
              <label htmlFor="login-password" className="left-11">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-ink/30 transition hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-orgn-orange"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 bg-ink py-3.5 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm transition-all duration-200 hover:bg-orgn-orange hover:text-ink disabled:opacity-60 shine-sweep"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
