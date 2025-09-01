'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  QrCode as QrCodeIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import QRCode from 'react-qr-code';
import { PrescriptionResponse } from '@/types/prescription-types';

interface PrescriptionCardProps {
  prescription: PrescriptionResponse;
  onDownload?: (prescription: PrescriptionResponse) => void;
}

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescription,
  onDownload,
}) => {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/fallback-prescription.png';
  };

  const handleShowQR = () => {
    setQrDialogOpen(true);
  };

  const handleCloseQR = () => {
    setQrDialogOpen(false);
  };

  return (
    <Card
      sx={{
        width: '100%',
        height: 'auto',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[12],
        },
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: '1px solid rgba(86, 170, 240, 0.08)',
      }}
      elevation={2}
    >
      {/* Header with Patient Info */}
      <Box
        sx={{
          p: 2.5,
          pb: 2,
          background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
          color: 'white',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.4)',
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: '1.1rem' }}>
              {prescription.patientName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" sx={{ opacity: 0.95, fontSize: '0.85rem' }}>
                {formatDate(prescription.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Prescription Image */}
      <Box
        sx={{
          position: 'relative',
          height: 280,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          height="280"
          image={prescription.prescriptionImage}
          alt={`Prescription for ${prescription.patientName}`}
          onError={handleImageError}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f8f9fa',
            width: '100%',
            height: '100%',
          }}
        />
        {/* Subtle overlay for better text readability if needed */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ pt: 2.5, pb: 1, px: 2.5, flex: '1 1 auto' }}>
        {/* Doctor Information */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            p: 2,
            backgroundColor: 'rgba(86, 170, 240, 0.04)',
            borderRadius: 2,
            border: '1px solid rgba(86, 170, 240, 0.08)',
          }}
        >
          <HospitalIcon sx={{ color: 'primary.main', fontSize: 22 }} />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mb: 0.2 }}>
              Prescribed by
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'semibold', color: 'primary.main', fontSize: '0.9rem' }}>
              Dr. {prescription.doctor.username}
            </Typography>
          </Box>
        </Box>

        {/* Prescription ID */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            Prescription ID:
          </Typography>
          <Chip
            label={prescription.id.slice(-8).toUpperCase()}
            size="small"
            variant="outlined"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              borderColor: 'primary.main',
              color: 'primary.main',
            }}
          />
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 1, justifyContent: 'space-between', mt: 'auto' }}>
        <Button
          size="medium"
          variant="outlined"
          startIcon={<QrCodeIcon />}
          onClick={handleShowQR}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            borderRadius: 2,
            px: 2,
            py: 1,
            fontWeight: 'medium',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'white',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 8px rgba(86, 170, 240, 0.3)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          QR Code
        </Button>
        
        <Tooltip title="Download Prescription" arrow>
          <IconButton
            size="medium"
            onClick={() => onDownload?.(prescription)}
            sx={{
              color: 'primary.main',
              borderRadius: 2,
              p: 1,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(86, 170, 240, 0.3)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* QR Code Dialog */}
      <Dialog 
        open={qrDialogOpen} 
        onClose={handleCloseQR} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
          color: 'white',
          position: 'relative',
          pr: 6,
          py: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
              <QrCodeIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Prescription QR Code
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                Scan to access prescription online
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleCloseQR}
            sx={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4, textAlign: 'center', bgcolor: '#fafbfc' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" color="text.primary" sx={{ mb: 1, fontWeight: 'semibold' }}>
              {prescription.patientName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Issued on {formatDate(prescription.createdAt)}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            p: 3,
            backgroundColor: 'white',
            borderRadius: 3,
            border: '2px solid #f0f0f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            mb: 3
          }}>
            <QRCode
              value={prescription.prescriptionImage}
              size={150}
              style={{ height: "auto", maxWidth: "80%", width: "70%" }}
              bgColor="#ffffff"
              fgColor="#56AAF0"
              level="M"
            />
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Scan this QR code with your camera app to view the prescription
          </Typography>
          
          <Box sx={{ 
            mt: 3, 
            p: 2.5, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 2,
            border: '1px solid #e9ecef'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.8rem' }}>
              Direct Link:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                wordBreak: 'break-all',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                color: 'primary.main',
                backgroundColor: 'white',
                p: 1,
                borderRadius: 1,
                border: '1px solid #dee2e6'
              }}
            >
              {prescription.prescriptionImage}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, bgcolor: '#fafbfc' }}>
          <Button 
            onClick={handleCloseQR} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #56AAF0 0%, #42C5E7 100%)',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 'medium',
              '&:hover': {
                background: 'linear-gradient(135deg, #4A9ADF 0%, #3BB5D6 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(86, 170, 240, 0.4)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PrescriptionCard;
