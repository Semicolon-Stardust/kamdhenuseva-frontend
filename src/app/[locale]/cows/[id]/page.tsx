'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams } from 'next/navigation';

export default function UserCowDetail() {
  const { id } = useParams();
  const fetchCowById = useAuthStore((state) => state.fetchCowById);

  const {
    data: cow,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cowDetail', id],
    queryFn: async () => {
      if (id) return await fetchCowById(id);
      return null;
    },
    enabled: Boolean(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {error instanceof Error ? error.message : error}</div>;
  if (!cow) return <div>No cow found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4"
    >
      <h1 className="text-2xl font-bold">{cow.name}</h1>
      <p>Age: {cow.age}</p>
      <p>Sickness Status: {cow.sicknessStatus ? 'Yes' : 'No'}</p>
      {/* Add any additional cow details here */}
    </motion.div>
  );
}
