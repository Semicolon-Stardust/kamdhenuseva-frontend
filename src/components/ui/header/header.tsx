'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Button } from '../button';
import { Menu, X, User } from 'lucide-react';
import Image from 'next/image';
// Import your Radix Dropdown primitives (adjust the path as needed)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export interface HeaderData {
  logoSrc: string;
  logoText: string;
  links: { linkName: string; href: string }[];
  ctaButtons: {
    loginText: string;
    registerText: string;
    loginHref: string;
    registerHref: string;
  };
}

export interface AuthData {
  isAuthenticated: boolean;
  userName: string;
  dropdownOptions?: {
    value: string;
    label: string;
    href?: string;
    onClick?: () => void;
  }[];
}

interface HeaderProps {
  headerData?: HeaderData;
  authData?: AuthData;
}

export default function Header({ headerData, authData }: HeaderProps) {
  // Use fallback static header data if none is passed.
  const staticHeaderData: HeaderData = headerData || {
    logoSrc: '/logo.png',
    logoText: 'Daya Devraha',
    links: [
      { linkName: 'Home', href: '/' },
      { linkName: 'About Us', href: '/about' },
      { linkName: 'Donate', href: '/donate' },
      { linkName: 'Contact Us', href: '/contact' },
    ],
    ctaButtons: {
      loginText: 'Login',
      registerText: 'Register',
      loginHref: '/login',
      registerHref: '/register',
    },
  };

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
      <Navbar headerData={staticHeaderData} authData={authData} />
    </header>
  );
}

interface NavbarProps {
  headerData: HeaderData;
  authData?: AuthData;
}

function Navbar({ headerData, authData }: NavbarProps) {
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
            variant="link"
            className="bg-accent text-lg font-[300] text-white dark:bg-white dark:text-black"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-5 md:flex">
        <Links links={headerData.links} />
        {authData && authData.isAuthenticated ? (
          <UserDropdown authData={authData} />
        ) : (
          <CTAButtons ctaButtons={headerData.ctaButtons} />
        )}
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="mt-10 flex w-full flex-col items-center gap-5 md:hidden">
          {/* Navigation Links */}
          <div className="flex w-full flex-wrap justify-center gap-4 px-4">
            <Links links={headerData.links} />
          </div>
          {/* Authentication Controls */}
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {authData && authData.isAuthenticated ? (
              <UserDropdown authData={authData} />
            ) : (
              <CTAButtons ctaButtons={headerData.ctaButtons} />
            )}
          </div>
        </nav>
      )}
    </div>
  );
}

interface LinksProps {
  links: { linkName: string; href: string }[];
}

function Links({ links }: LinksProps) {
  return (
    <ul className="flex flex-wrap justify-center md:flex-nowrap">
      {links.map((link) => (
        <li key={link.href}>
          <Button
            variant="link"
            effect="hoverUnderline"
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
    onClick?: () => void;
  };
}

function CTAButtons({ ctaButtons }: CTAButtonsProps) {
  const buttons = [
    {
      text: ctaButtons.loginText,
      href: ctaButtons.loginHref,
      onClick: ctaButtons.onClick || (() => {}),
    },
    {
      text: ctaButtons.registerText,
      href: ctaButtons.registerHref,
      onClick: ctaButtons.onClick || (() => {}),
    },
  ];
  return (
    <div className="flex gap-5 pb-4 md:pb-0">
      {buttons.map((button) => (
        <Link key={button.href} href={button.href}>
          <Button
            variant="default"
            effect="ringHover"
            onClick={button.onClick}
            className={cn('cursor-pointer')}
          >
            {button.text}
          </Button>
        </Link>
      ))}
    </div>
  );
}

interface UserDropdownProps {
  authData: AuthData;
}

function UserDropdown({ authData }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-background inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
        <User size={20} />
        <span>{authData.userName}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 cursor-pointer">
        {authData.dropdownOptions?.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onSelect={() => option.onClick && option.onClick()}
          >
            {option.href ? (
              <Link href={option.href} className="block w-full">
                {option.label}
              </Link>
            ) : (
              option.label
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
