'use client';

import React from 'react';
import { Button } from '@mui/material';
import { VideoCall } from '@mui/icons-material';
import { AppointmentResponse } from '@/types/appointment-types';
import { useZoomMeeting } from '@/hooks/useZoomMeeting';

interface JoinMeetingButtonProps {
  appointment: AppointmentResponse;
  patientName: string;
  userType: 'doctor' | 'patient';
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const JoinMeetingButton: React.FC<JoinMeetingButtonProps> = ({
  appointment,
  patientName,
  userType,
  variant = 'contained',
  size = 'small',
  className = ''
}) => {
  const { joinMeeting } = useZoomMeeting();

  const handleJoinMeeting = () => {
    if (appointment.type === 'online' && appointment.meetingLink) {
      joinMeeting({
        appointmentId: appointment.id,
        meetingLink: appointment.meetingLink,
        patientName,
        doctorName: appointment.doctor.username,
        userType
      });
    }
  };

  // Only show button for online appointments with meeting links
  if (appointment.type !== 'online' || !appointment.meetingLink) {
    return null;
  }

  return (
    <Button
      variant={variant}
      color="primary"
      startIcon={<VideoCall />}
      onClick={handleJoinMeeting}
      size={size}
      className={className}
      sx={{
        backgroundColor: variant === 'contained' ? '#1976d2' : undefined,
        '&:hover': {
          backgroundColor: variant === 'contained' ? '#115293' : undefined,
        },
      }}
    >
      Join Meeting
    </Button>
  );
};

export default JoinMeetingButton;
