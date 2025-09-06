'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { User } from '@supabase/supabase-js';

interface LayoutProps {
  children: ReactNode;
  user?: User | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Layout({ children, user, onLogin, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogin={onLogin} onLogout={onLogout} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
