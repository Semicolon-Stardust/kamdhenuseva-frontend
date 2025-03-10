'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
      duration: 0.5,
    },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

const DashboardPage: React.FC = () => {
  // Extract functions and data from the auth store
  const user = useAuthStore((state) => state.user);
  const fetchDonationHistory = useAuthStore(
    (state) => state.fetchDonationHistory,
  );
  const fetchCows = useAuthStore((state) => state.fetchCows);

  // TanStack Query to fetch donation history
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

  // TanStack Query to fetch cows data
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-background text-foreground min-h-screen"
    >
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <motion.div className="px-4 py-6 sm:px-0" variants={sectionVariants}>
          {/* Profile Section */}
          <section className="mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold"
            >
              Profile
            </motion.h2>
            {user ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card mt-4 rounded-lg p-6 shadow"
              >
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Verified:</span>{' '}
                  {user.isVerified ? 'Yes' : 'No'}
                </p>
                {user.dateOfBirth && (
                  <p>
                    <span className="font-medium">Date of Birth:</span>{' '}
                    {user.dateOfBirth}
                  </p>
                )}
                {user.emergencyRecoveryContact && (
                  <p>
                    <span className="font-medium">Emergency Contact:</span>{' '}
                    {user.emergencyRecoveryContact}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.p variants={itemVariants} className="mt-4">
                No user data available.
              </motion.p>
            )}
          </section>

          {/* Donation History Section */}
          <section className="mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold"
            >
              Donation History
            </motion.h2>
            {donationLoading ? (
              <motion.p variants={itemVariants}>
                Loading donation history...
              </motion.p>
            ) : donationError ? (
              <motion.p variants={itemVariants} className="text-red-500">
                Error loading donation history.
              </motion.p>
            ) : donationHistoryData && donationHistoryData.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="bg-card mt-4 rounded-lg p-6 shadow"
              >
                <motion.ul>
                  {donationHistoryData.map((donation: any) => (
                    <motion.li
                      key={donation._id}
                      variants={itemVariants}
                      className="border-b border-gray-200 py-2"
                    >
                      <p>
                        <span className="font-medium">Amount:</span> $
                        {donation.amount}
                      </p>
                      <p>
                        <span className="font-medium">Tier:</span>{' '}
                        {donation.tier}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span>{' '}
                        {donation.donationType}
                      </p>
                      {donation.createdAt && (
                        <p>
                          <span className="font-medium">Date:</span>{' '}
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      )}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ) : (
              <motion.p variants={itemVariants} className="mt-4">
                No donation history available.
              </motion.p>
            )}
          </section>

          {/* Cows Section with Pagination */}
          <section className="mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold"
            >
              Cows
            </motion.h2>
            {cowsLoading ? (
              <Loader />
            ) : cowsError ? (
              <motion.p variants={itemVariants} className="text-red-500">
                Error loading cows.
              </motion.p>
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
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCowsPrevious();
                            }}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalCowsPages }, (_, i) => {
                          const page = i + 1;
                          return (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                isActive={currentCowsPage === page}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleCowsPageClick(page);
                                }}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCowsNext();
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </nav>
                )}
              </>
            ) : (
              <motion.p variants={itemVariants} className="mt-4">
                No cows available.
              </motion.p>
            )}
          </section>
        </motion.div>
      </main>
    </motion.div>
  );
};

export default DashboardPage;
