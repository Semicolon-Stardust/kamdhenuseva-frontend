'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';

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
  const cows = useAuthStore((state) => state.cows);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

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
      className="p-40 bg-background text-foreground"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary">Admin - Cow List</h1>
        <Link href={`/admin/cows/create`}>
          <button className="px-4 py-2 transition-colors rounded bg-primary text-primary-foreground hover:bg-primary-dark">
            Create New Cow
          </button>
        </Link>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div className="text-destructive">
          Error: {error instanceof Error ? error.message : error}
        </div>
      )}

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
                    <button className="px-2 py-1 transition-colors rounded bg-primary text-primary-foreground hover:bg-primary-dark">
                      Edit
                    </button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No cows found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}
