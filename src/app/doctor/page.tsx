// src/app/doctor/dashboard/page.tsx
import { useRole } from '@/hooks/useRole';

export default function DoctorDashboard() {
  const user = useRole('doctor');

  return (
    <div>
      <h1>Welcome, Dr. {user?.name}</h1>
      <p>This is the Doctor Dashboard</p>
    </div>
  );
}
