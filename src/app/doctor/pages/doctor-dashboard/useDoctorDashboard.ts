'use client';
import { useRouter } from 'next/navigation';

export const useDoctorDashboard = () => {
    const router = useRouter();

    const onClickManagePatient = () => {
        // Logic to manage patient
        router.push('/doctor/manage-patient');         
    }

  return {
    onClickManagePatient
  };
};
