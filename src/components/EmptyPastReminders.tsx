'use client';

import React from 'react';
import { Typography, Paper } from '@mui/material';
import { History as HistoryIcon } from '@mui/icons-material';

interface EmptyPastRemindersProps {
  tabType?: 'today' | 'upcoming' | 'past';
}

const EmptyPastReminders: React.FC<EmptyPastRemindersProps> = ({ tabType = 'today' }) => {
  const getContent = () => {
    switch (tabType) {
      case 'past':
        return {
          icon: <HistoryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />,
          title: 'No past reminders',
          description: 'Completed, expired, or cancelled reminders will appear here once you have some.'
        };
      case 'upcoming':
        return {
          icon: <HistoryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />,
          title: 'No upcoming reminders',
          description: 'Future reminders and notifications will appear here.'
        };
      default:
        return {
          icon: <HistoryIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />,
          title: 'No reminders for today',
          description: 'You&apos;re all caught up! Check back later for new notifications and reminders.'
        };
    }
  };

  const content = getContent();

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
      {content.icon}
      
      <Typography 
        variant="h6" 
        color="text.secondary" 
        align="center"
        sx={{ mb: 1 }}
      >
        {content.title}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        align="center"
        sx={{ maxWidth: 300 }}
      >
        {content.description}
      </Typography>
    </Paper>
  );
};

export default EmptyPastReminders;
