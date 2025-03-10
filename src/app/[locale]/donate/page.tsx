'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import CowCard from '@/components/cows/cow-card';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function CowsPage() {
  const t = useTranslations('CowsPage');

  const fetchCows = useAuthStore((state) => state.fetchCows);

  // TanStack Query to fetch cows data
  const {
    data: cowsData,
    isLoading: cowsLoading,
    error: cowsError,
  } = useQuery({
    queryKey: ['cows'],
    queryFn: async () => {
      await fetchCows();
      // Use getState() to get the latest cows from the store
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('breadcrumb')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        {t('heading')}
      </h1>
      <p className="mt-2 text-center text-gray-600 sm:text-lg">
        {t('description')}
      </p>
      {cowsLoading && <div>Loading...</div>}
      {cowsError && (
        <div>
          Error: {cowsError instanceof Error ? cowsError.message : cowsError}
        </div>
      )}

      {/* Grid layout for cows */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cowsData?.map((cow: any) => (
          <CowCard key={cow._id} cow={cow} link={`donate/${cow._id}`} />
        ))}
      </div>
    </section>
  );
}
