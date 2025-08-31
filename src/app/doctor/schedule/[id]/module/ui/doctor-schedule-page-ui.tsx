'use client';
import React from 'react';
import { useDoctorSchedulePage } from "../logic/useDoctorSchedulePage";
import ResponsiveAppointmentView from "@/components/time-slots/ResponsiveAppointmentView";
import { AppointmentSlot } from '@/types/appointment-booking';
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

interface DoctorSchedulePageUIProps {
    scheduleId: string;
}

export default function DoctorSchedulePageUI({ scheduleId }: DoctorSchedulePageUIProps) {
  const { timeSlots } = useDoctorSchedulePage({ scheduleId });

  const handleViewDetails = (slot: AppointmentSlot) => {
    // TODO: Navigate to appointment details page
    console.log('Viewing appointment details:', {
      appointmentId: slot.appointment?.id,
      appointmentNo: slot.appointment?.appointmentNo,
      patient: slot.patientName,
      slotTime: `${slot.startTime} - ${slot.endTime}`,
      doctor: slot.doctorSchedule?.doctor?.username,
      date: slot.doctorSchedule?.date
    });
    // Example: router.push(`/appointments/${slot.appointment?.id}`);
  };

  // Loading state
  if (timeSlots === undefined) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: '#1976d2' }} />
        <Typography variant="h6" color="textSecondary">
          Loading appointment schedule...
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Schedule ID: {scheduleId}
        </Typography>
      </Box>
    );
  }

  // Error state - no data or empty array
  if (!timeSlots || (Array.isArray(timeSlots) && timeSlots.length === 0)) {
    return (
      <Box sx={{ p: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', border: '2px solid #e3f2fd' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
            No Appointment Slots Available
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            There are currently no appointment slots available for this schedule.
          </Typography>
          <Box sx={{ 
            backgroundColor: '#f5f5f5', 
            p: 2, 
            borderRadius: 1, 
            border: '1px solid #e0e0e0',
            mb: 2 
          }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              Schedule Details:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schedule ID: {scheduleId}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Please check back later or contact the clinic for assistance.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '60vh' }}>
      <ResponsiveAppointmentView
        timeSlots={Array.isArray(timeSlots) ? timeSlots : []}
        onViewDetails={handleViewDetails}
      />
    </Box>
  );
}
