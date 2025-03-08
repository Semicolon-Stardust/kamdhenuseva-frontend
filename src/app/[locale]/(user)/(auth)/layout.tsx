import Footer from '@/components/ui/footer/footer';
import Header from '@/components/ui/header/header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header
        headerData={{
          logoSrc: '/logo.png',
          logoText: 'Daya Devraha',
          links: [
            { linkName: 'Home', href: '/' },
            { linkName: 'About', href: '/about' },
            { linkName: 'Contact', href: '/contact' },
          ],
          ctaButtons: {
            loginText: 'Login',
            registerText: 'Register',
            loginHref: '/login',
            registerHref: '/register',
          },
        }}
      />
      {children}
    </div>
  );
}
