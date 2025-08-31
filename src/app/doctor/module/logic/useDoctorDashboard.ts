'use client';
import { useRouter } from 'next/navigation';
import { useGetAllSchedulesByDoctorIdQuery } from "@/redux/api/doctor-schedule";
import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";

export const useDoctorDashboard = () => {
  const user = useSelector(selectAuthUser);
  const { data: schedules, isLoading: loadingSchedules , isError: errorLoadingSchedules } = useGetAllSchedulesByDoctorIdQuery(user?.userID ?? "");
  const router = useRouter();

  // Handle error loading schedules
  if (errorLoadingSchedules) {
    console.error("Error loading schedules:", errorLoadingSchedules);
  }

  const onClickManagePatient = () => {
    router.push('/doctor/manage-patient');
  }

  const onClickDoctorSchedule = (id: string) => {
    router.push(`/doctor/schedule/${id}`);
  }

  return {
    onClickManagePatient,
    schedules,
    loadingSchedules,
    onClickDoctorSchedule
  };
};
