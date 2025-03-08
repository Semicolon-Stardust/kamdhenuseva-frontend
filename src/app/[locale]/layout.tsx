import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from './provider';
import Header from '@/components/ui/header/header';
import Footer from '@/components/ui/footer/footer';

export const metadata: Metadata = {
  title: 'DAYA - Kamdhenuseva',
  description:
    'Kamdhenuseva is an initiative by Daya Devraha Ashram dedicated to the welfare of cows. Your contributions help provide food, shelter, and medical care to support and protect these sacred beings.',
};

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { children } = props;

  const { locale } = params;

  setRequestLocale(locale);

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <section lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
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
            <Footer />
          </ThemeProvider>
        </Providers>
      </NextIntlClientProvider>
    </section>
  );
}
