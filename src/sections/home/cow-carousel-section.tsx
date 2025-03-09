'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cows } from '@/data/cows';
import { CowCarousel } from '@/components/cows/cow-carousel';

export function CowCarouselSection() {
  const t = useTranslations('HomePage.cowCarousel');

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t('heading')}
      </h2>
      <p className="mt-2 text-center text-gray-600 sm:text-lg">
        {t('description')}
      </p>
      <CowCarousel cows={cows} limit={10} />
    </section>
  );
}
