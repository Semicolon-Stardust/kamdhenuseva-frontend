'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';

export default function UserCowList() {
  const fetchCows = useAuthStore((state) => state.fetchCows);
  const cows = useAuthStore((state) => state.cows);

  const { isLoading, error } = useQuery({
    queryKey: ['userCows'],
    queryFn: async () => {
      await fetchCows();
      return useAuthStore.getState().cows;
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <h1 className="mb-4 text-2xl font-bold">Cows</h1>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div>Error: {error instanceof Error ? error.message : error}</div>
      )}
      <ul>
        {cows.map((cow) => (
          <li key={cow._id} className="mb-2">
            <Link href={`/cows/${cow._id}`} className="text-blue-500 underline">
              {cow.name}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
