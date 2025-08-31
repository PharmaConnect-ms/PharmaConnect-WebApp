'use client';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EventAvailable as EventAvailableIcon,
  EventBusy as EventBusyIcon,
  VideoCall as VideoCallIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { AppointmentSlot } from '@/types/appointment-booking';
import { TimeSlotStatus } from '@/types/time-slots';
import { APPOINTMENT_STATUS_CONFIG } from '@/types/appointment-booking';

interface AppointmentSlotCardProps {
  slot: AppointmentSlot;
  isSelected: boolean;
  onSelect: () => void;
}

const AppointmentSlotCard: React.FC<AppointmentSlotCardProps> = ({ 
  slot, 
  isSelected, 
  onSelect 
}) => {
  const statusConfig = APPOINTMENT_STATUS_CONFIG[slot.status];
  
  const getStatusIcon = () => {
    switch (slot.status) {
      case TimeSlotStatus.AVAILABLE:
        return <EventAvailableIcon fontSize="small" />;
      case TimeSlotStatus.BOOKED:
        return <EventBusyIcon fontSize="small" />;
      case TimeSlotStatus.COMPLETED:
        return <CheckCircleIcon fontSize="small" />;
      case TimeSlotStatus.CANCELLED:
        return <CancelIcon fontSize="small" />;
      case TimeSlotStatus.NO_SHOW:
        return <EventBusyIcon fontSize="small" />;
      default:
        return <ScheduleIcon fontSize="small" />;
    }
  };

  const getAppointmentTypeIcon = () => {
    if (!slot.appointment) return null;
    return slot.appointment.type === 'online' 
      ? <VideoCallIcon fontSize="small" />
      : <LocalHospitalIcon fontSize="small" />;
  };

  const handleClick = () => {
    // Always allow viewing details for any slot
    onSelect();
  };

  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Time Slot Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Status: {statusConfig.label}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Time: {slot.startTime} - {slot.endTime}
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Duration: {slot.doctorSchedule?.slotDurationMinutes} minutes
          </Typography>
          {slot.patientName && (
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Patient: {slot.patientName}
            </Typography>
          )}
          {slot.appointment && (
            <>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Appointment: #{slot.appointment.appointmentNo}
              </Typography>
              <Typography variant="body2">
                Type: {slot.appointment.type}
              </Typography>
            </>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      <Card
        sx={{
          width: 140,
          height: 'auto',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          border: isSelected 
            ? `2px solid ${statusConfig.color}` 
            : `1px solid ${statusConfig.borderColor}`,
          backgroundColor: isSelected 
            ? `${statusConfig.color}15` 
            : statusConfig.backgroundColor,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
            borderColor: statusConfig.color
          },
          opacity: 1,
          position: 'relative'
        }}
        onClick={handleClick}
      >
        {/* Status indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: statusConfig.color
          }}
        />

        <CardContent sx={{ 
          p: 2, 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'space-between',
          '&:last-child': { pb: 2 }
        }}>
          {/* Time display */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 'bold',
                color: statusConfig.textColor,
                fontSize: '0.9rem'
              }}
            >
              {slot.startTime}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            >
              {slot.endTime}
            </Typography>
          </Box>

          {/* Status chip */}
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <Chip
              icon={getStatusIcon()}
              label={statusConfig.label}
              size="small"
              variant={slot.status === TimeSlotStatus.AVAILABLE ? "outlined" : "filled"}
              sx={{
                backgroundColor: slot.status === TimeSlotStatus.AVAILABLE 
                  ? 'transparent' 
                  : statusConfig.color,
                color: slot.status === TimeSlotStatus.AVAILABLE 
                  ? statusConfig.color 
                  : 'white',
                borderColor: statusConfig.color,
                fontSize: '0.7rem',
                height: 24,
                '& .MuiChip-icon': {
                  color: slot.status === TimeSlotStatus.AVAILABLE 
                    ? statusConfig.color 
                    : 'white',
                  fontSize: '0.8rem'
                }
              }}
            />
          </Box>

          {/* Patient/Appointment info */}
          {slot.patientName && (
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                <PersonIcon sx={{ fontSize: '0.8rem', mr: 0.5, color: 'text.secondary' }} />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.7rem',
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                >
                  {slot.patientName.length > 12 
                    ? `${slot.patientName.substring(0, 12)}...` 
                    : slot.patientName
                  }
                </Typography>
              </Box>

              {slot.appointment && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getAppointmentTypeIcon()}
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.65rem',
                      color: 'text.secondary',
                      ml: 0.5
                    }}
                  >
                    #{slot.appointment.appointmentNo}
                  </Typography>
                </Box>
              )}
            </Box>
          )}

        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default AppointmentSlotCard;
