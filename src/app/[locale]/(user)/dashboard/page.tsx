/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import CowCard from '@/components/cows/cow-card';
import Loader from '@/components/ui/loader';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Function to get a greeting based on the current time
function getGreeting(t: (key: string) => string) {
  const hour = new Date().getHours();
  if (hour < 12) return t('UserDashboardPage.greeting.morning');
  if (hour < 18) return t('UserDashboardPage.greeting.afternoon');
  return t('UserDashboardPage.greeting.evening');
}

const DashboardPage: React.FC = () => {
  const t = useTranslations();
  const user = useAuthStore((state) => state.user);
  const fetchDonationHistory = useAuthStore(
    (state) => state.fetchDonationHistory,
  );
  const fetchCows = useAuthStore((state) => state.fetchCows);

  // Fetch donation history
  const {
    data: donationHistoryData,
    isLoading: donationLoading,
    error: donationError,
  } = useQuery({
    queryKey: ['donationHistory'],
    queryFn: async () => {
      await fetchDonationHistory();
      return useAuthStore.getState().donations;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  // Fetch cows data
  const {
    data: cowsData,
    isLoading: cowsLoading,
    error: cowsError,
  } = useQuery({
    queryKey: ['cows'],
    queryFn: async () => {
      await fetchCows();
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  // Pagination state for cows
  const [currentCowsPage, setCurrentCowsPage] = useState(1);
  const cowsPageSize = 8;
  const totalCowsPages = useMemo(() => {
    return cowsData ? Math.ceil(cowsData.length / cowsPageSize) : 0;
  }, [cowsData]);

  const paginatedCows = useMemo(() => {
    if (!cowsData) return [];
    const start = (currentCowsPage - 1) * cowsPageSize;
    return cowsData.slice(start, start + cowsPageSize);
  }, [cowsData, currentCowsPage]);

  const handleCowsPageClick = (page: number) => {
    setCurrentCowsPage(page);
  };

  const handleCowsPrevious = () => {
    setCurrentCowsPage((prev) => Math.max(prev - 1, 1));
  };

  const handleCowsNext = () => {
    setCurrentCowsPage((prev) => Math.min(prev + 1, totalCowsPages));
  };

  return (
    <div className="text-foreground min-h-screen">
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('breadcrumb.home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('breadcrumb.dashboard')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Greeting */}
        <div className="mb-6">
          {user && (
            <h1 className="text-3xl font-bold text-black">
              {getGreeting(t)},{' '}
              {user?.name?.split(' ')[0] || t('UserDashboardPage.user')}
            </h1>
          )}
        </div>

        <div className="px-4 py-6 sm:px-0">
          {/* Donation History Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t('UserDashboardPage.donationHistory')}
            </h2>
            {donationLoading ? (
              <Loader />
            ) : donationError ? (
              <p className="text-red-500">
                {t('UserDashboardPage.error.loading')}
              </p>
            ) : donationHistoryData && donationHistoryData.length > 0 ? (
              <ul>
                {donationHistoryData.map((donation: any) => (
                  <li
                    key={donation._id}
                    className="border-b border-gray-200 py-2"
                  >
                    <p>
                      <span className="font-medium">
                        {t('UserDashboardPage.amount')}:
                      </span>{' '}
                      ${donation.amount}
                    </p>
                    <p>
                      <span className="font-medium">
                        {t('UserDashboardPage.tier')}:
                      </span>{' '}
                      {donation.tier}
                    </p>
                    <p>
                      <span className="font-medium">
                        {t('UserDashboardPage.type')}:
                      </span>{' '}
                      {donation.donationType}
                    </p>
                    {donation.createdAt && (
                      <p>
                        <span className="font-medium">
                          {t('UserDashboardPage.date')}:
                        </span>{' '}
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4">{t('UserDashboardPage.noDonationHistory')}</p>
            )}
          </section>

          {/* Cows Section with Pagination */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t('UserDashboardPage.cows')}
            </h2>
            {cowsLoading ? (
              <Loader />
            ) : cowsError ? (
              <p className="text-red-500">
                {t('UserDashboardPage.error.loading')}
              </p>
            ) : cowsData && cowsData.length > 0 ? (
              <>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {paginatedCows.map((cow: any) => (
                    <CowCard
                      key={cow._id}
                      cow={cow}
                      link={`/donate/${cow._id}`}
                    />
                  ))}
                </div>
                {totalCowsPages > 1 && (
                  <nav className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious onClick={handleCowsPrevious} />
                        </PaginationItem>
                        {Array.from({ length: totalCowsPages }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentCowsPage === page}
                                onClick={() => handleCowsPageClick(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext onClick={handleCowsNext} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </nav>
                )}
              </>
            ) : (
              <p className="mt-4">{t('UserDashboardPage.noCowsAvailable')}</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
