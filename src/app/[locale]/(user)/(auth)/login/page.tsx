'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

// Define validation schema using Zod.
const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    loginUser,
    logoutUser,
    checkUserAuth,
    checkUserVerificationStatus,
    isAuthenticatedUser: storeAuthenticated,
  } = useAuthStore();

  // Use an object to configure the query.
  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const result = await checkUserAuth();
      return result ?? { isAuthenticated: false };
    },
  });

  // Redirect if already authenticated.
  useEffect(() => {
    if (authData?.isAuthenticated || storeAuthenticated) {
      router.push(`/${locale}/dashboard`);
    }
  }, [authData, storeAuthenticated, router, locale]);

  // Use a mutation for login action.
  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      return await loginUser(data.email, data.password);
    },
    onSuccess: async (result) => {
      // Check email verification status.
      await checkUserVerificationStatus();
      if (result.twoFactorRequired) {
        router.push(`/${locale}/verify-otp`);
      } else if (!useAuthStore.getState().isEmailVerified) {
        setLocalError(
          'Your email address is not verified. Please check your inbox for the verification link.',
        );
        await logoutUser();
      } else {
        router.push(`/${locale}/dashboard`);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLocalError(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="bg-accent flex min-h-screen items-center justify-center p-4">
      <div className="bg-primary w-full max-w-md space-y-6 rounded-lg p-8 shadow">
        <h1 className="text-center text-3xl font-bold text-white">
          Login to Your Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 w-full"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-destructive mt-1 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
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
            <Button type="submit" className="w-full cursor-pointer">
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
          {(loginMutation.error || localError) && (
            <p className="text-destructive text-center">
              {localError ||
                (loginMutation.error as Error)?.message ||
                'Login failed.'}
            </p>
          )}
        </form>
        {/* Forgot Password Link Button */}
        <div className="mt-4 text-center">
          <Button
            variant="link"
            className="text-white"
            onClick={() => router.push(`/${locale}/forgot-password`)}
          >
            Forgot Password?
          </Button>
        </div>
      </div>
    </div>
  );
}
