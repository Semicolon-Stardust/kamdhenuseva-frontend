'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty({ message: 'New password is required' })
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminPasswordChangePage() {
  const { updateAdminProfile } = useAuthStore();
  const [passwordMsg, setPasswordMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await updateAdminProfile({ password: data.newPassword });
      setPasswordMsg('Password updated successfully.');
      reset();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : 'Error updating password';
      setPasswordMsg(errMsg);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      className="mt-8 flex justify-center"
    >
      <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-lg">
        <h2 className="text-foreground text-center text-2xl font-semibold">
          Update Password
        </h2>
        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          className="mt-4 space-y-4"
        >
          <div>
            <Label
              htmlFor="newPassword"
              className="text-foreground block text-sm font-medium"
            >
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              placeholder="Enter new password"
            />
            {errors.newPassword && (
              <p className="text-destructive text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-foreground block text-sm font-medium"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirm new password"
            />
            {errors.confirmPassword && (
              <p className="text-destructive text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Update Password
          </Button>
          {passwordMsg && (
            <p className="mt-2 text-center text-sm text-green-500">
              {passwordMsg}
            </p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
