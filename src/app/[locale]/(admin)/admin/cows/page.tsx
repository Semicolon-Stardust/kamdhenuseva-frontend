'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { Link } from '@/i18n/routing';
import Loader from '@/components/ui/loader';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

export default function AdminCowList() {
  const fetchCows = useAuthStore((state) => state.fetchCows);

  const {
    data: cows,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminCows'],
    queryFn: async () => {
      await fetchCows();
      return useAuthStore.getState().cows;
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background text-foreground p-40"
    >
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-primary text-2xl font-bold">Admin - Cow List</h1>
        <Link href="/admin/cows/create">
          <button className="bg-primary text-primary-foreground hover:bg-primary-dark rounded px-4 py-2 transition-colors">
            Create New Cow
          </button>
        </Link>
      </div>

      {isLoading && <Loader />}

      {error && (
        <div className="text-destructive text-center">
          Error: {error instanceof Error ? error.message : error}
        </div>
      )}

      {!isLoading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cows && cows.length > 0 ? (
              cows.map((cow) => (
                <TableRow key={cow._id}>
                  <TableCell>{cow.name}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/cows/${cow._id}/edit`}>
                      <button className="bg-primary text-primary-foreground hover:bg-primary-dark rounded px-2 py-1 transition-colors">
                        Edit
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="py-4 text-center">
                  No cows found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
}
