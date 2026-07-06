'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Lock, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useToast } from '@/components/ui/Toast';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other',
];

const STEPS = ['Contact', 'Shipping', 'Payment'];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {STEPS.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                i < current
                  ? 'bg-orgn-orange text-ink'
                  : i === current
                  ? 'bg-ink text-beige shadow-orgn-sm'
                  : 'bg-ink/10 text-ink/40'
              }`}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-xs font-semibold uppercase tracking-wide sm:inline ${
              i <= current ? 'text-ink' : 'text-ink/40'
            }`}>
              {step}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-3 h-0.5 w-8 rounded transition-colors duration-300 sm:w-16 ${
              i < current ? 'bg-orgn-orange' : 'bg-ink/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    line1: '', line2: '', city: '', state: INDIAN_STATES[0], postalCode: '',
  });

  useEffect(() => setHydrated(true), []);

  // Auto-advance step indicator based on filled fields
  useEffect(() => {
    if (form.name && form.email && form.phone) {
      if (form.line1 && form.city && form.postalCode) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(0);
    }
  }, [form]);

  const shippingCost = useMemo(() => {
    if (shippingMethod === 'express') return 199;
    return subtotal >= 2999 ? 0 : 99;
  }, [shippingMethod, subtotal]);

  const discount = couponApplied?.discount ?? 0;
  const total = Math.max(subtotal - discount, 0) + shippingCost;

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function applyCoupon() {
    if (!coupon.trim()) return;
    setCouponStatus('checking');
    try {
      const res = await fetch('/api/coupon/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponStatus('error');
        setCouponApplied(null);
        toast('Invalid or expired coupon code', 'error');
        return;
      }
      setCouponApplied({ code: coupon.toUpperCase(), discount: data.discount });
      setCouponStatus('idle');
      toast(`Coupon ${coupon.toUpperCase()} applied — ${formatPrice(data.discount)} off!`, 'success');
    } catch {
      setCouponStatus('error');
      toast('Something went wrong. Try again.', 'error');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { name: form.name, email: form.email, phone: form.phone },
          address: {
            line1: form.line1, line2: form.line2, city: form.city,
            state: form.state, postalCode: form.postalCode, country: 'India',
          },
          items: lines.map((l) => ({ productId: l.productId, size: l.size, color: l.color, qty: l.qty })),
          shippingMethod,
          couponCode: couponApplied?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        toast(data.error ?? 'Order failed', 'error');
        return;
      }
      clear();
      toast('Order placed successfully! 🎉', 'success');
      router.push(`/order-confirmation/${data.orderNumber}`);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="mb-4 font-display text-3xl font-black uppercase">Your bag is empty</h1>
        <MagneticButton href="/shop" variant="primary">Shop Collection</MagneticButton>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="mb-4 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">Checkout</h1>
      <StepIndicator current={currentStep} />

      {/* Loading overlay */}
      <AnimatePresence>
        {submitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-beige/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin text-orgn-orange" />
              <p className="font-display text-lg font-bold uppercase">Placing your order...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          <fieldset>
            <legend className="mb-4 font-display text-lg font-bold uppercase">Contact</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Full name" value={form.name} onChange={(e) => updateField('name', e.target.value)} className="input-field sm:col-span-2" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="input-field" />
              <input required type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="input-field" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-display text-lg font-bold uppercase">Shipping Address</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="Address line 1" value={form.line1} onChange={(e) => updateField('line1', e.target.value)} className="input-field sm:col-span-2" />
              <input placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => updateField('line2', e.target.value)} className="input-field sm:col-span-2" />
              <input required placeholder="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} className="input-field" />
              <select required value={form.state} onChange={(e) => updateField('state', e.target.value)} className="input-field">
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input required placeholder="Postal code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="input-field" />
              <input disabled value="India" className="input-field opacity-60" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-display text-lg font-bold uppercase">Shipping Method</legend>
            <div className="flex flex-col gap-3">
              <label className={`flex cursor-pointer items-center justify-between border-2 p-4 transition-all ${shippingMethod === 'standard' ? 'border-ink shadow-orgn-sm' : 'border-ink/20 hover:border-ink/40'}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="accent-orgn-orange" />
                  <span>
                    <span className="block font-semibold">Standard Shipping</span>
                    <span className="block text-xs text-ink/50">3–6 business days</span>
                  </span>
                </span>
                <span className="font-semibold">{subtotal >= 2999 ? <span className="text-orgn-orange">Free</span> : formatPrice(99)}</span>
              </label>
              <label className={`flex cursor-pointer items-center justify-between border-2 p-4 transition-all ${shippingMethod === 'express' ? 'border-ink shadow-orgn-sm' : 'border-ink/20 hover:border-ink/40'}`}>
                <span className="flex items-center gap-3">
                  <input type="radio" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="accent-orgn-orange" />
                  <span>
                    <span className="block font-semibold">Express Shipping</span>
                    <span className="block text-xs text-ink/50">1–3 business days</span>
                  </span>
                </span>
                <span className="font-semibold">{formatPrice(199)}</span>
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 font-display text-lg font-bold uppercase">Payment</legend>
            <div className="flex items-center gap-3 border-2 border-ink/20 bg-offwhite p-4 text-sm text-ink/70">
              <Lock className="h-4 w-4 flex-shrink-0 text-orgn-orange" />
              Cash on Delivery — pay when your order arrives. Online payment is coming soon.
            </div>
          </fieldset>
        </div>

        <div>
          {/* Mobile summary toggle */}
          <button
            type="button"
            onClick={() => setShowSummary((s) => !s)}
            className="mb-4 flex w-full items-center justify-between text-sm font-semibold uppercase tracking-wide lg:hidden"
          >
            <span>{showSummary ? 'Hide' : 'Show'} Order Summary</span>
            <span className="font-display text-lg">{formatPrice(total)}</span>
          </button>

          <div className={`h-fit border-2 border-ink bg-offwhite p-6 shadow-orgn-sm ${showSummary ? '' : 'hidden lg:block'}`}>
            <h2 className="mb-4 font-display text-xl font-bold uppercase">Order Summary</h2>
            <ul className="mb-4 flex flex-col gap-3 border-b border-ink/10 pb-4">
              {lines.map((l) => (
                <li key={`${l.productId}-${l.size}-${l.color}`} className="flex justify-between text-sm">
                  <span className="text-ink/70">
                    {l.name} <span className="text-ink/40">×{l.qty}</span>
                    {(l.size || l.color) && <span className="block text-xs text-ink/40">{[l.size, l.color].filter(Boolean).join(' / ')}</span>}
                  </span>
                  <span className="flex-shrink-0 font-semibold">{formatPrice(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <input
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
              <button type="button" onClick={applyCoupon} disabled={couponStatus === 'checking'} className="border-2 border-ink px-4 text-sm font-semibold uppercase transition-colors hover:bg-ink hover:text-beige">
                {couponStatus === 'checking' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
              </button>
            </div>
            {couponApplied && (
              <p className="mb-4 flex items-center gap-1 text-xs font-semibold text-orgn-orange">
                <Check className="h-3.5 w-3.5" /> {couponApplied.code} applied
              </p>
            )}

            <div className="flex flex-col gap-2 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-orgn-orange"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
              <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span>{shippingCost === 0 ? <span className="text-orgn-orange">Free</span> : formatPrice(shippingCost)}</span></div>
              <div className="mt-2 flex justify-between border-t border-ink/10 pt-2 font-display text-lg font-bold uppercase">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>

            {error && <p className="mt-4 text-sm text-orgn-orange">{error}</p>}

            <div className="mt-6">
              <MagneticButton type="submit" variant="primary" className="w-full" loading={submitting}>
                Place Order
              </MagneticButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
