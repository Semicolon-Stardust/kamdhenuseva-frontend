'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';
import { CowCarousel } from '@/components/cows/cow-carousel';
import Loader from '@/components/ui/loader';

export function CowCarouselSection() {
  const t = useTranslations('HomePage.cowCarousel');
  const fetchCows = useAuthStore((state) => state.fetchCows);

  // Use TanStack Query to fetch cows data
  const {
    data: cowsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cows'],
    queryFn: async () => {
      await fetchCows();
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (isError || !cowsData)
    return (
      <div className="w-full text-center text-2xl font-semibold text-red-500">
        Error fetching cows data.
      </div>
    );

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h2 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        {t('heading')}
      </h2>
      <p className="mt-2 text-center text-gray-600 sm:text-lg">
        {t('description')}
      </p>
      <CowCarousel cows={cowsData} limit={10} />
    </section>
  );
}
