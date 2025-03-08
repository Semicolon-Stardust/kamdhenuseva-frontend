'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function AdminDashboard() {
  // Get the logged in admin from the store
  const admin = useAuthStore((state) => state.admin);

  if (!admin)
    return <div>Please log in as an admin to view your dashboard.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="mb-4 text-3xl font-bold">Welcome, Admin {admin.name}!</h1>
      <p className="mb-4">This is your admin dashboard.</p>
      <div className="flex flex-col gap-4">
        <Link href="/admin/cows">
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            Manage Cows
          </button>
        </Link>
        <Link href="/admin/donations">
          <button className="rounded bg-green-500 px-4 py-2 text-white">
            Manage Donations
          </button>
        </Link>
        <Link href="/admin/profile">
          <button className="rounded bg-purple-500 px-4 py-2 text-white">
            Admin Profile
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
