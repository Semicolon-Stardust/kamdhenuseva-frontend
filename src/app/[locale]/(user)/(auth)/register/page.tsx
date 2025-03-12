'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const registerSchema = z
  .object({
    name: z.string().nonempty({ message: 'Name is required' }),
    email: z
      .string()
      .nonempty({ message: 'Email is required' })
      .email('Invalid email format'),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Please confirm your password' }),
    dateOfBirth: z.string().optional(),
    emergencyRecoveryContact: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    registerUser,
    checkUserAuth,
    logoutUser,
    isAuthenticatedUser: storeAuthenticated,
  } = useAuthStore();

  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const result = await checkUserAuth();
      return result ?? { isAuthenticated: false };
    },
    initialData: { isAuthenticated: false },
  });

  useEffect(() => {
    if (authData?.isAuthenticated || storeAuthenticated) {
      router.push(`/${locale}/dashboard`);
    }
  }, [authData, storeAuthenticated, router, locale]);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      return await registerUser(
        data.name,
        data.email,
        data.password,
        data.confirmPassword,
        data.dateOfBirth,
        data.emergencyRecoveryContact,
      );
    },
    onSuccess: async () => {
      if (!useAuthStore.getState().isEmailVerified) {
        await logoutUser();
        router.push(`/${locale}/login`);
      } else {
        setRegistrationSuccess(true);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  if (registrationSuccess) {
    return (
      <div className="bg-background dark:bg-background-dark flex min-h-screen items-center justify-center p-4">
        <div className="bg-card w-full max-w-md space-y-6 rounded-lg p-8 shadow">
          <h1 className="text-primary text-center text-3xl font-bold">
            Registration Successful!
          </h1>
          <p className="text-center">
            Please check your email for a verification link before logging in.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => router.push(`/${locale}/login`)}>
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent flex min-h-screen items-center justify-center p-4 md:mt-14">
      <div className="bg-primary w-full max-w-md space-y-6 rounded-lg p-8 shadow">
        <h1 className="text-center text-3xl font-bold text-white">
          Create Your Account
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register('name')}
              className="mt-1 w-full"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-destructive mt-1 text-xs">
                {errors.name.message}
              </p>
            )}
          </div>
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
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className="mt-1 w-full"
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <p className="text-destructive mt-1 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div>
            <Label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-white"
            >
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register('dateOfBirth')}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <Label
              htmlFor="emergencyRecoveryContact"
              className="block text-sm font-medium text-white"
            >
              Emergency Recovery Contact
            </Label>
            <Input
              id="emergencyRecoveryContact"
              type="email"
              {...register('emergencyRecoveryContact')}
              className="mt-1 w-full"
              placeholder="Alternate email"
            />
          </div>
          <div>
            <Button type="submit" className="w-full cursor-pointer">
              {registerMutation.isPending ? 'Registering...' : 'Register'}
            </Button>
          </div>
          {registerMutation.error && (
            <p className="text-destructive text-center">
              {(registerMutation.error as Error)?.message ||
                'Registration failed.'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
