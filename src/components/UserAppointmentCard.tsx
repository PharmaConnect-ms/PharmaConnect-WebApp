'use client';

import React from 'react';
import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { format } from 'date-fns';
import JoinMeetingButton from '@/components/JoinMeetingButton';
import { AppointmentResponse, AppointmentStatus } from '@/types/appointment-types';
import { useZoomMeeting } from '@/hooks/useZoomMeeting';

interface UserAppointmentCardProps {
  appointment: AppointmentResponse;
  patientName: string;
}

const UserAppointmentCard: React.FC<UserAppointmentCardProps> = ({
  appointment,
  patientName
}) => {
  const { joinMeeting } = useZoomMeeting();

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

  const handleCardClick = () => {
    // Only handle click for online appointments with meeting links that are scheduled
    if (appointment.type === 'online' && appointment.meetingLink && appointment.status === AppointmentStatus.SCHEDULED) {
      joinMeeting({
        appointmentId: appointment.id,
        meetingLink: appointment.meetingLink,
        patientName,
        doctorName: appointment.doctor.username,
        userType: 'patient'
      });
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={`p-5 rounded-2xl border border-gray-200 shadow-sm bg-white transition ${
        appointment.type === 'online' && appointment.meetingLink && appointment.status === AppointmentStatus.SCHEDULED
          ? 'cursor-pointer hover:shadow-lg hover:border-blue-300 hover:-translate-y-1'
          : 'hover:shadow-md'
      }`}
    >
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
              
              {appointment.type === 'online' && appointment.meetingLink && appointment.status === AppointmentStatus.SCHEDULED && (
                <Chip 
                  label="Click to Join"
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              )}
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
          <Box className="mt-4 flex justify-center" onClick={(e) => e.stopPropagation()}>
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
