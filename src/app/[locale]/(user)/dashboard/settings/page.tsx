'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
  const t = useTranslations();
  const locale = useLocale();
  const {
    user,
    deleteUserAccount,
    updateUserPassword,
    toggleUserTwoFactor,
    checkUserVerificationStatus,
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
    checkUserVerificationStatus()
      .then(() => setStatus(isEmailVerified ? 'verified' : 'not_verified'))
      .catch(() => setStatus('not_verified'));
  }, [checkUserVerificationStatus, isEmailVerified]);

  const handlePasswordUpdate = async (data: PasswordFormData) => {
    try {
      await updateUserPassword(data.newPassword);
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
      await toggleUserTwoFactor();
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
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`}>
              {t('breadcrumb.home')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/dashboard`}>
              {t('breadcrumb.dashboard')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('breadcrumb.settings')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tabs */}
      <div className="flex space-x-6 border-b pb-3">
        {(['profile', 'security', 'account'] as const).map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === tab
                ? 'border-primary text-primary border-b-2 font-bold'
                : 'hover:text-primary text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {t(`UserSettingsPage.tabs.${tab}`)}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeTab === 'profile' && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {t('UserSettingsPage.profile.heading')}
          </h2>
          <div className="rounded-lg border p-5 shadow-sm">
            <p className="font-medium text-gray-700">
              {t('UserSettingsPage.profile.name')}:
            </p>
            <p className="text-gray-900">{user?.name ?? 'Unknown User'}</p>
          </div>
          <div className="rounded-lg border p-5 shadow-sm">
            <p className="font-medium text-gray-700">
              {t('UserSettingsPage.profile.email')}:
            </p>
            <p className="text-gray-900">{user?.email ?? 'No Email'}</p>
          </div>
        </div>
      )}

      {/* Security Section */}
      {activeTab === 'security' && (
        <div className="mt-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {t('UserSettingsPage.security.heading')}
          </h2>

          {/* Password Update */}
          <div className="rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('UserSettingsPage.security.updatePassword')}
            </h3>
            <form
              onSubmit={handleSubmit(handlePasswordUpdate)}
              className="mt-4 space-y-4"
            >
              <Label htmlFor="newPassword">
                {t('UserSettingsPage.security.newPassword')}
              </Label>
              <Input
                id="newPassword"
                type="password"
                {...register('newPassword')}
                placeholder={t('UserSettingsPage.security.passwordPlaceholder')}
                className="bg-gray-200"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
              <Label htmlFor="confirmPassword">
                {t('UserSettingsPage.security.confirmPassword')}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder={t('UserSettingsPage.security.confirmPlaceholder')}
                className="bg-gray-200"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
              <Button type="submit" className="w-full">
                {t('UserSettingsPage.security.updateButton')}
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
            {t('UserSettingsPage.account.heading')}
          </h2>

          {/* Email Verification */}
          <div className="rounded-lg border p-5 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('UserSettingsPage.account.emailVerification')}
            </h3>
            {status === 'loading' ? (
              <p>{t('UserSettingsPage.account.emailChecking')}</p>
            ) : status === 'verified' ? (
              <p className="text-green-500">
                {t('UserSettingsPage.account.emailVerified')}
              </p>
            ) : (
              <div>
                <p className="text-red-500">
                  {t('UserSettingsPage.account.emailNotVerified')}
                </p>
                <Button className="bg-primary mt-4 w-full text-white">
                  {t('UserSettingsPage.account.resendEmail')}
                </Button>
              </div>
            )}
          </div>

          {/* Delete Account */}
          <div className="rounded-lg border border-red-500 p-5 shadow-md">
            <h3 className="text-lg font-semibold text-red-500">
              {t('UserSettingsPage.account.deleteAccount')}
            </h3>
            <p className="text-red-600">
              {t('UserSettingsPage.account.deleteWarning')}
            </p>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="mt-4 w-full"
            >
              {t('UserSettingsPage.account.deleteButton')}
            </Button>
            {deleteMsg && <p className="mt-2 text-red-500">{deleteMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
