'use client';
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  VideoCall as VideoCallIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { TimeSlotInterface, TimeSlotStatus } from '@/types/time-slots';
import { AppointmentSlot, APPOINTMENT_STATUS_CONFIG } from '@/types/appointment-booking';

interface MobileAppointmentListProps {
  timeSlots: TimeSlotInterface[];
  onSlotSelect?: (slot: AppointmentSlot) => void;
  selectedSlotId?: string;
}

const MobileAppointmentList: React.FC<MobileAppointmentListProps> = ({
  timeSlots,
  onSlotSelect,
  selectedSlotId
}) => {
  const transformedSlots: AppointmentSlot[] = timeSlots.map((slot, index) => ({
    ...slot,
    slotLabel: `Slot ${index + 1}`,
    slotPosition: index + 1,
    isBookable: slot.status === TimeSlotStatus.AVAILABLE,
    patientName: slot.appointment?.patient?.username,
    appointmentType: slot.appointment?.type
  }));

  return (
    <Paper elevation={1} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', m: { xs: 1, sm: 0 } }}>
      <Box sx={{ p: { xs: 2, sm: 3 }, backgroundColor: '#fafafa', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242' }}>
          Appointment Schedule
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Tap on any slot to view appointment information
        </Typography>
      </Box>
      
      <List disablePadding>
        {transformedSlots.map((slot, index) => {
          const statusConfig = APPOINTMENT_STATUS_CONFIG[slot.status];
          const isSelected = selectedSlotId === slot.id;
          
          return (
            <React.Fragment key={slot.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => onSlotSelect?.(slot)}
                  sx={{
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 2, sm: 3 },
                    backgroundColor: isSelected ? `${statusConfig.color}15` : 'transparent',
                    border: isSelected ? `2px solid ${statusConfig.color}` : '2px solid transparent',
                    borderRadius: 1,
                    mb: 0.5,
                    mx: { xs: 0.5, sm: 1 },
                    '&:hover': {
                      backgroundColor: `${statusConfig.color}10`
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      backgroundColor: statusConfig.backgroundColor,
                      color: statusConfig.color,
                      border: `2px solid ${statusConfig.color}`,
                      mr: 2
                    }}
                  >
                    <ScheduleIcon />
                  </Avatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {slot.startTime} - {slot.endTime}
                        </Typography>
                        <Chip
                          label={statusConfig.label}
                          size="small"
                          sx={{
                            backgroundColor: statusConfig.color,
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                          Duration: {slot.doctorSchedule?.slotDurationMinutes || 30} minutes
                        </Typography>
                        
                        {slot.patientName && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <PersonIcon sx={{ fontSize: '1rem' }} />
                            <Typography variant="body2" fontWeight="medium">
                              {slot.patientName}
                            </Typography>
                            {slot.appointment && (
                              <>
                                <Chip
                                  label={`#${slot.appointment.appointmentNo}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 20, fontSize: '0.7rem' }}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {slot.appointment.type === 'online' 
                                    ? <VideoCallIcon sx={{ fontSize: '1rem', color: '#4caf50' }} />
                                    : <LocalHospitalIcon sx={{ fontSize: '1rem', color: '#2196f3' }} />
                                  }
                                  <Typography variant="caption" sx={{ ml: 0.5, textTransform: 'capitalize' }}>
                                    {slot.appointment.type}
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Box>
                        )}

                        {slot.isBookable && (
                          <Typography variant="caption" sx={{ color: statusConfig.color, fontWeight: 'bold' }}>
                            Available
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < transformedSlots.length - 1 && (
                <Divider sx={{ mx: 2 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default MobileAppointmentList;
