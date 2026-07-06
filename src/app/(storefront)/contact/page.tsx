import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import type { Metadata } from 'next';
import { Reveal } from '@/components/ui/Reveal';
import { ContactForm } from '@/components/storefront/ContactForm';

export const metadata: Metadata = { title: 'Contact' };

const CONTACT = {
  email: 'sakshamvishwa36t@gmail.com',
  phone: '+91 73897 57675',
  address: 'Shantinagar, Jagdalpur, Chhattisgarh, 494001',
  instagram: 'https://www.instagram.com/orgnclothing.in/',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Reveal className="mb-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">Get in touch</p>
        <h1 className="font-display text-5xl font-black uppercase tracking-tight sm:text-6xl">Contact Us</h1>
      </Reveal>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <Reveal>
          <ul className="flex flex-col gap-6">
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-2 border-ink shadow-orgn-sm"><Mail className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Email</p>
                <a href={`mailto:${CONTACT.email}`} className="text-lg font-semibold hover:text-orgn-orange">{CONTACT.email}</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-2 border-ink shadow-orgn-sm"><Phone className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Phone</p>
                <a href="tel:+917389757675" className="text-lg font-semibold hover:text-orgn-orange">{CONTACT.phone}</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-2 border-ink shadow-orgn-sm"><MapPin className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Studio</p>
                <p className="text-lg font-semibold">{CONTACT.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center border-2 border-ink shadow-orgn-sm"><Instagram className="h-5 w-5" /></span>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Instagram</p>
                <a href={CONTACT.instagram} target="_blank" rel="noreferrer noopener" className="text-lg font-semibold hover:text-orgn-orange">@orgnclothing.in</a>
              </div>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <ContactForm contactEmail={CONTACT.email} />
        </Reveal>
      </div>
    </div>
  );
}
