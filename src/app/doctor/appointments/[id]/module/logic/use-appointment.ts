'use client';

import { useState } from 'react';
import { useGetAppointmentByIdQuery } from "@/redux/api/appointment-api";
import { useGetUserByIdQuery } from "@/redux/api/UserApi";
import { useGetPrescriptionByUserIdQuery, useAddPrescriptionMutation } from "@/redux/api/prescription-api";
import { useGetAllConditionBooksByPatientIdQuery, useCreateConditionBookMutation } from "@/redux/api/condition-books";
import { BookStatus, SeverityLevel } from '@/types/condition-book-types';

interface DoctorSchedulePageProps {
  appointmentId?: string;
}


export const useAppointmentPage = ({ appointmentId }: DoctorSchedulePageProps) => {
  const { data: appointment, isLoading: isAppointmentLoading } = useGetAppointmentByIdQuery(appointmentId ?? "", { skip: !appointmentId || undefined });
  const { data: patient, isLoading: isPatientLoading } = useGetUserByIdQuery(appointment?.patient.id ?? "", { skip: !appointment?.patient.id || undefined });
  const { data: prescriptions, isLoading: isPrescriptionsLoading } = useGetPrescriptionByUserIdQuery(patient?.id ?? "", { skip: !patient?.id || undefined });
  const [addPrescription, { isLoading: isAddingPrescription }] = useAddPrescriptionMutation();
  const { data: conditionBooks, isLoading: isConditionBooksLoading } = useGetAllConditionBooksByPatientIdQuery(patient?.id ?? "", { skip: !patient?.id || undefined });
  const [createConditionBook, { isLoading: isCreatingConditionBook }] = useCreateConditionBookMutation();


  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [conditionBookModalOpen, setConditionBookModalOpen] = useState(false);
  const [openedConditionBookId, setOpenedConditionBookId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showNotification = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleOpenConditionBook = (conditionBookId: string) => {
    // store the opened book id so UI or navigation can react
    console.log('Opening condition book id:', conditionBookId);
    setOpenedConditionBookId(conditionBookId);
    // TODO: navigate or open detailed editor as needed
  };

  const handleCreatePrescription = async (data: {
    file: File;
    patientName: string;
    notes?: string
  }) => {
    try {
      if (!patient || !appointment) return;

      const payload = {
        file: data.file,
        patientName: data.patientName,
        doctorId: appointment.doctor.id,
        patientId: parseInt(patient.id)
      };

      // Enhanced logging for debugging
      console.log('Creating prescription with payload:', {
        fileName: data.file.name,
        fileSize: data.file.size,
        fileType: data.file.type,
        patientName: data.patientName,
        doctorId: appointment.doctor.id,
        patientId: parseInt(patient.id)
      });

      const result = await addPrescription(payload).unwrap();
      console.log('Prescription created successfully:', result);
      setPrescriptionModalOpen(false);
      showNotification('Prescription created successfully!', 'success');
    } catch (error: unknown) {
      console.error('Error creating prescription:', error);

      // Enhanced error logging
      const errorObj = error as { data?: { message?: string }; status?: number; message?: string };
      if (errorObj?.data) {
        console.error('Error data:', errorObj.data);
      }
      if (errorObj?.status) {
        console.error('Error status:', errorObj.status);
      }

      // More specific error messages
      let errorMessage = 'Failed to create prescription. Please try again.';
      if (errorObj?.data?.message) {
        errorMessage = errorObj.data.message;
      } else if (errorObj?.message) {
        errorMessage = errorObj.message;
      }

      showNotification(errorMessage, 'error');
    }
  };

  const handleCreateConditionBook = async (data: {
    title: string;
    status: BookStatus;
    onsetDate: Date;
    severity: SeverityLevel;
    allergies?: string;
    goals: Record<string, string>;
    instructions: string;
    reviewIntervalDays: number;
  }) => {
    try {
      if (!patient || !appointment) return;

      const payload = {
        patientId: patient.id,
        primaryDoctorId: appointment.doctor.id.toString(),
        title: data.title,
        status: data.status,
        onsetDate: data.onsetDate.toISOString().split('T')[0],
        severity: data.severity,
        allergies: data.allergies,
        goals: data.goals,
        instructions: data.instructions,
        reviewIntervalDays: data.reviewIntervalDays
      };

      await createConditionBook(payload).unwrap();
      setConditionBookModalOpen(false);
      showNotification('Condition book created successfully!', 'success');
    } catch (error) {
      console.error('Error creating condition book:', error);
      showNotification('Failed to create condition book. Please try again.', 'error');
    }
  };


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
    isCreatingConditionBook,
    prescriptionModalOpen,
    setPrescriptionModalOpen,
    conditionBookModalOpen,
    setConditionBookModalOpen,
    notification,
    showNotification,
    handleCloseNotification,
    handleCreatePrescription,
    handleCreateConditionBook
  ,
  openedConditionBookId,
  handleOpenConditionBook
  };
};
