'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Paper,
  Skeleton
} from '@mui/material';
import {
  Person as PersonIcon,
  LocalHospital as LocalHospitalIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

import { UserResponse } from '@/types';


// interface Doctor {
//   id: number;
//   username: string;
//   email: string;
//   phone: string | null;
//   address: string | null;
//   userSummary: string | null;
//   profilePicture: string | null;
//   age: number | null;
// }

interface DoctorSelectionGridProps {
  doctors: UserResponse[];
  selectedDoctorId: string | null;
  onDoctorSelect: (doctorId: string) => void;
  isLoading?: boolean;
}

const DoctorSelectionGrid: React.FC<DoctorSelectionGridProps> = ({
  doctors,
  selectedDoctorId,
  onDoctorSelect,
  isLoading = false
}) => {
  const [hoveredDoctor, setHoveredDoctor] = useState<string | null>(null);

  const handleDoctorClick = (doctorId: string) => {
    onDoctorSelect(doctorId);
  };

  const getDoctorInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Skeleton variant="circular" width={60} height={60} />
                  <Box flex={1}>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                </Box>
                <Skeleton variant="text" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={36} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          backgroundColor: '#f8f9fa',
          border: '2px dashed #dee2e6',
          textAlign: 'center'
        }}
      >
        <LocalHospitalIcon sx={{ fontSize: 48, color: '#6c757d', mb: 2 }} />
        <Typography variant="h5" fontWeight={600} color="text.primary" gutterBottom>
          Select Your Doctor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose a doctor to view their available appointment slots
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {doctors?.map((doctor) => {
          const isSelected = selectedDoctorId === doctor.id.toString();
          const isHovered = hoveredDoctor === doctor.id.toString();
          
          return (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isHovered ? 'translateY(-8px)' : 'none',
                  boxShadow: isSelected 
                    ? '0 8px 25px rgba(25, 118, 210, 0.3)'
                    : isHovered 
                      ? '0 12px 40px rgba(0,0,0,0.15)'
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
                  backgroundColor: isSelected ? '#f3f8ff' : 'white',
                  '&::before': isSelected ? {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                    borderRadius: 'inherit',
                    zIndex: -1,
                  } : {}
                }}
                onMouseEnter={() => setHoveredDoctor(doctor.id.toString())}
                onMouseLeave={() => setHoveredDoctor(null)}
                onClick={() => handleDoctorClick(doctor.id.toString())}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Doctor Avatar and Basic Info */}
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar
                      src={doctor.profilePicture || undefined}
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: isSelected ? '#1976d2' : '#42a5f5',
                        fontSize: 18,
                        fontWeight: 'bold',
                        border: isSelected ? '3px solid white' : 'none'
                      }}
                    >
                      {!doctor.profilePicture && (
                        doctor.username ? getDoctorInitials(doctor.username) : <PersonIcon />
                      )}
                    </Avatar>
                    
                    <Box flex={1}>
                      <Typography 
                        variant="h6" 
                        fontWeight={600}
                        color={isSelected ? '#1976d2' : 'text.primary'}
                        mb={0.5}
                      >
                        Dr. {doctor.username}
                      </Typography>
                      
                      {/* Mock specialization - in real app this would come from doctor data */}
                      <Chip
                        size="small"
                        label="General Medicine"
                        color="primary"
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  </Box>

                  {/* Doctor Details */}
                  <Box mb={3}>
                    {doctor.userSummary ? (
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4
                        }}
                      >
                        {doctor.userSummary}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Experienced healthcare provider committed to delivering quality patient care.
                      </Typography>
                    )}

                    {/* Mock rating - in real app this would come from reviews */}
                  

                    {doctor.address && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        📍 {doctor.address}
                      </Typography>
                    )}
                  </Box>

                  {/* Action Button */}
                  <Button
                    fullWidth
                    variant={isSelected ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    startIcon={isSelected ? <StarIcon /> : <ScheduleIcon />}
                    sx={{
                      fontWeight: 600,
                      py: 1.5,
                      backgroundColor: isSelected ? '#1976d2' : 'transparent',
                      '&:hover': {
                        backgroundColor: isSelected ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                      }
                    }}
                  >
                    {isSelected ? 'Selected' : 'View Schedule'}
                  </Button>
                </CardContent>

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
                      backgroundColor: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {!doctors?.length && !isLoading && (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: '#f8f9fa',
            border: '1px dashed #dee2e6'
          }}
        >
          <LocalHospitalIcon sx={{ fontSize: 64, color: '#6c757d', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Doctors Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please try again later or contact support for assistance.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default DoctorSelectionGrid;
