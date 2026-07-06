import { Suspense } from 'react';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata = { title: 'Sign In' };

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-beige" />}>
      <LoginForm />
    </Suspense>
  );
}
