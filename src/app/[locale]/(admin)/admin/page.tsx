'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const [localError, setLocalError] = useState<string | null>(null);

  const { loginAdmin, logoutAdmin, admin, checkAdminVerificationStatus } =
    useAuthStore();

  // If already logged in, redirect to admin dashboard.
  useEffect(() => {
    if (admin) {
      router.push(`/${locale}/admin/dashboard`);
    }
  }, [admin, router, locale]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginAdmin(data.email, data.password);
    },
    onSuccess: async (result) => {
      // Call checkUserVerificationStatus to update isEmailVerified in store.
      await checkAdminVerificationStatus();
      // Now check if the Admin is verified
      if (result.twoFactorRequired) {
        router.push(`/${locale}/admin/verify-otp`);
      } else if (!useAuthStore.getState().isEmailVerified) {
        setLocalError(
          'Your email address is not verified. Please check your inbox for the verification link.',
        );
        await logoutAdmin();
      } else {
        router.push(`/${locale}/dashboard`);
      }
    },
    onError: (error: unknown) => {
      setLocalError(((error as Error).message as string) || 'Login failed.');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setLocalError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="bg-accent flex min-h-screen items-center justify-center p-4 text-white">
      <div className="bg-primary w-full max-w-md space-y-6 rounded-lg p-8 shadow">
        <h1 className="text-center text-3xl font-bold">Admin Login</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 w-full"
              placeholder="admin@dayadevraha.com"
            />
            {errors.email && (
              <p className="text-destructive mt-1 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 w-full"
              placeholder="Your secure password"
            />
            {errors.password && (
              <p className="text-destructive mt-1 text-xs">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Button type="submit" className="w-full">
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {(loginMutation.error || localError) && (
            <p className="text-destructive text-center">
              {localError ||
                (loginMutation.error as unknown as Error)?.message ||
                'Login failed.'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
