import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from './provider';
import AuthHeaderWrapper from '@/components/ui/header/AuthHeaderWrapper';
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
    <main lang={locale}>
      <NextIntlClientProvider messages={messages}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthHeaderWrapper />
            {children}
            <Footer />
          </ThemeProvider>
        </Providers>
      </NextIntlClientProvider>
    </main>
  );
}
