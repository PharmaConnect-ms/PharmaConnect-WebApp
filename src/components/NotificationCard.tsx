'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  NotificationImportant as AppointmentIcon,
  Medication as MedicationIcon,
  EventNote as FollowUpIcon,
  Info as GeneralIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { NotificationInterface, NotificationType, NotificationStatus } from '@/types/notification-types';

interface NotificationCardProps {
  notification: NotificationInterface;
  onMarkAsRead: (notificationId: number) => void;
  isUpdating: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkAsRead,
  isUpdating,
}) => {
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.APPOINTMENT_REMINDER:
        return <AppointmentIcon />;
      case NotificationType.MEDICATION_REMINDER:
        return <MedicationIcon />;
      case NotificationType.FOLLOW_UP_REMINDER:
        return <FollowUpIcon />;
      case NotificationType.GENERAL_REMINDER:
        return <GeneralIcon />;
      default:
        return <GeneralIcon />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.APPOINTMENT_REMINDER:
        return '#4CAF50';
      case NotificationType.MEDICATION_REMINDER:
        return '#FF9800';
      case NotificationType.FOLLOW_UP_REMINDER:
        return '#2196F3';
      case NotificationType.GENERAL_REMINDER:
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const getStatusChip = (status: NotificationStatus) => {
    const statusConfig = {
      [NotificationStatus.ACTIVE]: { label: 'Active', color: 'success' as const },
      [NotificationStatus.FIRED]: { label: 'Fired', color: 'warning' as const },
      [NotificationStatus.EXPIRED]: { label: 'Expired', color: 'error' as const },
      [NotificationStatus.CANCELLED]: { label: 'Cancelled', color: 'default' as const },
    };

    return (
      <Chip
        label={statusConfig[status].label}
        color={statusConfig[status].color}
        size="small"
        variant="outlined"
      />
    );
  };

  const formatReminderTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const reminderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

      let dayLabel = '';
      if (reminderDate.getTime() === today.getTime()) {
        dayLabel = 'Today';
      } else if (reminderDate.getTime() === today.getTime() + 24 * 60 * 60 * 1000) {
        dayLabel = 'Tomorrow';
      } else {
        dayLabel = date.toLocaleDateString();
      }

      const timeLabel = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${dayLabel} at ${timeLabel}`;
    } catch {
      return timeString;
    }
  };

  const getTypeLabel = (type: NotificationType) => {
    switch (type) {
      case NotificationType.APPOINTMENT_REMINDER:
        return 'Appointment Reminder';
      case NotificationType.MEDICATION_REMINDER:
        return 'Medication Reminder';
      case NotificationType.FOLLOW_UP_REMINDER:
        return 'Follow-up Reminder';
      case NotificationType.GENERAL_REMINDER:
        return 'General Reminder';
      default:
        return 'Reminder';
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: notification.status === NotificationStatus.ACTIVE ? '2px solid' : '1px solid',
        borderColor: notification.status === NotificationStatus.ACTIVE 
          ? getNotificationColor(notification.type) 
          : 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-2px)',
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box display="flex" alignItems="center" flex={1}>
            <Avatar 
              sx={{ 
                bgcolor: getNotificationColor(notification.type),
                mr: 2,
                width: 40,
                height: 40
              }}
            >
              {getNotificationIcon(notification.type)}
            </Avatar>
            
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  {notification.title}
                </Typography>
                {getStatusChip(notification.status)}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {getTypeLabel(notification.type)}
              </Typography>

              {notification.description && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {notification.description}
                </Typography>
              )}

              <Box display="flex" alignItems="center" gap={0.5}>
                <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatReminderTime(notification.reminderTime)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {notification.status === NotificationStatus.ACTIVE && (
            <Tooltip title="Mark as completed">
              <IconButton
                onClick={() => onMarkAsRead(notification.id)}
                disabled={isUpdating}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              >
                <CheckIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
