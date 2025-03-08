'use client';

import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

interface DonationFormValues {
  amount: number;
  tier: 'Bronze' | 'Silver' | 'Gold';
  donationType: 'one-time' | 'recurring';
}

export default function UserDonationCreate() {
  const router = useRouter();
  const createDonation = useAuthStore((state) => state.createDonation);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonationFormValues>();

  const mutation = useMutation({
    mutationFn: async (data: DonationFormValues) => {
      await createDonation(data);
    },
    onSuccess: () => {
      router.push('/donations/history');
    },
  });

  const onSubmit: SubmitHandler<DonationFormValues> = (data) => {
    mutation.mutate(data);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-4"
    >
      <h1 className="mb-4 text-2xl font-bold">Make a Donation</h1>
      {mutation.isError && (
        <div className="mb-4 text-red-600">
          Error: {(mutation.error as Error)?.message}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Amount:</label>
          <input
            type="number"
            {...register('amount', {
              required: 'Amount is required',
              valueAsNumber: true,
            })}
            className="w-full rounded border p-2"
          />
          {errors.amount && (
            <span className="text-red-500">{errors.amount.message}</span>
          )}
        </div>
        <div>
          <label className="block">Tier:</label>
          <select
            {...register('tier', { required: 'Tier is required' })}
            className="w-full rounded border p-2"
          >
            <option value="Bronze">Bronze</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
          {errors.tier && (
            <span className="text-red-500">{errors.tier.message}</span>
          )}
        </div>
        <div>
          <label className="block">Donation Type:</label>
          <select
            {...register('donationType', {
              required: 'Donation type is required',
            })}
            className="w-full rounded border p-2"
          >
            <option value="one-time">One-Time</option>
            <option value="recurring">Recurring</option>
          </select>
          {errors.donationType && (
            <span className="text-red-500">{errors.donationType.message}</span>
          )}
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          {mutation.isPending ? 'Submitting...' : 'Donate'}
        </button>
      </form>
    </motion.div>
  );
}
