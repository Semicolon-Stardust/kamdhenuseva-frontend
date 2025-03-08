// app/admin/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const AdminPage = () => {
  const router = useRouter();
  const { admin, donations, isLoading, error, fetchAllDonations, logoutAdmin } =
    useAuthStore();

  useEffect(() => {
    // If admin is not authenticated, redirect to the admin login page
    if (!admin) {
      router.push('/admin/login');
    } else {
      // Fetch all donations when admin is authenticated
      fetchAllDonations();
    }
  }, [admin, fetchAllDonations, router]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      {admin && <p>Welcome, {admin.name}</p>}
      <button onClick={handleLogout}>Logout</button>
      <h2>All Donations</h2>
      {isLoading && <p>Loading donations...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {donations && donations.length > 0 ? (
        <ul>
          {donations.map((donation) => (
            <li key={donation._id}>
              <strong>{donation.tier}</strong> - ${donation.amount} -{' '}
              {donation.donationType}
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No donations found.</p>
      )}
    </div>
  );
};

export default AdminPage;
