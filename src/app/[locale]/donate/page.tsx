'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore, type Cow } from '@/stores/authStore';
import CowCard from '@/components/cows/cow-card';
import SearchBar from '@/components/cows/searchbar';
import FilterOptions from '@/components/cows/filter';
import SortOptions from '@/components/cows/sort';
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

  // States for search, filter, and sorting (Pagination Removed)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({
    sick: false,
    aged: false,
    adopted: false,
  });
  const labels = {
    sick: 'Sick',
    aged: 'Aged',
    adopted: 'Adopted',
  };
  const [sortField, setSortField] = useState('name');

  // Fetch cows without pagination
  const {
    data: cows,
    isLoading,
    error,
  } = useQuery<Cow[]>({
    queryKey: ['cows', searchQuery, selectedFilter, sortField],
    queryFn: async () => {
      await fetchCows({
        name: searchQuery,
        sick: selectedFilter.sick,
        old: selectedFilter.aged,
        adopted: selectedFilter.adopted,
        sort: sortField,
      });
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

      {/* Search, Filter, and Sorting */}
      <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <FilterOptions
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          labels={labels}
        />
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={t('search.placeholder')}
        />
        <SortOptions
          sortField={sortField}
          setSortField={setSortField}
          labels={{
            asc: 'A-Z',
            desc: 'Z-A',
          }}
        />
      </div>

      {/* Loading & Error Handling */}
      {isLoading && <div>Loading...</div>}
      {error && (
        <div>Error: {error instanceof Error ? error.message : error}</div>
      )}

      {/* Grid layout for cows */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {cows?.map((cow) => (
          <CowCard key={cow._id} cow={cow} link={`donate/${cow._id}`} />
        ))}
      </div>
    </section>
  );
}
