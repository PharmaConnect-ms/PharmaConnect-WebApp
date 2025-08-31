"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import AdminDashboardUI from "./ui/admin-dashboard";

export default function AdminDashboard() {
  useRequireAuth(['admin']); 

  return (
    <AdminDashboardUI />
  );
}
