import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AdoptACowCTASection() {
  const t = useTranslations('HomePage.adoptACowCTA');

  return (
    <section className="bg-primary flex w-full flex-col items-center justify-center px-4 py-12 text-white sm:px-6 sm:py-16 md:px-12 md:py-20">
      <TypewriterEffect
        words={[
          { text: t('headlinePart1'), className: 'text-background' },
          { text: t('headlinePart2'), className: 'text-white' },
        ]}
        className="mb-4 text-xl font-bold sm:text-3xl md:text-5xl"
      />
      <p className="mb-8 max-w-2xl text-center text-base sm:text-lg md:text-xl">
        {t('description')}
      </p>

      <Button
        variant="default"
        effect="shineHover"
        asChild
        className="mt-4 px-6 py-3 text-base sm:mt-6 sm:px-8 sm:py-4 sm:text-lg"
      >
        <Link href="/en/donate">{t('buttonText')}</Link>
      </Button>
    </section>
  );
}
