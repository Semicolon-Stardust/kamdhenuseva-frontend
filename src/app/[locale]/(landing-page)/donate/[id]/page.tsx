'use client';

import { use } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
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

  if (isLoading) return <Loader />;
  if (isError || !cowsData) return notFound();

  // Find the cow using the dynamic id from the URL
  const cow = cowsData.find((cow) => cow._id === id);
  if (!cow) return notFound();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-6">
        <Breadcrumb>
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
      </nav>

      {/* Product Title & Image Section */}
      <section className="flex flex-col items-center sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-lg">
          <h1 className="text-3xl font-bold sm:text-4xl">{cow.name}</h1>
          <p className="mt-2 text-gray-600">
            {t('description', { name: cow.name })}
          </p>

          {/* Cow Details */}
          <div className="mt-4 rounded-lg border bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold">{t('cowDetails')}</h2>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="font-medium">{t('isSick')}:</span>
                <span
                  className={`ml-2 ${cow.sicknessStatus ? 'text-red-600' : 'text-green-600'}`}
                >
                  {cow.sicknessStatus ? t('yes') : t('no')}
                </span>
              </li>
              <li className="flex items-center">
                <span className="font-medium">{t('gender')}:</span>
                <span className="ml-2">{cow.gender}</span>
              </li>
              <li className="flex items-center">
                <span className="font-medium">{t('isAged')}:</span>
                <span
                  className={`ml-2 ${cow.agedStatus ? 'text-red-600' : 'text-green-600'}`}
                >
                  {cow.agedStatus ? t('yes') : t('no')}
                </span>
              </li>
              <li className="flex items-center">
                <span className="font-medium">{t('adoptionStatus')}:</span>
                <span
                  className={`ml-2 ${cow.adoptionStatus ? 'text-blue-600' : 'text-green-600'}`}
                >
                  {cow.adoptionStatus ? t('adopted') : t('available')}
                </span>
              </li>
            </ul>

            {/* Donate Button (Spans full width of div) */}
            <Button variant="default" className="mt-6 w-full py-3 text-lg">
              {t('donateNow')}
            </Button>
          </div>
        </div>

        {/* Larger Cow Image */}
        <Image
          src={cow.photo || '/assets/donate/placeholder.png'}
          alt={cow.name}
          width={550}
          height={450}
          className="object-fit mt-6 rounded-lg shadow-lg sm:mt-0"
        />
      </section>

      {/* Highlights Section */}
      <section className="mt-12 rounded-lg border bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold">{t('highlights')}</h2>
        <div className="mt-4 space-y-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold">{t('descriptionLabel')}</h3>
            <p className="text-gray-700">{cow.description}</p>
          </div>

          {/* Benefits of Donating */}
          <div>
            <h3 className="font-semibold">{t('benefitsOfDonating')}</h3>
            <ul className="ml-4 list-disc text-gray-700">
              <li>{t('supportAnimalWelfare')}</li>
              <li>{t('taxDeduction')}</li>
              <li>{t('spiritualBlessings')}</li>
            </ul>
          </div>

          {/* Benefits for the Cow */}
          <div>
            <h3 className="font-semibold">{t('benefitsForCow')}</h3>
            <ul className="ml-4 list-disc text-gray-700">
              <li>{t('nutritiousFood')}</li>
              <li>{t('properMedicalCare')}</li>
              <li>{t('safeShelter')}</li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="font-semibold">{t('disclaimer')}</h3>
            <p className="text-gray-600">{t('disclaimerText')}</p>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold">{t('customerCare')}</h3>
            <p className="text-gray-600">
              {t('contactUs')}:{' '}
              <a
                href="mailto:kamdhenuseva@dayadevraha.com"
                className="text-blue-500"
              >
                kamdhenuseva@dayadevraha.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
