import type { Metadata } from 'next';
import { Archivo, Inter } from 'next/font/google';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  variable: '--font-archivo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://orgnclothing.in'),
  title: {
    default: 'ORGN — Modern Minimal Streetwear',
    template: '%s | ORGN',
  },
  description:
    'ORGN is a modern minimal streetwear label designed in India. Heavyweight cotton, limited drops, built for everyday movement.',
  openGraph: {
    title: 'ORGN — Modern Minimal Streetwear',
    description:
      'Heavyweight cotton, limited drops, built for everyday movement. Designed in India.',
    siteName: 'ORGN',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
