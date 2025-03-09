'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface CowFormValues {
  name: string;
  age: number;
}

export default function AdminCowEdit() {
  const { id } = useParams();
  // Ensure id is always a string
  const cowId = Array.isArray(id) ? id[0] : id;
  const router = useRouter();
  const fetchCowById = useAuthStore((state) => state.fetchCowById);
  const updateCow = useAuthStore((state) => state.updateCow);

  // Use TanStack Query to fetch the cow data
  const {
    data: cow,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['cow', cowId],
    queryFn: async () => {
      if (cowId) {
        return await fetchCowById(cowId);
      }
      return null;
    },
    enabled: Boolean(cowId),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CowFormValues>();

  // When the cow data is loaded, reset the form with default values
  useEffect(() => {
    if (cow) {
      reset({ name: cow.name, age: cow.age });
    }
  }, [cow, reset]);

  const mutation = useMutation({
    mutationFn: async (data: CowFormValues) => {
      if (cowId) {
        await updateCow(cowId, data);
      }
    },
    onSuccess: () => {
      router.push('/admin/cows');
    },
  });

  const onSubmit: SubmitHandler<CowFormValues> = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {error instanceof Error ? error.message : error}</div>;
  if (!cow) return <div>No cow found</div>;

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="p-4"
    >
      <h1 className="mb-4 text-2xl font-bold">Edit Cow</h1>
      {mutation.isError && (
        <div className="mb-4 text-red-600">
          Error: {(mutation.error as Error)?.message}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Name:</label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="w-full rounded border p-2"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div>
          <label className="block">Age:</label>
          <input
            type="number"
            {...register('age', {
              required: 'Age is required',
              valueAsNumber: true,
            })}
            className="w-full rounded border p-2"
          />
          {errors.age && (
            <span className="text-red-500">{errors.age.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-green-500 px-4 py-2 text-white"
        >
          {mutation.isPending ? 'Updating...' : 'Update Cow'}
        </button>
      </form>
    </motion.div>
  );
}
