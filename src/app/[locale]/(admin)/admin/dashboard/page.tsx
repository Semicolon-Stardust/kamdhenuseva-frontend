'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import CowCard from '@/components/cows/cow-card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// Function to get a greeting based on the current time
function getGreeting(t: (key: string) => string) {
  const hour = new Date().getHours();
  if (hour < 12) return t('AdminDashboardPage.greeting.morning');
  if (hour < 18) return t('AdminDashboardPage.greeting.afternoon');
  return t('AdminDashboardPage.greeting.evening');
}

const AdminDashboardPage: React.FC = () => {
  const t = useTranslations();
  const admin = useAuthStore((state) => state.admin);
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
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const totalPages = cowsData ? Math.ceil(cowsData.length / pageSize) : 0;
  const paginatedCows = useMemo(() => {
    if (!cowsData) return [];
    const start = (currentPage - 1) * pageSize;
    return cowsData.slice(start, start + pageSize);
  }, [cowsData, currentPage]);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="text-foreground mt-10 min-h-screen">
      <main className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Greeting */}
        <div>
          {admin && (
            <h1 className="text-3xl font-bold text-black">
              {getGreeting(t)},{' '}
              {admin?.name?.split(' ')[0] || t('AdminDashboardPage.user')}
            </h1>
          )}
        </div>

        <div className="px-4 py-6 sm:px-0">
          {/* Profile Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t('AdminDashboardPage.profile')}
            </h2>
            {admin ? (
              <div className="mt-4">
                <p>
                  <span className="font-medium">
                    {t('AdminDashboardPage.name')}:
                  </span>{' '}
                  {admin.name}
                </p>
                <p>
                  <span className="font-medium">
                    {t('AdminDashboardPage.email')}:
                  </span>{' '}
                  {admin.email}
                </p>
                <p>
                  <span className="font-medium">
                    {t('AdminDashboardPage.verified')}:
                  </span>{' '}
                  {admin.isVerified
                    ? t('AdminDashboardPage.yes')
                    : t('AdminDashboardPage.no')}
                </p>
                {admin.dateOfBirth && (
                  <p>
                    <span className="font-medium">
                      {t('AdminDashboardPage.dateOfBirth')}:
                    </span>{' '}
                    {admin.dateOfBirth}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-4">{t('AdminDashboardPage.noAdminData')}</p>
            )}
          </section>

          {/* Donation History Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t('AdminDashboardPage.donationHistory')}
            </h2>
            {donationLoading ? (
              <p>{t('AdminDashboardPage.loadingDonationHistory')}</p>
            ) : donationError ? (
              <p className="text-red-500">
                {t('AdminDashboardPage.errorLoadingDonationHistory')}
              </p>
            ) : donationHistoryData && donationHistoryData.length > 0 ? (
              <div className="bg-card mt-4 rounded-lg p-6 shadow">
                <ul>
                  {donationHistoryData.map((donation: any) => (
                    <li
                      key={donation._id}
                      className="border-b border-gray-200 py-2"
                    >
                      <p>
                        <span className="font-medium">
                          {t('AdminDashboardPage.amount')}:
                        </span>{' '}
                        ${donation.amount}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t('AdminDashboardPage.tier')}:
                        </span>{' '}
                        {donation.tier}
                      </p>
                      <p>
                        <span className="font-medium">
                          {t('AdminDashboardPage.type')}:
                        </span>{' '}
                        {donation.donationType}
                      </p>
                      {donation.createdAt && (
                        <p>
                          <span className="font-medium">
                            {t('AdminDashboardPage.date')}:
                          </span>{' '}
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-4">
                {t('AdminDashboardPage.noDonationHistory')}
              </p>
            )}
          </section>

          {/* Cows Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">
              {t('AdminDashboardPage.cows')}
            </h2>
            {cowsLoading ? (
              <p>{t('AdminDashboardPage.loadingCows')}</p>
            ) : cowsError ? (
              <p className="text-red-500">
                {t('AdminDashboardPage.errorLoadingCows')}
              </p>
            ) : cowsData && cowsData.length > 0 ? (
              <>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {paginatedCows.map((cow: any) => (
                    <CowCard
                      key={cow._id}
                      cow={cow}
                      link={`/admin/cows/${cow._id}/edit`}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <nav className="mt-8">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious onClick={handlePrevious} />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => handlePageClick(page)}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext onClick={handleNext} />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </nav>
                )}
              </>
            ) : (
              <p className="mt-4">{t('AdminDashboardPage.noCowsAvailable')}</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
