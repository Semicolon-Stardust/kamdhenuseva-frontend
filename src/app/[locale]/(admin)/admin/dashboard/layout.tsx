/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Loader from '@/components/ui/loader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale || 'en';
  const router = useRouter();
  const {
    user,
    isCheckingAuth,
    isAuthenticatedAdmin,
    checkAdminAuth,
    checkAdminProfile,
  } = useAuthStore();

  // Check user authentication on mount.
  useEffect(() => {
    (async () => {
      await checkAdminAuth();
    })();
  }, [checkAdminAuth]);

  // Once authenticated, fetch the user profile to get the username.
  useEffect(() => {
    if (isAuthenticatedAdmin) {
      checkAdminProfile();
    }
  }, [isAuthenticatedAdmin, checkAdminProfile]);

  // Redirect to login if not authenticated once checking is complete.
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticatedAdmin) {
      router.push(`/${locale}/login`);
    }
  }, [isCheckingAuth, isAuthenticatedAdmin, router, locale]);

  // While waiting for the auth check to finish, show a loading indicator.
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-14 min-h-screen">
      <div className="flex">
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
