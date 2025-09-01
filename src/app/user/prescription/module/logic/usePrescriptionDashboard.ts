'use client';


import { useState } from "react";
import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { useGetPrescriptionByUserIdQuery } from "@/redux/api/prescription-api";
import { useGetUserByIdQuery } from "@/redux/api/UserApi";
import { User } from "lucide-react";




export const usePrescriptionDashboard = () => {
  const user = useSelector(selectAuthUser);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { data: prescriptions, isLoading: loadingPrescriptions } = useGetPrescriptionByUserIdQuery(user?.userID ?? "");
  const { data: doctor, isLoading: loadingDoctor } = useGetUserByIdQuery(selectedDoctor ?? "" , {skip: !selectedDoctor});

  return {
    prescriptions,
    loadingPrescriptions,
    doctor,
    loadingDoctor,
    setSelectedDoctor,
    User
  };
};
