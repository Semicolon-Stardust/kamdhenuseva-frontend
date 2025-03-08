'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export default function UserDashboard() {
  // Get the logged in user from the store
  const user = useAuthStore((state) => state.user);

  if (!user) return <div>Please log in to view your dashboard.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h1 className="mb-4 text-3xl font-bold">Welcome, {user.name}!</h1>
      <p className="mb-4">This is your personal dashboard.</p>
      <div className="flex flex-col gap-4">
        <Link href="/cows">
          <button className="rounded bg-blue-500 px-4 py-2 text-white">
            View Cows
          </button>
        </Link>
        <Link href="/donate">
          <button className="rounded bg-green-500 px-4 py-2 text-white">
            Make a Donation
          </button>
        </Link>
        <Link href="/donations/history">
          <button className="rounded bg-purple-500 px-4 py-2 text-white">
            Donation History
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
