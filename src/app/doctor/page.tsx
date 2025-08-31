"use client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import DoctorDashboard from "./module/ui/doctor-dashboard";


export default function DoctorPage() {
  useRequireAuth(['doctor']); 


  return (
      <DoctorDashboard />
  );
}
