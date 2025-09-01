"use client";

import React from 'react';
import { Container, Box, Grid, Alert, Snackbar } from '@mui/material';
import Loading from "@/components/ui/loading";
import { useAppointmentPage } from "../logic/use-appointment";
import PatientInfoCard from '../components/PatientInfoCard';
import PrescriptionList from '../components/PrescriptionList';
import ConditionBooks from '../components/ConditionBooks';
import CreatePrescriptionModal from '@/components/forms/CreatePrescriptionModal';
import CreateConditionBookModal from '@/components/forms/CreateConditionBookModal';

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
    isAddingPrescription,
    conditionBooks,
    isConditionBooksLoading,
    isCreatingConditionBook,
    prescriptionModalOpen,
    setPrescriptionModalOpen,
    conditionBookModalOpen,
    setConditionBookModalOpen,
    notification,
    handleCloseNotification,
    handleCreatePrescription,
    handleCreateConditionBook 
  , handleOpenConditionBook } = useAppointmentPage({ appointmentId: appointmentId });


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
                onOpenBook={handleOpenConditionBook}
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
