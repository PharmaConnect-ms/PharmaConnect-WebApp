"use client";

import { useRole } from '@/hooks/useRole';

export default function AdminDashboard() {
  const user = useRole('admin'); // Redirects if not an admin

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>This is the Admin Dashboard</p>
    </div>
  );
}
