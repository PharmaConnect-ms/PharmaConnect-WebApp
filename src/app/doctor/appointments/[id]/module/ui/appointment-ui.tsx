"use client";

import React, { useState } from 'react';
import { Container, Box, Grid, Alert, Snackbar } from '@mui/material';
import Loading from "@/components/ui/loading";
import { useAppointmentPage } from "../logic/use-appointment";
import PatientInfoCard from '../components/PatientInfoCard';
import PrescriptionList from '../components/PrescriptionList';
import ConditionBooks from '../components/ConditionBooks';
import CreatePrescriptionModal from '@/components/forms/CreatePrescriptionModal';
import CreateConditionBookModal from '@/components/forms/CreateConditionBookModal';
import { BookStatus, SeverityLevel } from '@/types/condition-book-types';

interface AppointmentUIProps {
  appointmentId: string;
}

export default function AppointmentUI({ appointmentId }: AppointmentUIProps) {
  const { 
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
  } = useAppointmentPage({ appointmentId: appointmentId });

  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [conditionBookModalOpen, setConditionBookModalOpen] = useState(false);
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

      await addPrescription(payload).unwrap();
      setPrescriptionModalOpen(false);
      showNotification('Prescription created successfully!', 'success');
    } catch (error) {
      console.error('Error creating prescription:', error);
      showNotification('Failed to create prescription. Please try again.', 'error');
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

  if (isAppointmentLoading || isPatientLoading) {
    return (
      <Container maxWidth="xl" className="py-6">
        <Loading />
      </Container>
    );
  }

  if (!appointment) {
    return (
      <Container maxWidth="xl" className="py-6">
        <Alert severity="error" className="mb-4">
          Appointment not found. Please check the appointment ID and try again.
        </Alert>
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="xl" className="py-6">
        <Alert severity="error" className="mb-4">
          Patient information not found for this appointment.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" className="py-6">
        <Box className="space-y-6">
          {/* Patient Information Section */}
          <PatientInfoCard 
            patient={patient} 
            appointment={appointment}
          />

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Prescriptions Section */}
            <Grid item xs={12} lg={6}>
              <PrescriptionList
                prescriptions={prescriptions || []}
                isLoading={isPrescriptionsLoading}
                onCreatePrescription={() => setPrescriptionModalOpen(true)}
                isCreating={isAddingPrescription}
              />
            </Grid>

            {/* Condition Books Section */}
            <Grid item xs={12} lg={6}>
              <ConditionBooks
                conditionBooks={conditionBooks || []}
                isLoading={isConditionBooksLoading}
                onCreateConditionBook={() => setConditionBookModalOpen(true)}
                isCreating={isCreatingConditionBook}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Modals */}
      <CreatePrescriptionModal
        open={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        onSubmit={handleCreatePrescription}
        isLoading={isAddingPrescription}
        patientName={patient.username}
      />

      <CreateConditionBookModal
        open={conditionBookModalOpen}
        onClose={() => setConditionBookModalOpen(false)}
        onSubmit={handleCreateConditionBook}
        isLoading={isCreatingConditionBook}
        patientName={patient.username}
      />

      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
