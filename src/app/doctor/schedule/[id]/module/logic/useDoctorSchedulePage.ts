'use client';
import { useGetAllTimeSlotsBySchedulerIdQuery } from "@/redux/api/time-slots";
import { AppointmentSlot } from '@/types/appointment-booking';
import { useRouter } from 'next/navigation';


 interface DoctorSchedulePageProps {
  scheduleId?: string;
}


export const useDoctorSchedulePage = ({ scheduleId }: DoctorSchedulePageProps) => {
  const { data: timeSlots } = useGetAllTimeSlotsBySchedulerIdQuery(scheduleId ?? "");
    const router = useRouter();

    const handleViewDetails = (slot: AppointmentSlot) => {

    router.push(`/doctor/appointments/${slot.appointment?.id}`);
    };
  

  return {
    timeSlots,
    handleViewDetails
  };
};
