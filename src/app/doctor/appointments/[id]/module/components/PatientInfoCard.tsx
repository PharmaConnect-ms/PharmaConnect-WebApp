"use client";

import React from 'react';
import { Avatar, Box, Chip, Typography } from '@mui/material';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Person, Email, Phone, CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';
import { AppointmentResponse } from '@/types/appointment-types';
import PatientSummaryCard from '@/components/PatientSummaryCard';
import JoinMeetingButton from '@/components/JoinMeetingButton';

interface PatientInfoCardProps {
  patient: {
    id: string;
    username: string;
    userSummary?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    age?: number;
  };
  appointment: AppointmentResponse;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patient, appointment }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <Person className="text-blue-600" />
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Basic Info */}
        <Box className="flex items-start gap-4">
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            {getInitials(patient.username)}
          </Avatar>
          
          <Box className="flex-1">
            <Typography variant="h5" className="font-semibold text-gray-800">
              {patient.username}
            </Typography>
            
            <Box className="flex items-center gap-4 mt-2">
              {patient.age && (
                <Typography variant="body2" className="text-gray-600">
                  Age: {patient.age} years
                </Typography>
              )}
              
              <Chip 
                label={appointment.status.replace('_', ' ').toUpperCase()}
                color={getStatusColor(appointment.status) as "primary" | "warning" | "success" | "error" | "default"}
                size="small"
                variant="outlined"
              />
              
              <Chip 
                label={appointment.type.toUpperCase()}
                color="info"
                size="small"
                variant="outlined"
              />
              
              {/* Join Meeting Button for Online Appointments */}
              {appointment.type === 'online' && appointment.meetingLink && (
                <JoinMeetingButton
                  appointment={appointment}
                  patientName={patient.username}
                  userType="doctor"
                  variant="contained"
                  size="small"
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Patient Summary */}
        {patient.userSummary && (
          <Box className="mt-4">
            <PatientSummaryCard userSummary={patient.userSummary} />
          </Box>
        )}

        {/* Appointment Details */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
          <Box className="flex items-center gap-2">
            <CalendarToday className="text-gray-500 text-sm" />
            <Box>
              <Typography variant="caption" className="text-gray-500 block">
                Appointment Date
              </Typography>
              <Typography variant="body2" className="font-medium">
                {format(new Date(appointment.scheduledAt), 'PPP')}
              </Typography>
            </Box>
          </Box>
          
          <Box className="flex items-center gap-2">
            <Box>
              <Typography variant="caption" className="text-gray-500 block">
                Time Slot
              </Typography>
              <Typography variant="body2" className="font-medium">
                {appointment.timeSlot.startTime} - {appointment.timeSlot.endTime}
              </Typography>
            </Box>
          </Box>

          {patient.email && (
            <Box className="flex items-center gap-2">
              <Email className="text-gray-500 text-sm" />
              <Box>
                <Typography variant="caption" className="text-gray-500 block">
                  Email
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {patient.email}
                </Typography>
              </Box>
            </Box>
          )}

          {patient.phone && (
            <Box className="flex items-center gap-2">
              <Phone className="text-gray-500 text-sm" />
              <Box>
                <Typography variant="caption" className="text-gray-500 block">
                  Phone
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {patient.phone}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;
