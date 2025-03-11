'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function AdminTwoFactorPage() {
  const { admin, toggleAdminTwoFactor, checkAdminProfile } = useAuthStore();
  const [twoFAMsg, setTwoFAMsg] = useState('');

  const handleToggle2FA = async () => {
    try {
      await toggleAdminTwoFactor();
      await checkAdminProfile();
      setTwoFAMsg('2FA preferences updated.');
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : 'Error toggling 2FA preferences';
      setTwoFAMsg(errMsg);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      className="mt-8 flex justify-center"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-foreground text-center text-2xl font-semibold">
          Two-Factor Authentication
        </h2>
        <div className="mt-4 flex items-center justify-center space-x-4">
          <Label htmlFor="twofa-switch" className="text-foreground text-sm">
            {admin && admin.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </Label>
          <Switch
            id="twofa-switch"
            checked={admin?.twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
          />
        </div>
        {twoFAMsg && (
          <p className="mt-2 text-center text-sm text-green-500">{twoFAMsg}</p>
        )}
      </div>
    </motion.div>
  );
}
