'use client';
import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Container
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import { TimeSlotInterface, TimeSlotStatus } from '@/types/time-slots';
import { AppointmentSlot, TimeSlotGridProps } from '@/types/appointment-booking';
import AppointmentSlotCard from './AppointmentSlotCard';

const SimpleAppointmentGrid: React.FC<TimeSlotGridProps> = ({ 
  timeSlots, 
  onSlotSelect, 
  selectedSlotId 
}) => {
  // Transform time slots into appointment structure - each slot is individual
  const transformToAppointmentSlots = (slots: TimeSlotInterface[]): AppointmentSlot[] => {
    return slots.map((slot, index) => ({
      ...slot,
      slotLabel: `Slot ${index + 1}`,
      slotPosition: index + 1,
      isBookable: slot.status === TimeSlotStatus.AVAILABLE,
      patientName: slot.appointment?.patient?.username,
      appointmentType: slot.appointment?.type
    }));
  };

  const appointmentSlots = transformToAppointmentSlots(timeSlots || []);
  const doctorName = timeSlots?.[0]?.doctorSchedule?.doctor?.username;
  const scheduleDate = timeSlots?.[0]?.doctorSchedule?.date;

  return (
    <Container maxWidth="lg" sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          mb: 3, 
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderLeft: '4px solid #1976d2'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
              Doctor Schedule
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#424242' }}>
                Dr. {doctorName || 'Unknown'}
              </Typography>
              <Typography variant="h6" sx={{ color: '#757575' }}>
                {scheduleDate ? format(parseISO(scheduleDate), 'EEEE, MMMM do, yyyy') : 'Unknown Date'}
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={`${timeSlots?.length || 0} Appointments`} 
            variant="outlined"
            sx={{ 
              borderColor: '#1976d2',
              color: '#1976d2',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }} 
          />
        </Box>
      </Paper>

      {/* Appointment Slots - Simple Grid Layout */}
      <Box>
        {appointmentSlots.length === 0 ? (
          <Paper sx={{ p: { xs: 3, sm: 4, md: 6 }, textAlign: 'center', border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="textSecondary">
              No appointment slots available
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Please check back later or contact the clinic
            </Typography>
          </Paper>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              border: '1px solid #e0e0e0',
              overflow: 'hidden'
            }}
          >
            {/* Single Time Slots Grid */}
            <Box sx={{ 
              backgroundColor: '#f8f9fa',
              p: { xs: 1.5, sm: 2 },
              borderBottom: '1px solid #e0e0e0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                  Available Time Slots
                </Typography>
                <Chip 
                  label={`${appointmentSlots.length} slot${appointmentSlots.length !== 1 ? 's' : ''}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            </Box>

            {/* All slots in a single grid */}
            <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Grid container spacing={{ xs: 1, sm: 2 }} justifyContent="flex-start">
                {appointmentSlots.map((slot) => (
                  <Grid item key={slot.id}>
                    <AppointmentSlotCard
                      slot={slot}
                      isSelected={selectedSlotId === slot.id}
                      onSelect={() => onSlotSelect?.(slot)}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default SimpleAppointmentGrid;
