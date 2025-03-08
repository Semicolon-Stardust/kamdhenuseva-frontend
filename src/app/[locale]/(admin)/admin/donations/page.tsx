'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';

export default function AdminDonationList() {
  const fetchAllDonations = useAuthStore((state) => state.fetchAllDonations);
  const donations = useAuthStore((state) => state.donations);

  const { isLoading, error } = useQuery({
    queryKey: ['adminDonations'],
    queryFn: async () => {
      await fetchAllDonations();
      return useAuthStore.getState().donations;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <h1 className="mb-4 text-2xl font-bold">Admin - Donation List</h1>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div>Error: {error instanceof Error ? error.message : error}</div>
      )}
      <ul>
        {donations.map((donation) => (
          <li key={donation._id} className="mb-2 border-b pb-2">
            Donation from User: {donation.user} - Amount: {donation.amount} -
            Tier: {donation.tier}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
