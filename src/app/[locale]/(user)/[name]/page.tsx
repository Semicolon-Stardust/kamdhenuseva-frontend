'use client';
import { useAuthStore } from '@/stores/authStore';

export default function UserSettingsPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex">
      {/* Main content area */}
      <div className="">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          {user?.name ? user?.name.split(' ')[0] : 'User'}&apos;s Settings
        </h1>
        <p className="mt-2 text-sm text-black dark:text-white">
          User settings content goes here.
        </p>
      </div>
    </div>
  );
}
