'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  LocalHospital as HospitalIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { PrescriptionResponse } from '@/types/prescription-types';

interface PrescriptionStatsProps {
  prescriptions: PrescriptionResponse[] | undefined;
}

const PrescriptionStats: React.FC<PrescriptionStatsProps> = ({ prescriptions }) => {
  if (!prescriptions) return null;

  // Calculate simple statistics
  const totalPrescriptions = prescriptions.length;
  const uniqueDoctors = new Set(prescriptions.map(p => p.doctor.id)).size;
  
  // Recent prescriptions (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentPrescriptions = prescriptions.filter(p => 
    new Date(p.createdAt) > sevenDaysAgo
  ).length;

  const stats = [
    {
      title: 'Total Prescriptions',
      value: totalPrescriptions,
      icon: <AssignmentIcon />,
      color: '#56AAF0',
      bgColor: 'rgba(86, 170, 240, 0.1)',
    },
    {
      title: 'Unique Doctors',
      value: uniqueDoctors,
      icon: <HospitalIcon />,
      color: '#42C5E7',
      bgColor: 'rgba(66, 197, 231, 0.1)',
    },
    {
      title: 'Recent (7 days)',
      value: recentPrescriptions,
      icon: <ScheduleIcon />,
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
  ];

  return (
    <Paper
      sx={{
        mb: 4,
        p: 4,
        background: 'linear-gradient(135deg, rgba(86, 170, 240, 0.02) 0%, rgba(66, 197, 231, 0.02) 100%)',
        border: '1px solid rgba(86, 170, 240, 0.08)',
        borderRadius: 3,
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 1
          }}
        >
          Prescription Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your prescription statistics at a glance
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: stat.bgColor,
                border: `1px solid ${stat.color}20`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${stat.color}20`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: stat.color,
                    width: 56,
                    height: 56,
                    boxShadow: `0 4px 12px ${stat.color}30`,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: stat.color,
                      lineHeight: 1,
                      mb: 0.5
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 'medium'
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PrescriptionStats;
