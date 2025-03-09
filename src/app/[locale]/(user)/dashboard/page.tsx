'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';

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
  // Extract functions from the auth store
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
      // Use getState() to ensure we get the latest updated donations
      return useAuthStore.getState().donations;
    },
    staleTime: 300000, // 5 minutes
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
      // Use getState() to get the latest cows from the store
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

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

          {/* Cows Section */}
          <section className="mb-8">
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-semibold"
            >
              Cows
            </motion.h2>
            {cowsLoading ? (
              <motion.p variants={itemVariants}>Loading cows...</motion.p>
            ) : cowsError ? (
              <motion.p variants={itemVariants} className="text-red-500">
                Error loading cows.
              </motion.p>
            ) : cowsData && cowsData.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {cowsData.map((cow: any) => (
                  <motion.div
                    key={cow._id}
                    variants={itemVariants}
                    className="bg-card rounded-lg p-4 shadow"
                  >
                    <motion.h3 className="text-xl font-semibold">
                      {cow.name}
                    </motion.h3>
                    {cow.photo && (
                      <motion.img
                        src={cow.photo}
                        alt={cow.name}
                        className="mt-2 h-48 w-full rounded object-cover"
                      />
                    )}
                    <motion.p className="mt-2">
                      <span className="font-medium">Age:</span> {cow.age}
                    </motion.p>
                    <motion.p className="mt-2">
                      <span className="font-medium">Sickness Status:</span>{' '}
                      {cow.sicknessStatus ? 'Sick' : 'Healthy'}
                    </motion.p>
                    <motion.p className="mt-2">
                      <span className="font-medium">Adoption Status:</span>{' '}
                      {cow.adoptionStatus ? 'Adopted' : 'Available'}
                    </motion.p>
                  </motion.div>
                ))}
              </motion.div>
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
