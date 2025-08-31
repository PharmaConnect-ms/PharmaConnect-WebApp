'use client';
import { useGetAllTimeSlotsBySchedulerIdQuery } from "@/redux/api/time-slots";

 interface DoctorSchedulePageProps {
  scheduleId?: string;
}


export const useDoctorSchedulePage = ({ scheduleId }: DoctorSchedulePageProps) => {
  const { data: timeSlots } = useGetAllTimeSlotsBySchedulerIdQuery(scheduleId ?? "");

  return {
    timeSlots
  };
};
