'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  LocalHospital as LocalHospitalIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { AppointmentPayload } from '@/types/appointment-types';

interface BookingConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (bookingData: AppointmentPayload) => Promise<void>;
  selectedSlot: {
    id: string;
    doctorName: string;
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
  } | null;
  isLoading?: boolean;
}

const steps = ['Appointment Type', 'Add Notes', 'Confirmation'];

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  selectedSlot,
  isLoading = false
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [appointmentType, setAppointmentType] = useState<'physical' | 'online'>('physical');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) return;

    try {
      setError(null);
      const bookingData: AppointmentPayload = {
        timeSlotId: selectedSlot.id,
        patientId: 0, // This should be populated from auth context
        type: appointmentType,
        notes: notes.trim()
      };

      await onConfirm(bookingData);
      
      // Reset form
      setActiveStep(0);
      setAppointmentType('physical');
      setNotes('');
    } catch {
      setError('Failed to book appointment. Please try again.');
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setAppointmentType('physical');
    setNotes('');
    setError(null);
    onClose();
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Select Appointment Type
              </FormLabel>
              <RadioGroup
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as 'physical' | 'online')}
              >
                <FormControlLabel
                  value="physical"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <LocalHospitalIcon color="primary" />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          In-Person Visit
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Visit the clinic in person for your appointment
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 2, alignItems: 'flex-start' }}
                />
                <FormControlLabel
                  value="online"
                  control={<Radio />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <VideoCallIcon color="success" />
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          Online Consultation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Connect with your doctor through video call
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ alignItems: 'flex-start' }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <NotesIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Additional Notes (Optional)
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your symptoms, concerns, or any additional information for the doctor..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              This information will help your doctor prepare for the consultation.
            </Typography>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={3}>
              Confirm Your Appointment
            </Typography>
            
            <Box sx={{ backgroundColor: '#f8f9fa', borderRadius: 2, p: 3, mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <PersonIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={600}>
                  Doctor: {selectedSlot?.doctorName}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ScheduleIcon color="primary" />
                <Typography variant="body1">
                  {selectedSlot?.date} at {selectedSlot?.startTime} - {selectedSlot?.endTime}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1} mb={2}>
                {appointmentType === 'online' ? (
                  <VideoCallIcon color="success" />
                ) : (
                  <LocalHospitalIcon color="primary" />
                )}
                <Chip
                  label={appointmentType === 'online' ? 'Online Consultation' : 'In-Person Visit'}
                  color={appointmentType === 'online' ? 'success' : 'primary'}
                  variant="outlined"
                />
              </Box>

              {notes && (
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={500} mb={1}>
                    Notes:
                  </Typography>
                  <Typography variant="body2" sx={{ backgroundColor: 'white', p: 2, borderRadius: 1 }}>
                    {notes}
                  </Typography>
                </Box>
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Alert severity="info">
              You will receive a confirmation email once the appointment is booked successfully.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: 500
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={600}>
          Book Appointment
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Complete the steps below to book your appointment
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={isLoading}>
            Back
          </Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isLoading}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookingConfirmationModal;
