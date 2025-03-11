'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const passwordSchema = z
  .object({
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UserSettingsPage() {
  const {
    user,
    deleteUserAccount,
    updateAdminProfile,
    toggleAdminTwoFactor,
    checkAdminVerificationStatus,
    isEmailVerified,
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'account'
  >('profile');
  const [status, setStatus] = useState<'verified' | 'not_verified' | 'loading'>(
    'loading',
  );
  const [passwordMsg, setPasswordMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [twoFAMsg, setTwoFAMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    checkAdminVerificationStatus()
      .then(() => setStatus(isEmailVerified ? 'verified' : 'not_verified'))
      .catch(() => setStatus('not_verified'));
  }, [checkAdminVerificationStatus, isEmailVerified]);

  const handlePasswordUpdate = async (data: PasswordFormData) => {
    try {
      await updateAdminProfile({ password: data.newPassword });
      setPasswordMsg('Password updated successfully.');
      reset();
    } catch (error: unknown) {
      setPasswordMsg(
        error instanceof Error ? error.message : 'Error updating password',
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        'Are you sure you want to delete your account? This action cannot be undone.',
      )
    ) {
      try {
        await deleteUserAccount();
        setDeleteMsg('Account deleted successfully.');
      } catch (error: unknown) {
        setDeleteMsg(
          error instanceof Error ? error.message : 'Error deleting account',
        );
      }
    }
  };

  const handleToggle2FA = async () => {
    try {
      await toggleAdminTwoFactor();
      setTwoFAMsg('Two-Factor Authentication preferences updated.');
    } catch (error: unknown) {
      setTwoFAMsg(
        error instanceof Error
          ? error.message
          : 'Error toggling 2FA preferences',
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white px-6 pt-4 pb-10 shadow-lg">
      {/* Tabs */}
      <div className="flex space-x-6 border-b pb-3">
        {['profile', 'security', 'account'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-primary text-primary border-b-2 font-bold'
                : 'hover:text-primary text-gray-500'
            }`}
            onClick={() =>
              setActiveTab(tab as 'profile' | 'security' | 'account')
            }
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeTab === 'profile' && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
          <div className="rounded-lg border p-5 shadow-sm">
            <p className="font-medium text-gray-700">Name:</p>
            <p className="text-gray-900">{user?.name}</p>
          </div>
          <div className="rounded-lg border p-5 shadow-sm">
            <p className="font-medium text-gray-700">Email:</p>
            <p className="text-gray-900">{user?.email}</p>
          </div>
        </div>
      )}

      {/* Security Section */}
      {activeTab === 'security' && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Security Settings
          </h2>

          {/* Password Update */}
          <div className="rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Update Password
            </h3>
            <form
              onSubmit={handleSubmit(handlePasswordUpdate)}
              className="mt-4 space-y-4"
            >
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  placeholder="Enter new password"
                  className="bg-gray-200"
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Confirm new password"
                  className="bg-gray-200"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Update Password
              </Button>
              {passwordMsg && (
                <p className="mt-2 text-green-500">{passwordMsg}</p>
              )}
            </form>
          </div>

          {/* Two-Factor Authentication */}
          <div className="rounded-lg border p-5 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Two-Factor Authentication
            </h3>
            <div className="mt-4 flex items-center space-x-4">
              <Label htmlFor="twofa-switch">Status:</Label>
              <Switch
                id="twofa-switch"
                checked={user?.twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
            {twoFAMsg && <p className="mt-2 text-green-500">{twoFAMsg}</p>}
          </div>
        </div>
      )}

      {/* Account Section */}
      {activeTab === 'account' && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Account Management
          </h2>

          {/* Email Verification */}
          <div className="rounded-lg border p-5 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              Email Verification
            </h3>
            {status === 'loading' ? (
              <p>Checking verification status...</p>
            ) : status === 'verified' ? (
              <p className="text-green-500">Your email is verified!</p>
            ) : (
              <div>
                <p className="text-red-500">Your email is not verified.</p>
                <Button className="bg-primary mt-4 w-full text-white">
                  Resend Verification Email
                </Button>
              </div>
            )}
          </div>

          {/* Delete Account */}
          <div className="rounded-lg border border-red-500 p-5 shadow-md">
            <h3 className="text-lg font-semibold text-red-500">
              Delete Account
            </h3>
            <p className="text-red-600">
              Warning: This action is irreversible.
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="mt-4 w-full"
            >
              Delete Account
            </Button>
            {deleteMsg && <p className="mt-2 text-red-500">{deleteMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
