'use client';

import { useState } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name} via orgn website`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        required
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        className="input-field"
      />
      <input
        required
        type="email"
        placeholder="Your email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="input-field"
      />
      <textarea
        required
        rows={5}
        placeholder="How can we help?"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        className="input-field resize-none"
      />
      <MagneticButton type="submit" variant="primary">Send Message</MagneticButton>
    </form>
  );
}
