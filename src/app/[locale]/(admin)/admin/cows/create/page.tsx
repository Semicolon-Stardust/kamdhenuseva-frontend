'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';

interface CowFormValues {
  name: string;
  age: number;
}

export default function AdminCowCreate() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const createCow = useAuthStore((state) => state.createCow);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CowFormValues>();

  const mutation = useMutation({
    mutationFn: async (data: CowFormValues) => {
      await createCow({
        name: data.name,
        age: data.age,
        sicknessStatus: false,
        agedStatus: false,
        adoptionStatus: false,
      });
    },
    onSuccess: () => {
      router.push(`/${locale}/admin/cows`);
    },
  });

  const onSubmit: SubmitHandler<CowFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="min-h-screen p-40"
    >
      <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="p-6">
          <h1 className="mb-4 text-center text-2xl font-bold">
            Create New Cow
          </h1>
          {mutation.isError && (
            <div className="mb-4 text-red-600">
              Error: {(mutation.error as Error)?.message}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block">Name:</label>
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
              <label className="mb-1 block">Age:</label>
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
              className="w-full rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              {mutation.isPending ? 'Creating...' : 'Create Cow'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
