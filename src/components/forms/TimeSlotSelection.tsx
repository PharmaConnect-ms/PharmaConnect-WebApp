'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Skeleton,
  Alert,
  Tooltip
} from '@mui/material';
import {
  AccessTime as TimeIcon,
  EventAvailable as AvailableIcon,
  EventBusy as BookedIcon,
  PersonAdd as BookIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { TimeSlotInterface, TimeSlotStatus } from '@/types/time-slots';
import { format, parseISO } from 'date-fns';

interface TimeSlotSelectionProps {
  timeSlots: TimeSlotInterface[];
  selectedSlotId: string | null;
  onSlotSelect: (slot: TimeSlotInterface) => void;
  onBookSlot: (slot: TimeSlotInterface) => void;
  isLoading?: boolean;
  doctorName?: string;
  selectedDate?: string;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  timeSlots,
  selectedSlotId,
  onSlotSelect,
  onBookSlot,
  isLoading = false,
  doctorName,
  selectedDate
}) => {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const getSlotConfig = (status: TimeSlotStatus) => {
    const configs = {
      [TimeSlotStatus.AVAILABLE]: {
        color: '#2e7d32',
        backgroundColor: '#e8f5e9',
        borderColor: '#4caf50',
        icon: <AvailableIcon />,
        label: 'Available',
        clickable: true,
        hoverColor: '#1b5e20'
      },
      [TimeSlotStatus.BOOKED]: {
        color: '#ed6c02',
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
        icon: <BookedIcon />,
        label: 'Booked',
        clickable: false,
        hoverColor: '#e65100'
      },
      [TimeSlotStatus.COMPLETED]: {
        color: '#1976d2',
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        icon: <BookedIcon />,
        label: 'Completed',
        clickable: false,
        hoverColor: '#0d47a1'
      },
      [TimeSlotStatus.CANCELLED]: {
        color: '#d32f2f',
        backgroundColor: '#ffebee',
        borderColor: '#f44336',
        icon: <BookedIcon />,
        label: 'Cancelled',
        clickable: false,
        hoverColor: '#b71c1c'
      },
      [TimeSlotStatus.NO_SHOW]: {
        color: '#757575',
        backgroundColor: '#f5f5f5',
        borderColor: '#9e9e9e',
        icon: <BookedIcon />,
        label: 'No Show',
        clickable: false,
        hoverColor: '#424242'
      }
    };
    return configs[status];
  };

  const formatTime = (timeString: string) => {
    try {
      // Assuming time format is HH:MM
      const [hours, minutes] = timeString.split(':');
      const hour12 = parseInt(hours) > 12 ? parseInt(hours) - 12 : parseInt(hours);
      const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const formatSelectedDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const groupSlotsByTimeOfDay = () => {
    const morning: TimeSlotInterface[] = [];
    const afternoon: TimeSlotInterface[] = [];
    const evening: TimeSlotInterface[] = [];

    timeSlots?.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morning, afternoon, evening };
  };

  if (isLoading) {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box flex={1}>
            <Skeleton variant="text" width="250px" height={32} />
            <Skeleton variant="text" width="180px" height={20} />
          </Box>
        </Box>
        
        <Grid container spacing={1}>
          {[...Array(12)].map((_, index) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!timeSlots?.length) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No time slots available for the selected date. Please select a different date.
      </Alert>
    );
  }

  const { morning, afternoon, evening } = groupSlotsByTimeOfDay();

  const renderTimeSlotGroup = (slots: TimeSlotInterface[], title: string, icon: React.ReactNode) => {
    if (!slots.length) return null;

    return (
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          {icon}
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
          <Chip 
            label={`${slots.length} slots`} 
            size="small" 
            variant="outlined" 
          />
        </Box>
        
        <Grid container spacing={1.5}>
          {slots.map((slot) => {
            const isSelected = selectedSlotId === slot.id;
            const isHovered = hoveredSlot === slot.id;
            const config = getSlotConfig(slot.status);
            const isClickable = config.clickable;

            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={slot.id}>
                <Tooltip
                  title={
                    slot.appointment 
                      ? `Booked by ${slot.appointment.patient.username}`
                      : config.label
                  }
                  arrow
                >
                  <Paper
                    elevation={isSelected ? 8 : isHovered && isClickable ? 4 : 1}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: isClickable ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSelected 
                        ? 'scale(1.05)' 
                        : isHovered && isClickable 
                          ? 'scale(1.02)' 
                          : 'scale(1)',
                      backgroundColor: isSelected 
                        ? config.backgroundColor
                        : isHovered && isClickable 
                          ? `${config.color}10`
                          : 'white',
                      border: `2px solid ${isSelected ? config.borderColor : isHovered && isClickable ? config.color : '#e0e0e0'}`,
                      opacity: isClickable ? 1 : 0.7,
                      '&:hover': isClickable ? {
                        boxShadow: `0 8px 25px ${config.color}30`,
                      } : {}
                    }}
                    onMouseEnter={() => isClickable && setHoveredSlot(slot.id)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onClick={() => isClickable && onSlotSelect(slot)}
                  >
                    {/* Time Display */}
                    <Typography 
                      variant="h6" 
                      fontWeight="bold"
                      color={isSelected ? config.color : 'text.primary'}
                      gutterBottom
                    >
                      {formatTime(slot.startTime)}
                    </Typography>

                    {/* Duration */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: '0.75rem', mb: 1 }}
                    >
                      {slot.doctorSchedule?.slotDurationMinutes || 30}min
                    </Typography>

                    {/* Status Indicator */}
                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                      {React.cloneElement(config.icon, { 
                        sx: { fontSize: 16, color: config.color } 
                      })}
                    </Box>

                    {/* Selection Ring for Theater Effect */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -3,
                          left: -3,
                          right: -3,
                          bottom: -3,
                          border: `3px solid ${config.color}`,
                          borderRadius: 'inherit',
                          animation: 'pulse 1.5s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.5 },
                            '100%': { opacity: 1 }
                          }
                        }}
                      />
                    )}
                  </Paper>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <TimeIcon sx={{ fontSize: 32, color: '#1976d2' }} />
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Select Time Slot
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Dr. {doctorName} • {formatSelectedDate(selectedDate)}
            </Typography>
          </Box>
        </Box>

        {/* Legend - Theater Style */}
        <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <Typography variant="body2" fontWeight={500} mb={1}>
            Slot Availability:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {Object.entries({
              [TimeSlotStatus.AVAILABLE]: 'Available for booking',
              [TimeSlotStatus.BOOKED]: 'Already booked',
              [TimeSlotStatus.COMPLETED]: 'Session completed',
              [TimeSlotStatus.CANCELLED]: 'Cancelled session'
            }).map(([status, description]) => {
              const config = getSlotConfig(status as TimeSlotStatus);
              return (
                <Box key={status} display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: config.backgroundColor,
                      border: `2px solid ${config.borderColor}`,
                      borderRadius: '50%'
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

      {/* Time Slot Groups */}
      {renderTimeSlotGroup(morning, 'Morning', <ScheduleIcon sx={{ color: '#ff9800' }} />)}
      {renderTimeSlotGroup(afternoon, 'Afternoon', <ScheduleIcon sx={{ color: '#2196f3' }} />)}
      {renderTimeSlotGroup(evening, 'Evening', <ScheduleIcon sx={{ color: '#9c27b0' }} />)}

      {/* Book Button */}
      {selectedSlotId && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<BookIcon />}
            onClick={() => {
              const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
              if (selectedSlot) {
                onBookSlot(selectedSlot);
              }
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 8,
              boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 12px 35px rgba(25, 118, 210, 0.4)',
              }
            }}
          >
            Book Selected Slot
          </Button>
        </Box>
      )}

      {/* Statistics */}
      <Paper elevation={0} sx={{ p: 3, mt: 4, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
        <Grid container spacing={2} textAlign="center">
          <Grid item xs={3}>
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {timeSlots.filter(s => s.status === TimeSlotStatus.AVAILABLE).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Available
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" fontWeight="bold" color="warning.main">
              {timeSlots.filter(s => s.status === TimeSlotStatus.BOOKED).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Booked
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {timeSlots.filter(s => s.status === TimeSlotStatus.COMPLETED).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6" fontWeight="bold" color="text.secondary">
              {timeSlots.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TimeSlotSelection;
