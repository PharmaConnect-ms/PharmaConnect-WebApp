'use client';

import React from 'react';
import { Typography, Paper } from '@mui/material';
import { NotificationsNone as NoNotificationsIcon } from '@mui/icons-material';

const EmptyReminderState: React.FC = () => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
        bgcolor: 'grey.50',
        border: '2px dashed',
        borderColor: 'grey.300',
        borderRadius: 2,
        p: 4
      }}
    >
      <NoNotificationsIcon 
        sx={{ 
          fontSize: 80, 
          color: 'grey.400',
          mb: 2
        }} 
      />
      
      <Typography 
        variant="h6" 
        color="text.secondary" 
        align="center"
        sx={{ mb: 1 }}
      >
        No reminders for today
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ maxWidth: 300 }}
      >
        You&apos;re all caught up! Check back later for new notifications and reminders.
      </Typography>
    </Paper>
  );
};

export default EmptyReminderState;
