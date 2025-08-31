'use client';
import { useState } from "react";
import { useGetUserByIdQuery, useGetAllDoctorsQuery } from "@/redux/api/UserApi";
import { useSelector } from 'react-redux';
import { selectAuthUser } from '@/redux/features/authSlice';
import { useGetAllDoctorSchedulesQuery } from "@/redux/api/doctor-schedule";

export const useAdminDashBoard = () => {
  const authUser = useSelector(selectAuthUser);
  const { data: userData, error: userError, isLoading: userLoading } = useGetUserByIdQuery(authUser?.userID ?? '');
  const { data: doctorsData, error: doctorsError, isLoading: doctorsLoading } = useGetAllDoctorsQuery();
  const { data: doctorSchedulesData, error: doctorSchedulesError, isLoading: doctorSchedulesLoading } = useGetAllDoctorSchedulesQuery();

  const [addNewScheduleModalOpen, setAddNewScheduleModalOpen] = useState(false);

  return {
    userData,
    userError,
    userLoading,
    doctorsData,
    doctorsError,
    doctorsLoading,
    addNewScheduleModalOpen,
    setAddNewScheduleModalOpen,
    doctorSchedulesData,
    doctorSchedulesError,
    doctorSchedulesLoading
  };
};
