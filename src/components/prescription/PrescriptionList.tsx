'use client';

import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Fab,
  Fade,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import PrescriptionCard from './PrescriptionCard';
import PrescriptionStats from './PrescriptionStats';
import { PrescriptionResponse } from '@/types/prescription-types';

interface PrescriptionListProps {
  prescriptions: PrescriptionResponse[] | undefined;
  loading: boolean;
  error?: string;
}

const PrescriptionList: React.FC<PrescriptionListProps> = ({
  prescriptions,
  loading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'doctor' | 'patient'>('date');

  // Filter and sort prescriptions
  const filteredAndSortedPrescriptions = React.useMemo(() => {
    if (!prescriptions) return [];

    const filtered = prescriptions.filter((prescription) =>
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort prescriptions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'doctor':
          return a.doctor.username.localeCompare(b.doctor.username);
        case 'patient':
          return a.patientName.localeCompare(b.patientName);
        default:
          return 0;
      }
    });

    return filtered;
  }, [prescriptions, searchTerm, sortBy]);

  const handleDownloadPrescription = (prescription: PrescriptionResponse) => {
    // Create a temporary anchor element to download the image
    const link = document.createElement('a');
    link.href = prescription.prescriptionImage;
    link.download = `prescription_${prescription.patientName}_${prescription.id.slice(-8)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" color="text.secondary">
          Loading your prescriptions...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 4,
        }}
      >
        {error}
      </Alert>
    );
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <Paper
        sx={{
          p: 6,
          textAlign: 'center',
          maxWidth: 500,
          mx: 'auto',
          mt: 4,
          background: 'linear-gradient(135deg, rgba(86, 170, 240, 0.05) 0%, rgba(66, 197, 231, 0.05) 100%)',
          border: '1px solid rgba(86, 170, 240, 0.1)',
        }}
      >
        <AssignmentIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
          No Prescriptions Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You don&apos;t have any prescriptions yet. Visit your doctor to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Statistics Overview */}
      <PrescriptionStats prescriptions={prescriptions} />

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          My Prescriptions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage all your medical prescriptions in one place
        </Typography>
      </Box>

      {/* Search and Filter Controls */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as 'date' | 'doctor' | 'patient')}
                startAdornment={<FilterIcon sx={{ mr: 1, color: 'action.active' }} />}
              >
                <MenuItem value="date">Date (Newest First)</MenuItem>
                <MenuItem value="doctor">Doctor Name</MenuItem>
                <MenuItem value="patient">Patient Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`${filteredAndSortedPrescriptions.length} Results`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Prescriptions Grid */}
      <Fade in timeout={300}>
        <Grid container spacing={4}>
          {filteredAndSortedPrescriptions.map((prescription, index) => (
            <Fade in timeout={300 + index * 100} key={prescription.id}>
              <Grid item xs={12} sm={6} lg={4} sx={{ display: 'flex' }}>
                <PrescriptionCard
                  prescription={prescription}
                  onDownload={handleDownloadPrescription}
                />
              </Grid>
            </Fade>
          ))}
        </Grid>
      </Fade>

      {/* Floating Action Button for Quick Actions */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4A9ADF 0%, #3BB5D6 100%)',
          },
        }}
        onClick={() => {
          // Handle add prescription action
          console.log('Add prescription clicked');
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default PrescriptionList;
