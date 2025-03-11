'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import VerticalSidebar from '@/components/ui/header/vertical-header';
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
    isAuthenticatedUser,
    checkUserAuth,
    checkUserProfile,
    isEmailVerified,
  } = useAuthStore();

  // Check user authentication on mount.
  useEffect(() => {
    (async () => {
      await checkUserAuth();
    })();
  }, [checkUserAuth]);

  // Once authenticated, fetch the user profile to get the username.
  useEffect(() => {
    if (isAuthenticatedUser) {
      checkUserProfile();
    }
  }, [isAuthenticatedUser, checkUserProfile]);

  // Handle email verification status
  useEffect(() => {
    const handleVerificationCheck = async () => {
      if (isAuthenticatedUser && user && !isEmailVerified) {
        router.push(`/${locale}/login`);
      }
    };

    if (user) {
      handleVerificationCheck();
    }
  }, [user, isEmailVerified, isAuthenticatedUser, router, locale]);

  // Redirect to login if not authenticated once checking is complete.
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticatedUser) {
      router.push(`/${locale}/login`);
    }
  }, [isCheckingAuth, isAuthenticatedUser, router, locale]);

  // While waiting for the auth check to finish, show a loading indicator.
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <SidebarProvider>
        <VerticalSidebar
          heading="Kamdhenuseva"
          headingLink="/"
          links={[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/dashboard/settings', label: 'Settings' },
          ]}
        />
        <div className="flex min-h-screen w-full">
          {/* Main content area */}
          <main className="flex-1 p-6 sm:p-8">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
