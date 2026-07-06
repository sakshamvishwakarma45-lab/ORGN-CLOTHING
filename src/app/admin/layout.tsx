export const metadata = {
  title: { default: 'Admin | ORGN', template: '%s | ORGN Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-offwhite font-body text-ink">{children}</div>;
}
