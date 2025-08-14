"use client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DoctorDashboard from "./pages/doctor-dashboard/doctor-dashboard";


export default function DoctorPage() {
  useRequireAuth(['doctor']); 


  return (
      <DoctorDashboard />
  );
}
