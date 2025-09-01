'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { format } from 'date-fns';
import JoinMeetingButton from '@/components/JoinMeetingButton';
import { AppointmentResponse } from '@/types/appointment-types';

interface UserAppointmentCardProps {
  appointment: AppointmentResponse;
  patientName: string;
}

const UserAppointmentCard: React.FC<UserAppointmentCardProps> = ({
  appointment,
  patientName
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card className="p-5 rounded-2xl border border-gray-200 shadow-sm bg-white hover:shadow-md transition">
      <CardContent className="p-0">
        <Box className="flex justify-between items-start">
          <Box className="flex-1">
            <Typography variant="h6" className="font-semibold mb-1">
              Dr. {appointment.doctor.username}
            </Typography>
            
            <Typography variant="body2" className="text-gray-500 mb-2">
              {format(new Date(appointment.scheduledAt), 'PPPPp')}
            </Typography>
            
            <Box className="flex items-center gap-2 mb-2">
              <Chip 
                label={appointment.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(appointment.status) as "primary" | "warning" | "success" | "error" | "default"}
                size="small"
                variant="outlined"
              />
              
              <Chip 
                label={appointment.type.toUpperCase()}
                color={appointment.type === 'online' ? 'info' : 'secondary'}
                size="small"
                variant="filled"
              />
            </Box>

            {appointment.notes && (
              <Typography variant="body2" className="text-gray-600 mb-2">
                Notes: {appointment.notes}
              </Typography>
            )}
          </Box>
          
          <Box className="text-right">
            <Typography variant="body2" className="font-medium text-blue-600 mb-1">
              Time Slot
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-1">
              {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
            </Typography>
            <Typography variant="caption" className="text-gray-500">
              Queue No: #{appointment.appointmentNo}
            </Typography>
          </Box>
        </Box>

        {/* Join Meeting Button for Online Appointments */}
        {appointment.type === 'online' && appointment.meetingLink && (
          <Box className="mt-4 flex justify-center">
            <JoinMeetingButton
              appointment={appointment}
              patientName={patientName}
              userType="patient"
              variant="contained"
              size="medium"
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UserAppointmentCard;
