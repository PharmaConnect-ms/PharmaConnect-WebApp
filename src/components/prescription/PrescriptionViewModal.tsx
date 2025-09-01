'use client';

import React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon,
  CalendarToday as CalendarIcon,
  Assignment as AssignmentIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';
import { PrescriptionResponse } from '@/types/prescription-types';

interface PrescriptionViewModalProps {
  prescription: PrescriptionResponse | null;
  open: boolean;
  onClose: () => void;
}

const PrescriptionViewModal: React.FC<PrescriptionViewModalProps> = ({
  prescription,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!prescription) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = prescription.prescriptionImage;
    link.download = `prescription_${prescription.patientName}_${prescription.id.slice(-8)}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: fullScreen ? 0 : 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
          color: 'white',
          position: 'relative',
          pr: 6,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <AssignmentIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Prescription Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {prescription.patientName}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Patient and Doctor Information */}
        <Box sx={{ p: 3, backgroundColor: 'grey.50' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
            }}
          >
            {/* Patient Info */}
            <Box
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" color="primary.main">
                  Patient Information
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                {prescription.patientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patient ID: {prescription.patient.id}
              </Typography>
            </Box>

            {/* Doctor Info */}
            <Box
              sx={{
                p: 2,
                backgroundColor: 'white',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HospitalIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" color="primary.main">
                  Prescribed by
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                Dr. {prescription.doctor.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doctor ID: {prescription.doctor.id}
              </Typography>
            </Box>
          </Box>

          {/* Prescription Details */}
          <Box sx={{ mt: 3, p: 2, backgroundColor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'grey.200' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CalendarIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Prescription Details
              </Typography>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Prescription ID
                </Typography>
                <Chip
                  label={prescription.id.toUpperCase()}
                  size="small"
                  variant="outlined"
                  sx={{ fontFamily: 'monospace', mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Date Created
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {formatDate(prescription.createdAt)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Prescription Image */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <ZoomInIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="primary.main">
              Prescription Image
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '400px',
              backgroundColor: 'grey.100',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Image
              src={prescription.prescriptionImage}
              alt={`Prescription for ${prescription.patientName}`}
              fill
              style={{
                objectFit: 'contain',
              }}
              onError={(e) => {
                e.currentTarget.src = '/fallback-prescription.png';
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ p: 3, backgroundColor: 'grey.50' }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{
            background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4A9ADF 0%, #3BB5D6 100%)',
            },
          }}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionViewModal;
