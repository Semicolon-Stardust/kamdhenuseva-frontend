'use client';

import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Button } from '../button';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export interface HeaderData {
  logoSrc: string;
  logoText: string;
  links: {
    linkName: string;
    href: string;
  }[];
  ctaButtons: {
    loginText: string;
    registerText: string;
    loginHref: string;
    registerHref: string;
  };
}

interface HeaderProps {
  headerData: HeaderData | undefined;
}

export default function Header({ headerData }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render a fallback while headerData is undefined.
  if (!headerData) return <div>Loading...</div>;

  return (
    <header
      className={cn(
        'bg-primary top-0 left-0 z-50 w-full select-none md:fixed dark:bg-black',
        scrolled
          ? 'border-b border-gray-200 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-md transition-shadow duration-500 dark:border-gray-700 dark:shadow-[0_35px_60px_-15px_rgba(255,255,255,0.3)]'
          : 'transition-shadow duration-500',
      )}
    >
      <Navbar headerData={headerData} />
    </header>
  );
}

interface NavbarProps {
  headerData: HeaderData;
}

function Navbar({ headerData }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between px-5 py-1 md:flex-row md:px-20 lg:px-40">
      <div className="flex w-full items-center justify-between md:w-auto">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={headerData.logoSrc}
            alt="Logo"
            width={60}
            height={60}
            priority
            className="h-14 w-14 p-1 lg:h-16 lg:w-16"
          />
          <h1 className="text-2xl font-bold text-white lg:text-3xl dark:text-white">
            {headerData.logoText}
          </h1>
        </Link>
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
        <Links links={headerData.links} />
        <CTAButtons ctaButtons={headerData.ctaButtons} />
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="mt-10 flex w-full flex-col items-center gap-5 md:hidden">
          <Links links={headerData.links} />
          <CTAButtons ctaButtons={headerData.ctaButtons} />
        </nav>
      )}
    </div>
  );
}

interface LinksProps {
  links: {
    linkName: string;
    href: string;
  }[];
}

function Links({ links }: LinksProps) {
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

interface CTAButtonsProps {
  ctaButtons: {
    loginText: string;
    registerText: string;
    loginHref: string;
    registerHref: string;
  };
}

function CTAButtons({ ctaButtons }: CTAButtonsProps) {
  const buttons = [
    { text: ctaButtons.loginText, href: ctaButtons.loginHref },
    { text: ctaButtons.registerText, href: ctaButtons.registerHref },
  ];

  return (
    <div className="flex gap-5 pb-4 md:pb-0">
      {buttons.map((button) => (
        <Link key={button.href} href={button.href}>
          <Button variant={'default'} effect={'ringHover'}>
            {button.text}
          </Button>
        </Link>
      ))}
    </div>
  );
}
