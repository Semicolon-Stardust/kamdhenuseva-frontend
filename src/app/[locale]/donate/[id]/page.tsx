'use client';

import { use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function DonateCowPage(props: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap the params promise
  const { id } = use(props.params);

  const t = useTranslations('DonateCowPage');
  const locale = useLocale();
  const fetchCows = useAuthStore((state) => state.fetchCows);

  // Fetch cows data using TanStack Query
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

  if (isLoading) {
    // Optionally, you can return a loading spinner or similar
    return <div>Loading...</div>;
  }

  if (isError || !cowsData) {
    // If there was an error or the data is still unavailable after loading, trigger notFound
    return notFound();
  }

  // Find the cow using the dynamic id from the URL
  const cow = cowsData.find((cow) => cow._id === id);
  if (!cow) return notFound();

  return (
    <section className="mx-auto mt-14 max-w-7xl px-6 py-12">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/donate`}>Donate</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{cow.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        {t('heading', { name: cow.name })}
      </h1>

      <div className="mt-6 flex flex-col items-center justify-center">
        {/* Cow Image */}
        <Image
          src={cow.photo || '/placeholder.png'}
          alt={cow.name}
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />

        {/* Cow Details */}
        <div className="mt-6 w-full space-y-2 text-center">
          <p className="text-lg font-semibold">
            {t('isAged')}: {cow.agedStatus ? t('yes') : t('no')}
          </p>
          <p className="text-lg font-semibold">
            {t('isSick')}: {cow.sicknessStatus ? t('yes') : t('no')}
          </p>
          <p className="text-lg font-semibold">
            {t('adoptionStatus')}:{' '}
            {cow.adoptionStatus ? t('adopted') : t('available')}
          </p>
          <p className="mt-4 text-gray-700">{cow.description}</p>
        </div>

        {/* Donate Button */}
        <Button
          variant="default"
          effect="shineHover"
          className="mt-6 px-6 py-3 text-lg sm:px-8 sm:py-4"
        >
          {t('donateNow')}
        </Button>
      </div>
    </section>
  );
}
