'use client';

import { useGetAppointmentByIdQuery } from "@/redux/api/appointment-api";
import { useGetUserByIdQuery } from "@/redux/api/UserApi";
import { useGetPrescriptionByUserIdQuery , useAddPrescriptionMutation } from "@/redux/api/prescription-api";
import { useGetAllConditionBooksByPatientIdQuery, useCreateConditionBookMutation } from "@/redux/api/condition-books";

interface DoctorSchedulePageProps {
  appointmentId?: string;
}


export const useAppointmentPage = ({ appointmentId }: DoctorSchedulePageProps) => {
  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentByIdQuery(appointmentId ?? "", { skip: !appointmentId || undefined });
  const { data: patient, isLoading: isPatientLoading } = useGetUserByIdQuery(appointment?.patient.id ?? "", { skip: !appointment?.patient.id || undefined });
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useGetPrescriptionByUserIdQuery(patient?.id ?? "", { skip: !patient?.id || undefined });
  const [addPrescription , { isLoading: isAddingPrescription }] = useAddPrescriptionMutation();
  const { data: conditionBooks, isLoading: isConditionBooksLoading } = useGetAllConditionBooksByPatientIdQuery(patient?.id ?? "", { skip: !patient?.id || undefined });
  const [createConditionBook, { isLoading: isCreatingConditionBook }] = useCreateConditionBookMutation();

console.log(prescriptions)

  return {
    appointment,
    isAppointmentLoading,
    patient,
    isPatientLoading,
    prescriptions,
    isPrescriptionsLoading,
    addPrescription,
    isAddingPrescription,
    conditionBooks,
    isConditionBooksLoading,
    createConditionBook,
    isCreatingConditionBook
  };
};
