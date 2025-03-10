'use client';

import { useState, useMemo } from 'react';
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
import Loader from '@/components/ui/loader';

export default function CowsPage() {
  const t = useTranslations('CowsPage');
  const fetchCows = useAuthStore((state) => state.fetchCows);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState({
    sick: false,
    aged: false,
    adopted: false,
  });

  const [sortField, setSortField] = useState<'name-asc' | 'name-desc'>(
    'name-asc',
  );

  const labels = {
    sick: 'Sick',
    aged: 'Aged',
    adopted: 'Adopted',
  };

  const {
    data: cows,
    isLoading,
    error,
  } = useQuery<Cow[]>({
    queryKey: ['cows'],
    queryFn: async () => {
      await fetchCows();
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  // Filtering and Sorting Logic
  const filteredAndSortedCows = useMemo(() => {
    if (!cows) return [];

    // Filtering cows based on search query and selected filters
    const filteredCows = cows.filter((cow) => {
      return (
        (!searchQuery ||
          cow.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedFilter.sick || cow.sicknessStatus) &&
        (!selectedFilter.aged || cow.agedStatus) &&
        (!selectedFilter.adopted || cow.adoptionStatus)
      );
    });

    // Sorting cows based on the selected sort field
    return filteredCows.sort((a, b) => {
      if (sortField === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortField === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });
  }, [cows, searchQuery, selectedFilter, sortField]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-6">
        <Breadcrumb>
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
      </nav>

      <header className="text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">{t('heading')}</h1>
        <p className="mt-2 text-gray-600 sm:text-lg">{t('description')}</p>
      </header>

      {/* Search, Filter, and Sorting */}
      <section className="mt-6 flex flex-row items-center justify-between gap-4 sm:flex-row">
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
      </section>

      {/* Loading & Error Handling */}
      {isLoading && <Loader />}
      {error && (
        <div className="mt-4 text-center text-red-500">
          Error: {error instanceof Error ? error.message : error}
        </div>
      )}

      {/* Display Cows */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredAndSortedCows.length > 0 ? (
          filteredAndSortedCows.map((cow) => (
            <CowCard key={cow._id} cow={cow} link={`donate/${cow._id}`} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No cows found.
          </p>
        )}
      </section>
    </main>
  );
}
