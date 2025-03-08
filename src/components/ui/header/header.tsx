'use client';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Button } from '../button';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'bg-primary top-0 left-0 z-50 w-full select-none md:fixed dark:bg-black',
        scrolled
          ? 'border-b border-gray-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-md transition-shadow duration-500 dark:border-gray-700 dark:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)]'
          : 'transition-shadow duration-500',
      )}
    >
      <Navbar />
    </header>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Header');

  const linksData = [
    { linkName: t('links.about'), href: '/about' },
    { linkName: t('links.donate'), href: '/donate' },
    { linkName: t('links.contact'), href: '/contact' },
  ];

  return (
    <div className="flex flex-col items-center justify-between px-5 py-1 md:flex-row md:px-20 lg:px-40">
      <div className="flex w-full items-center justify-between md:w-auto">
        <Link href="/" className="flex items-center gap-1">
          {/* Daya Logo */}
          <Image
            src="/logo.png"
            alt="Daya Logo"
            width={60}
            height={60}
            priority
            className="h-14 w-14 p-1 lg:h-16 lg:w-16"
          />
          <h1 className="text-2xl font-bold text-white lg:text-3xl dark:text-white">
            {t('logo')}
          </h1>
        </Link>

        {/* Hamburger Button for Mobile */}
        <div className="md:hidden">
          <Button
            variant={'link'}
            className="bg-accent text-lg font-[300] text-white dark:bg-white dark:text-black"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-5 md:flex">
        <Links links={linksData} />
        <CTAButtons />
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="mt-10 flex w-full flex-col items-center gap-5 md:hidden">
          <Links links={linksData} />
          <CTAButtons />
        </nav>
      )}
    </div>
  );
}

interface LinkProps {
  links: {
    linkName: string;
    href: string;
  }[];
}

function Links({ links }: LinkProps) {
  return (
    <ul className="flex items-center">
      {links.map((link) => (
        <li key={link.href}>
          <Button
            variant={'link'}
            effect={'hoverUnderline'}
            className="text-lg font-[300] text-white dark:text-white"
          >
            <Link href={link.href}>{link.linkName}</Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}

function CTAButtons() {
  return (
    <div className="flex gap-5 pb-4 md:pb-0">
      <Link href="/en/login">
        <Button variant={'default'} effect={'ringHover'}>
          Login
        </Button>
      </Link>
      <Link href="/en/register">
        <Button variant={'default'} effect={'ringHover'}>
          Register
        </Button>
      </Link>
    </div>
  );
}
