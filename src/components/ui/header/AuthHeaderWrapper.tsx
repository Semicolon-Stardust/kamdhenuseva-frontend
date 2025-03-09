'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header, { HeaderData, AuthData } from '@/components/ui/header/header';

export default function AuthHeaderWrapper() {
  // Define static header data.
  const staticHeaderData: HeaderData = {
    logoSrc: '/logo.png',
    logoText: 'Daya Devraha',
    links: [
      { linkName: 'Home', href: '/' },
      { linkName: 'About Us', href: '/about' },
      { linkName: 'Donate', href: '/donate' },
      { linkName: 'Contact Us', href: '/contact' },
    ],
    ctaButtons: {
      loginText: 'Login',
      registerText: 'Register',
      loginHref: '/login',
      registerHref: '/register',
    },
  };

  // Get auth functions and state from authStore.
  const checkUserAuth = useAuthStore((state) => state.checkUserAuth);
  const checkAdminAuth = useAuthStore((state) => state.checkAdminAuth);
  const admin = useAuthStore((state) => state.admin);
  const isAuthenticatedAdmin = useAuthStore(
    (state) => state.isAuthenticatedAdmin,
  );
  const user = useAuthStore((state) => state.user);
  const isAuthenticatedUser = useAuthStore(
    (state) => state.isAuthenticatedUser,
  );
  const logoutAdmin = useAuthStore((state) => state.logoutAdmin);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const router = useRouter();

  // Run both admin and user auth checks on mount.
  useEffect(() => {
    checkAdminAuth();
    checkUserAuth();
  }, [checkAdminAuth, checkUserAuth]);

  // Prepare authData based on the authenticated entity.
  let authData: AuthData = {
    isAuthenticated: false,
    userName: 'Account',
    dropdownOptions: [],
  };

  if (isAuthenticatedAdmin && admin) {
    // Use fallback "Admin" if name is missing.
    const adminFirstName = admin.name ? admin.name.split(' ')[0] : 'Admin';
    authData = {
      isAuthenticated: true,
      userName: adminFirstName,
      dropdownOptions: [
        {
          value: 'dashboard',
          label: admin.name || 'Dashboard',
          href: '/admin/dashboard',
        },
        {
          value: 'logout',
          label: 'Logout',
          onClick: async () => {
            await logoutAdmin();
            router.push('/');
          },
        },
      ],
    };
  } else if (isAuthenticatedUser && user) {
    // Use fallback "User" if name is missing.
    const userFirstName = user.name ? user.name.split(' ')[0] : 'User';
    authData = {
      isAuthenticated: true,
      userName: userFirstName,
      dropdownOptions: [
        {
          value: 'dashboard',
          label: user.name || 'Dashboard',
          href: '/dashboard',
        },
        {
          value: 'logout',
          label: 'Logout',
          onClick: async () => {
            await logoutUser();
            router.push('/');
          },
        },
      ],
    };
  }

  return <Header headerData={staticHeaderData} authData={authData} />;
}
