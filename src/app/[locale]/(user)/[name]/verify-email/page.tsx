'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';

export default function AdminSettingsVerifyEmailPage() {
  const { checkAdminVerificationStatus, isEmailVerified, isLoading, error } =
    useAuthStore();
  const [status, setStatus] = useState<'verified' | 'not_verified' | 'loading'>(
    'loading',
  );

  useEffect(() => {
    checkAdminVerificationStatus()
      .then(() => {
        setStatus(isEmailVerified ? 'verified' : 'not_verified');
      })
      .catch(() => {
        setStatus('not_verified');
      });
  }, [checkAdminVerificationStatus, isEmailVerified]);

  return (
    <div className="text-foreground mb-6 flex min-h-screen w-full items-center justify-center rounded-lg bg-white p-6">
      <div className="p-8">
        {isLoading || status === 'loading' ? (
          <div className="flex flex-col items-center text-center">
            <div className="border-t-primary h-10 w-10 animate-spin rounded-full border-4 border-gray-300"></div>
            <p className="mt-4 text-lg font-medium text-gray-600">
              Checking verification status...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {status === 'verified' ? (
              <>
                <svg
                  className="h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <h2 className="mt-4 text-2xl font-semibold text-green-600">
                  Email Verified!
                </h2>
                <p className="mt-2 text-gray-600">
                  Your email has been successfully verified.
                </p>
              </>
            ) : (
              <>
                <svg
                  className="h-16 w-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <h2 className="mt-4 text-2xl font-semibold text-red-600">
                  Email Not Verified
                </h2>
                <p className="mt-2 text-gray-600">
                  Please check your inbox for the verification link or request a
                  new one.
                </p>
                <Button className="bg-primary hover:bg-primary-dark mt-6 w-full text-white">
                  Resend Verification Email
                </Button>
              </>
            )}
            {error && (
              <p className="text-destructive mt-2 text-sm">Error: {error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
