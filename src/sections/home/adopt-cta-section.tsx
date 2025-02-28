import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AdoptACowCTASection() {
  const t = useTranslations('HomePage.adoptACowCTA');

  return (
    <section className="bg-primary flex w-full flex-col items-center justify-center py-16 text-white">
      <TypewriterEffect
        words={[
          { text: t('headlinePart1'), className: 'text-background' },
          { text: t('headlinePart2'), className: 'text-white' },
        ]}
        className="mb-4"
      />
      <p className="mb-8 max-w-2xl text-center text-lg">{t('description')}</p>

      <Button variant="default" effect="shineHover" asChild>
        <Link href="/en/donate">{t('buttonText')}</Link>
      </Button>
    </section>
  );
}
