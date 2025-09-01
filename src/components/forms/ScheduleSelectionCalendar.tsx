'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Skeleton,
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Schedule as ScheduleIcon,
  EventAvailable as AvailableIcon,
  EventBusy as BusyIcon
} from '@mui/icons-material';
import { DoctorScheduleType } from '@/types/doctor-schedule';
import { format, parseISO, isToday, isFuture, isPast } from 'date-fns';

interface ScheduleSelectionProps {
  schedules: DoctorScheduleType[];
  selectedScheduleId: string | null;
  onScheduleSelect: (scheduleId: string) => void;
  isLoading?: boolean;
  doctorName?: string;
}

const ScheduleSelectionCalendar: React.FC<ScheduleSelectionProps> = ({
  schedules,
  selectedScheduleId,
  onScheduleSelect,
  isLoading = false,
  doctorName
}) => {
  const [hoveredSchedule, setHoveredSchedule] = useState<string | null>(null);

  const getScheduleStatus = (schedule: DoctorScheduleType) => {
    const scheduleDate = parseISO(schedule.date);
    
    if (isPast(scheduleDate) && !isToday(scheduleDate)) {
      return { status: 'past', label: 'Past', color: '#757575', available: false };
    }
    
    if (isToday(scheduleDate)) {
      return { status: 'today', label: 'Today', color: '#1976d2', available: schedule.isActive };
    }
    
    if (isFuture(scheduleDate)) {
      return { status: 'future', label: 'Available', color: '#2e7d32', available: schedule.isActive };
    }
    
    return { status: 'unavailable', label: 'Unavailable', color: '#d32f2f', available: false };
  };

  const formatScheduleTime = (schedule: DoctorScheduleType) => {
    try {
      return `${schedule.startTime} - ${schedule.endTime}`;
    } catch {
      return 'Time not available';
    }
  };

  const formatScheduleDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return {
        dayName: format(date, 'EEEE'),
        date: format(date, 'MMM dd, yyyy'),
        dayNumber: format(date, 'dd'),
        month: format(date, 'MMM')
      };
    } catch {
      return {
        dayName: 'Unknown',
        date: dateString,
        dayNumber: '--',
        month: '---'
      };
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box flex={1}>
            <Skeleton variant="text" width="200px" height={32} />
            <Skeleton variant="text" width="150px" height={20} />
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (!schedules?.length) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No schedules available for the selected doctor. Please select a different doctor or try again later.
      </Alert>
    );
  }

  const activeSchedules = schedules.filter(schedule => {
    const status = getScheduleStatus(schedule);
    return status.available;
  });

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <CalendarIcon sx={{ fontSize: 32, color: '#1976d2' }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Select Appointment Date
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Available schedules for Dr. {doctorName}
          </Typography>
        </Box>
      </Box>

      {/* Schedule Grid */}
      <Grid container spacing={3}>
        {schedules.map((schedule) => {
          const isSelected = selectedScheduleId === schedule.id;
          const isHovered = hoveredSchedule === schedule.id;
          const statusInfo = getScheduleStatus(schedule);
          const dateInfo = formatScheduleDate(schedule.date);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={schedule.id}>
              <Card
                sx={{
                  cursor: statusInfo.available ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  transform: isHovered && statusInfo.available ? 'translateY(-4px)' : 'none',
                  boxShadow: isSelected
                    ? `0 8px 25px ${statusInfo.color}33`
                    : isHovered && statusInfo.available
                      ? '0 8px 20px rgba(0,0,0,0.1)'
                      : '0 2px 8px rgba(0,0,0,0.05)',
                  border: isSelected 
                    ? `2px solid ${statusInfo.color}` 
                    : '1px solid #e0e0e0',
                  opacity: statusInfo.available ? 1 : 0.6,
                  backgroundColor: isSelected 
                    ? `${statusInfo.color}08` 
                    : 'white'
                }}
                onMouseEnter={() => statusInfo.available && setHoveredSchedule(schedule.id)}
                onMouseLeave={() => setHoveredSchedule(null)}
                onClick={() => statusInfo.available && onScheduleSelect(schedule.id)}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  {/* Date Display - Theater Style */}
                  <Box mb={2}>
                    <Typography 
                      variant="h3" 
                      fontWeight="bold" 
                      color={isSelected ? statusInfo.color : 'text.primary'}
                      sx={{ lineHeight: 1 }}
                    >
                      {dateInfo.dayNumber}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight={500}
                      color={isSelected ? statusInfo.color : 'text.secondary'}
                      sx={{ mt: -0.5 }}
                    >
                      {dateInfo.month}
                    </Typography>
                  </Box>

                  {/* Day Name */}
                  <Typography 
                    variant="subtitle1" 
                    fontWeight={600}
                    color="text.primary"
                    gutterBottom
                  >
                    {dateInfo.dayName}
                  </Typography>

                  {/* Full Date */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    gutterBottom
                  >
                    {dateInfo.date}
                  </Typography>

                  {/* Time Slot */}
                  <Box display="flex" alignItems="center" justifyContent="center" gap={0.5} mb={2}>
                    <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatScheduleTime(schedule)}
                    </Typography>
                  </Box>

                  {/* Duration */}
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {schedule.slotDurationMinutes} min sessions
                  </Typography>

                  {/* Status Chip */}
                  <Chip
                    icon={statusInfo.available ? <AvailableIcon /> : <BusyIcon />}
                    label={statusInfo.label}
                    size="small"
                    sx={{
                      backgroundColor: statusInfo.available 
                        ? `${statusInfo.color}20` 
                        : '#f5f5f5',
                      color: statusInfo.available ? statusInfo.color : '#757575',
                      border: `1px solid ${statusInfo.color}40`,
                      fontWeight: 500
                    }}
                  />

                  {/* Selection Indicator */}
                  {isSelected && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: statusInfo.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 14,
                        fontWeight: 'bold'
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* No Available Schedules Message */}
      {activeSchedules.length === 0 && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mt: 4,
            textAlign: 'center', 
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7'
          }}
        >
          <CalendarIcon sx={{ fontSize: 48, color: '#856404', mb: 2 }} />
          <Typography variant="h6" color="#856404" gutterBottom>
            No Available Dates
          </Typography>
          <Typography variant="body2" color="#856404">
            The selected doctor has no available appointments at this time. 
            Please select a different doctor or check back later.
          </Typography>
        </Paper>
      )}

      {/* Quick Stats */}
      {schedules.length > 0 && (
        <Box mt={4} p={3} sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <Grid container spacing={2} textAlign="center">
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {schedules.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Dates
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {activeSchedules.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h6" fontWeight="bold" color="text.secondary">
                {schedules[0]?.slotDurationMinutes || 30}m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Session Duration
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default ScheduleSelectionCalendar;
