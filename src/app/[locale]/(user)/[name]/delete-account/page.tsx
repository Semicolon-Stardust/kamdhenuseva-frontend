'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useParams } from 'next/navigation';

const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

export default function DeleteAccountSection() {
  const { deleteUserAccount } = useAuthStore();
  const [deleteMsg, setDeleteMsg] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';

  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );
    if (!confirmed) return;
    try {
      await deleteUserAccount();
      setDeleteMsg('Account deleted successfully.');
      router.push(`/${locale}/login`);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : 'Error deleting account';
      setDeleteMsg(errMsg);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      className="mt-8 flex justify-center"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-foreground text-center text-2xl font-semibold">
          Delete Account
        </h2>
        <p className="text-destructive mt-2 text-center text-sm">
          Warning: This action is irreversible. All your data will be
          permanently deleted.
        </p>
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          className="mt-4 w-full"
        >
          Delete Account
        </Button>
        {deleteMsg && (
          <p className="text-destructive mt-2 text-center text-sm">
            {deleteMsg}
          </p>
        )}
      </div>
    </motion.div>
  );
}
