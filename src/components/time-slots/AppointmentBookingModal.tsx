'use client';
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  MedicalServices as MedicalServicesIcon,
  VideoCall as VideoCallIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { AppointmentSlot } from '@/types/appointment-booking';
import { APPOINTMENT_STATUS_CONFIG } from '@/types/appointment-booking';
import { TimeSlotStatus } from '@/types/time-slots';

interface AppointmentViewModalProps {
  open: boolean;
  onClose: () => void;
  slot: AppointmentSlot | null;
  onViewDetails?: (slot: AppointmentSlot) => void;
}

const AppointmentViewModal: React.FC<AppointmentViewModalProps> = ({
  open,
  onClose,
  slot,
  onViewDetails
}) => {
  if (!slot) return null;

  const statusConfig = APPOINTMENT_STATUS_CONFIG[slot.status];
  const isBookable = slot.isBookable;
  const scheduleDate = slot.doctorSchedule?.date;

  const handleViewDetails = () => {
    onViewDetails?.(slot);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: statusConfig.backgroundColor,
        borderBottom: `3px solid ${statusConfig.color}`,
        textAlign: 'center',
        pb: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: statusConfig.textColor, mb: 1 }}>
          Appointment Slot Information
        </Typography>
        <Chip
          label={statusConfig.label}
          sx={{
            backgroundColor: statusConfig.color,
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Appointment Information */}
          <Paper variant="outlined" sx={{ p: 2, mb: 2, backgroundColor: '#fafafa' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#424242' }}>
              Appointment Information
            </Typography>
            <List disablePadding>
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocalHospitalIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Doctor"
                  secondary={`Dr. ${slot.doctorSchedule?.doctor?.username || 'Unknown'}`}
                  primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                />
              </ListItem>

              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CalendarTodayIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Date"
                  secondary={scheduleDate ? format(parseISO(scheduleDate), 'EEEE, MMMM do, yyyy') : 'Unknown'}
                  primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                />
              </ListItem>

              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AccessTimeIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Time"
                  secondary={`${slot.startTime} - ${slot.endTime}`}
                  primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                />
              </ListItem>

              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <MedicalServicesIcon sx={{ color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Duration"
                  secondary={`${slot.doctorSchedule?.slotDurationMinutes || 30} minutes`}
                  primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                />
              </ListItem>
            </List>
          </Paper>

          {/* Patient/Appointment Details (if booked) */}
          {slot.patientName && (
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f3f4f6' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#424242' }}>
                Patient Information
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PersonIcon sx={{ color: '#ff9800' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Patient Name"
                    secondary={slot.patientName}
                    primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                  />
                </ListItem>
                
                {slot.appointment && (
                  <>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <InfoIcon sx={{ color: '#ff9800' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary="Appointment Number"
                        secondary={`#${slot.appointment.appointmentNo}`}
                        primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                      />
                    </ListItem>

                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {slot.appointment.type === 'online' 
                          ? <VideoCallIcon sx={{ color: '#ff9800' }} />
                          : <LocalHospitalIcon sx={{ color: '#ff9800' }} />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary="Appointment Type"
                        secondary={
                          <Chip
                            label={slot.appointment.type === 'online' ? 'Online Consultation' : 'In-Person Visit'}
                            size="small"
                            sx={{ 
                              backgroundColor: slot.appointment.type === 'online' ? '#4caf50' : '#2196f3',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        }
                        primaryTypographyProps={{ fontWeight: 'bold', variant: 'body2' }}
                      />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#fafafa', gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Close
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* For booked appointments - only view details */}
          {!isBookable && slot.patientName && slot.status === TimeSlotStatus.BOOKED && (
            <Button
              onClick={handleViewDetails}
              variant="contained"
              color="primary"
              sx={{ minWidth: 140 }}
            >
              View Appointment
            </Button>
          )}

          {/* For completed appointments - view summary */}
          {!isBookable && slot.status === TimeSlotStatus.COMPLETED && (
            <Button
              onClick={handleViewDetails}
              variant="contained"
              color="success"
              sx={{ minWidth: 140 }}
            >
              View Summary
            </Button>
          )}

          {/* For cancelled appointments - view details */}
          {!isBookable && slot.status === TimeSlotStatus.CANCELLED && (
            <Button
              onClick={handleViewDetails}
              variant="outlined"
              color="error"
              sx={{ minWidth: 140 }}
            >
              View Details
            </Button>
          )}
          
        
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentViewModal;
