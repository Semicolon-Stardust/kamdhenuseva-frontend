/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Users, Leaf, Shield } from 'lucide-react'; // Lucide icons
import CowCard from '@/components/cows/cow-card';
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
  if (hour < 12) return t('AdminDashboardPage.greeting.morning');
  if (hour < 18) return t('AdminDashboardPage.greeting.afternoon');
  return t('AdminDashboardPage.greeting.evening');
}

const AdminDashboardPage: React.FC = () => {
  const t = useTranslations();
  const params = useParams();
  const locale = params.locale || 'en';
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
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>
                {t('breadcrumb.home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/admin`}>
                {t('breadcrumb.admin')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('breadcrumb.dashboard')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Greeting */}
        <div className="mb-6">
          {admin && (
            <h1 className="text-3xl font-bold text-black">
              {getGreeting(t)},{' '}
              {admin?.name?.split(' ')[0] || t('AdminDashboardPage.user')}
            </h1>
          )}
        </div>

        {/* Quick Action Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Cows Card */}
          <Link href={`/admin/dashboard/cows`}>
            <div className="bg-primary text-primary-foreground hover:bg-primary-dark flex cursor-pointer items-center justify-between rounded-lg p-6 shadow transition">
              <div>
                <h2 className="text-xl font-semibold">Manage Cows</h2>
                <p className="text-sm opacity-90">
                  View and manage all registered cows.
                </p>
              </div>
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </Link>

          {/* Users Card */}
          <Link href={`/admin/dashboard/users`}>
            <div className="bg-primary text-primary-foreground hover:bg-primary-dark flex cursor-pointer items-center justify-between rounded-lg p-6 shadow transition">
              <div>
                <h2 className="text-xl font-semibold">Manage Users</h2>
                <p className="text-sm opacity-90">
                  View and manage user accounts.
                </p>
              </div>
              <Users className="h-10 w-10 text-white" />
            </div>
          </Link>

          {/* Moderators Card */}
          <Link href={`/admin/dashboard/moderators`}>
            <div className="bg-primary text-primary-foreground hover:bg-primary-dark flex cursor-pointer items-center justify-between rounded-lg p-6 shadow transition">
              <div>
                <h2 className="text-xl font-semibold">Manage Moderators</h2>
                <p className="text-sm opacity-90">
                  Assign and manage moderator roles.
                </p>
              </div>
              <Shield className="h-10 w-10 text-white" />
            </div>
          </Link>
        </div>

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
                    link={`/admin/dashboard/cows/${cow._id}/edit`}
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
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => handlePageClick(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
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
      </main>
    </div>
  );
};

export default AdminDashboardPage;
