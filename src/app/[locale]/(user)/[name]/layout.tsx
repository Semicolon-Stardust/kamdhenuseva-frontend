'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import VerticalSidebar from '@/components/ui/header/vertical-header';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function UserSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale || 'en';
  const userName = params.name as string;
  const router = useRouter();
  const {
    user,
    isCheckingAuth,
    isAuthenticatedUser,
    checkUserAuth,
    checkUserProfile,
  } = useAuthStore();

  // Check User authentication on mount.
  useEffect(() => {
    (async () => {
      await checkUserAuth();
    })();
  }, [checkUserAuth]);

  // Once authenticated, fetch the full User profile.
  useEffect(() => {
    if (isAuthenticatedUser) {
      checkUserProfile();
    }
  }, [isAuthenticatedUser, checkUserProfile]);

  // Redirect to login if not authenticated or if username doesn't match
  useEffect(() => {
    if (!isCheckingAuth) {
      if (!isAuthenticatedUser) {
        router.push(`/${locale}/login`);
      } else if (user && user.name !== userName) {
        // Redirect if the URL name doesn't match the authenticated user's name
        router.push(
          `/${locale}/${user.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings`,
        );
      }
    }
  }, [isCheckingAuth, isAuthenticatedUser, user, userName, router, locale]);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const links = [
    {
      href: `/${user?.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings`,
      label: 'Overview',
    },
    {
      href: `/${user?.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings/verify-email`,
      label: 'Verify Email',
    },
    {
      href: `/${user?.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings/password-change`,
      label: 'Password Change',
    },
    {
      href: `/${user?.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings/two-factor`,
      label: 'Two-Factor Authentication',
    },
    {
      href: `/${user?.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings/delete-account`,
      label: 'Delete Account',
    },
  ];

  return (
    <div className="">
      <SidebarProvider>
        <VerticalSidebar
          heading="Account Settings"
          headingLink={`/${user?.name ? user.name.split(' ')[0].toLowerCase() : ''}-settings`}
          links={links}
        />
        <SidebarTrigger />
        <div className="min-h-screen w-full px-10 pt-14">
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
