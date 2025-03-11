'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { verifyUserEmail, logoutUser, isLoading, error } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

  // Local state: "success" | "failure" | "already" | null
  const [verificationStatus, setVerificationStatus] = useState<
    'success' | 'failure' | 'already' | null
  >(null);

  useEffect(() => {
    if (token) {
      verifyUserEmail(token)
        .then((result) => {
          if (typeof result === 'string' && result === 'already') {
            setVerificationStatus('already');
          } else {
            setVerificationStatus(result ? 'success' : 'failure');
          }
        })
        .catch(() => {
          setVerificationStatus('failure');
        });
    } else {
      setVerificationStatus('failure');
    }
  }, [token, verifyUserEmail]);

  // Logout then push to login page
  const handleLogoutAndRedirect = async () => {
    await logoutUser();
    router.push(`/${locale}/login`);
  };

  return (
    <div className="bg-background dark:bg-background-dark flex min-h-screen w-full flex-col items-center justify-center p-4">
      {isLoading && <p className="text-lg">Verifying...</p>}

      {!isLoading && verificationStatus === 'success' && (
        <div className="flex flex-col items-center">
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
          <p className="mt-4 text-xl text-green-600">
            Email verified successfully!
          </p>
          <button
            className="mt-6 rounded bg-green-500 px-4 py-2 text-white"
            onClick={handleLogoutAndRedirect}
          >
            Go to Login
          </button>
        </div>
      )}

      {!isLoading && verificationStatus === 'already' && (
        <div className="flex flex-col items-center">
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
          <p className="mt-4 text-xl text-green-600">Email already verified!</p>
          <button
            className="mt-6 rounded bg-green-500 px-4 py-2 text-white"
            onClick={handleLogoutAndRedirect}
          >
            Go to Login
          </button>
        </div>
      )}

      {!isLoading && verificationStatus === 'failure' && (
        <div className="flex flex-col items-center">
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
          <p className="mt-4 text-xl text-red-600">
            Email verification failed. Please try again.
          </p>
          {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
          <button
            className="mt-4 text-blue-500 underline hover:text-blue-700"
            onClick={() => router.push(`/${locale}/resend-verification`)}
          >
            Resend Verification Email
          </button>
          <button
            className="mt-6 rounded bg-red-500 px-4 py-2 text-white"
            onClick={handleLogoutAndRedirect}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
}
