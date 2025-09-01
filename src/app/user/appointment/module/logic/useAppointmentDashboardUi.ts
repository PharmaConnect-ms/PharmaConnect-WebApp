'use client';

import { useState } from "react";
import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { useCreateAnAppointmentMutation, useGetAllAppointmentsByUserIdQuery } from "@/redux/api/appointment-api";
import { useGetAllDoctorsQuery } from "@/redux/api/UserApi";
import { useGetAllSchedulesByDoctorIdQuery } from "@/redux/api/doctor-schedule";
import { useGetAllTimeSlotsBySchedulerIdQuery } from "@/redux/api/time-slots";

export const useAppointmentDashboard = () => {
  const user = useSelector(selectAuthUser);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const { data: appointment, error: appointmentError , isLoading: isLoadingAppointment } = useGetAllAppointmentsByUserIdQuery(user?.userID ?? '');
  const [createAppointment, { isLoading: isCreating }] = useCreateAnAppointmentMutation();
  const { data: doctors, error: doctorsError , isLoading: isLoadingDoctors } = useGetAllDoctorsQuery();
  const { data: schedules, error: schedulesError , isLoading: isLoadingSchedules } = useGetAllSchedulesByDoctorIdQuery(selectedDoctorId ?? "", { skip: !selectedDoctorId });
  const { data: timeSlots, error: timeSlotsError , isLoading: isLoadingTimeSlots } = useGetAllTimeSlotsBySchedulerIdQuery(selectedScheduleId || '', { skip: !selectedScheduleId });

  return {
    appointment,
    appointmentError,   
    isLoadingAppointment,
    createAppointment,
    isCreating,
    doctors,
    doctorsError,
    isLoadingDoctors,
    schedules,
    schedulesError,
    isLoadingSchedules,
    timeSlots,
    timeSlotsError,
    isLoadingTimeSlots,
    selectedDoctorId,
    setSelectedDoctorId,
    selectedScheduleId,
    setSelectedScheduleId
  };
};
