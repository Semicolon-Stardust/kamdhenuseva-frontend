'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AdminCowList() {
  // Get fetchCows function and current cows from the store
  const fetchCows = useAuthStore((state) => state.fetchCows);
  const cows = useAuthStore((state) => state.cows);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

  // Use TanStack Query to fetch cows; note we use the store’s function then return the cows from the store.
  const { isLoading, error } = useQuery({
    queryKey: ['adminCows'],
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
      <h1 className="mb-4 text-2xl font-bold">Admin - Cow List</h1>
      <Link href="/admin/cows/create">
        <button className="mb-4 rounded bg-blue-500 px-4 py-2 text-white">
          Create New Cow
        </button>
      </Link>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div>Error: {error instanceof Error ? error.message : error}</div>
      )}
      <ul>
        {cows.map((cow) => (
          <li key={cow._id} className="mb-2 border-b pb-2">
            {cow.name} - Age: {cow.age}{' '}
            <Link href={`/${locale}/admin/cows/${cow._id}/edit`}>
              <button className="ml-2 rounded bg-green-500 px-2 py-1 text-white">
                Edit
              </button>
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
