'use client';

import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Tag, FileText, Image as ImageIcon,
  LogOut, Menu, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/content', label: 'Content', icon: FileText },
  { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
];

export function AdminSidebar({ userLabel, orderCount, lowStockCount }: { userLabel: string; orderCount?: number; lowStockCount?: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  function getBadge(href: string) {
    if (href === '/admin/orders' && orderCount && orderCount > 0) return orderCount;
    return null;
  }

  const navList = (isCollapsed: boolean) => (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {NAV.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        const Icon = item.icon;
        const badge = getBadge(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              'group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200',
              active
                ? 'bg-ink text-beige shadow-orgn-sm'
                : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
            )}
          >
            <Icon className="h-4 w-4 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
            {badge != null && (
              <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orgn-orange px-1.5 text-[10px] font-bold text-ink">
                {badge}
              </span>
            )}
            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-beige opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-ink/10 bg-offwhite p-4 lg:hidden">
        <div className="flex items-center gap-2">
          <NextImage src="/brand/orgn-mark.png" alt="" width={22} height={22} className="rounded" />
          <span className="font-display text-xl font-black text-pop-xs">ORGN</span>
        </div>
        <button onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu className="h-6 w-6" /></button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden flex-shrink-0 flex-col border-r border-ink/10 bg-offwhite transition-all duration-300 lg:flex',
          collapsed ? 'w-[4.5rem]' : 'w-64'
        )}
      >
        <div className="border-b border-ink/10 p-6">
          <div className="flex items-center gap-2">
            <NextImage src="/brand/orgn-mark.png" alt="" width={26} height={26} className="rounded" />
            {!collapsed && <span className="font-display text-2xl font-black text-pop-xs">ORGN</span>}
          </div>
          {!collapsed && (
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-ink/40">Admin Panel</p>
          )}
        </div>

        {navList(collapsed)}

        <div className="border-t border-ink/10 p-4">
          {!collapsed && <p className="mb-2 truncate px-4 text-xs text-ink/50">{userLabel}</p>}
          <button
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : undefined}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-ink/5 hover:text-orgn-orange"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="border-t border-ink/10 p-3 text-ink/40 transition hover:text-ink"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="mx-auto h-4 w-4" /> : <ChevronLeft className="mx-auto h-4 w-4" />}
        </button>
      </aside>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-full max-w-xs flex-col bg-offwhite shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/10 p-4">
                <div className="flex items-center gap-2">
                  <NextImage src="/brand/orgn-mark.png" alt="" width={22} height={22} className="rounded" />
                  <span className="font-display text-xl font-black text-pop-xs">ORGN</span>
                </div>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="h-6 w-6" /></button>
              </div>
              {navList(false)}
              <div className="border-t border-ink/10 p-4">
                <p className="mb-2 truncate px-4 text-xs text-ink/50">{userLabel}</p>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-orgn-orange"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
