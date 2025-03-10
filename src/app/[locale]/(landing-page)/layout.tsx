import Footer from '@/components/ui/footer/footer';
import AuthHeaderWrapper from '@/components/ui/header/AuthHeaderWrapper';
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main>
      <AuthHeaderWrapper />
      {children}
      <Footer />
    </main>
  );
}
