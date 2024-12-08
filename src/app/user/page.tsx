"use client";
import { useRole } from "@/hooks/useRole";
import DashboardHead from "./usesrComponents/dashboardHead";
import DashboardUsercard from "./usesrComponents/dashboardUsercard";

export default function UserProfile() {
  useRole("user");

  return (
    <div>
      <header className="bg-white">
        <DashboardHead />
        <DashboardUsercard />
      </header>
    </div>
  );
}
