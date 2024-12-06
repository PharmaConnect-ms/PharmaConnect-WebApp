"use client";
import { useRole } from "@/hooks/useRole";
import DashboardHead from "./usesrComponents/dashboardHead";

export default function UserProfile() {
  useRole("user");

  return (
    <div>
      <header className="bg-white shadow">
        <DashboardHead />
      </header>
    </div>
  );
}
