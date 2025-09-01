import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton
} from '@mui/material';
import {
  DateTimePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  LocalHospital as ReviewIcon,
  Science as LabIcon,
  Medication as RxIcon,
  MedicalServices as ProcedureIcon,
  NotificationImportant as PushIcon,
  Sms as SmsIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { CreateFollowUpRequest, FollowUpKind, ReminderChannel } from '@/types/follow-ups-types';
import { addDays, addHours, format } from 'date-fns';

interface MUICreateFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFollowUpRequest) => Promise<void>;
  bookId: string;
  isLoading?: boolean;
}

const followUpKinds: { 
  value: FollowUpKind; 
  label: string; 
  icon: React.ReactNode;
  description: string;
  suggestedDays?: number;
}[] = [
  { 
    value: 'review', 
    label: 'General Review', 
    icon: <ReviewIcon />,
    description: 'Schedule a follow-up review appointment',
    suggestedDays: 14
  },
  { 
    value: 'lab_review', 
    label: 'Lab Results Review', 
    icon: <LabIcon />,
    description: 'Review laboratory test results',
    suggestedDays: 7
  },
  { 
    value: 'repeat_rx', 
    label: 'Prescription Renewal', 
    icon: <RxIcon />,
    description: 'Schedule medication prescription renewal',
    suggestedDays: 30
  },
  { 
    value: 'procedure', 
    label: 'Medical Procedure', 
    icon: <ProcedureIcon />,
    description: 'Schedule a medical procedure or treatment',
    suggestedDays: 21
  },
];

const reminderChannels: { 
  value: ReminderChannel; 
  label: string; 
  icon: React.ReactNode;
  description: string;
}[] = [
  { 
    value: 'push', 
    label: 'Push Notification', 
    icon: <PushIcon />,
    description: 'Send notifications through the app'
  },
  { 
    value: 'sms', 
    label: 'SMS Text Message', 
    icon: <SmsIcon />,
    description: 'Send text messages to mobile phone'
  },
  { 
    value: 'email', 
    label: 'Email Notification', 
    icon: <EmailIcon />,
    description: 'Send email reminders'
  },
];

const steps = ['Follow-up Type', 'Schedule & Timing', 'Reminders & Review'];

const MUICreateFollowUpModal: React.FC<MUICreateFollowUpModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bookId,
  isLoading = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateFollowUpRequest>({
    bookId,
    dueAt: '',
    kind: 'review',
    notes: '',
    remindAt1: '',
    remindAt2: '',
    channel: 'push',
  });

  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminders, setReminders] = useState<Date[]>([]);
  const [error, setError] = useState<string>('');

  const selectedFollowUpKind = followUpKinds.find(kind => kind.value === formData.kind);
  const selectedChannel = reminderChannels.find(channel => channel.value === formData.channel);

  const handleNext = () => {
    if (activeStep === 0 && !formData.kind) {
      setError('Please select a follow-up type');
      return;
    }
    if (activeStep === 1 && !dueDate) {
      setError('Please select a due date and time');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    const payload: CreateFollowUpRequest = {
      ...formData,
      bookId,
      dueAt: dueDate.toISOString(),
      notes: formData.notes || undefined,
      remindAt1: reminders[0] ? reminders[0].toISOString() : undefined,
      remindAt2: reminders[1] ? reminders[1].toISOString() : undefined,
    };

    try {
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      console.error('Error creating follow-up:', error);
      setError('Failed to schedule follow-up. Please try again.');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      bookId,
      dueAt: '',
      kind: 'review',
      notes: '',
      remindAt1: '',
      remindAt2: '',
      channel: 'push',
    });
    setDueDate(null);
    setReminders([]);
    setActiveStep(0);
    setError('');
  };

  const handleKindChange = (kind: FollowUpKind) => {
    setFormData(prev => ({ ...prev, kind }));
    
    // Auto-suggest due date based on kind
    const kindInfo = followUpKinds.find(k => k.value === kind);
    if (kindInfo?.suggestedDays) {
      const suggestedDate = addDays(new Date(), kindInfo.suggestedDays);
      setDueDate(suggestedDate);
    }
  };

  const handleAddReminder = () => {
    if (reminders.length < 2 && dueDate) {
      // Add a reminder 24 hours before due date by default
      const newReminder = addHours(dueDate, -24);
      setReminders([...reminders, newReminder]);
    }
  };

  const handleRemoveReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const handleUpdateReminder = (index: number, newDate: any) => {
    const dateValue = newDate instanceof Date ? newDate : newDate?.toDate() || null;
    if (dateValue) {
      const updatedReminders = [...reminders];
      updatedReminders[index] = dateValue;
      setReminders(updatedReminders);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Follow-up Type
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose what type of follow-up you want to schedule
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
              {followUpKinds.map((kind) => (
                <Card 
                  key={kind.value}
                  sx={{ 
                    cursor: 'pointer',
                    border: formData.kind === kind.value ? 2 : 1,
                    borderColor: formData.kind === kind.value ? 'primary.main' : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleKindChange(kind.value)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>
                        {kind.icon}
                      </Box>
                      <Typography variant="h6">
                        {kind.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {kind.description}
                    </Typography>
                    {kind.suggestedDays && (
                      <Chip 
                        label={`Typically in ${kind.suggestedDays} days`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              {selectedFollowUpKind?.icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedFollowUpKind?.label} - Schedule & Timing
              </Typography>
            </Box>

            <Stack spacing={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Due Date & Time"
                  value={dueDate}
                  onChange={(newDate) => {
                    const dateValue = newDate instanceof Date ? newDate : newDate?.toDate() || null;
                    setDueDate(dateValue);
                    if (dateValue) {
                      setFormData(prev => ({ 
                        ...prev, 
                        dueAt: dateValue.toISOString()
                      }));
                    }
                  }}
                  minDateTime={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: 'When should this follow-up be completed?'
                    }
                  }}
                />
              </LocalizationProvider>

              <TextField
                label="Notes & Instructions"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={`Add specific instructions for this ${selectedFollowUpKind?.label.toLowerCase()}...`}
                fullWidth
                multiline
                rows={4}
                helperText="Optional: Add detailed instructions or context for this follow-up"
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Notification Channel
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  How would you like to be reminded about this follow-up?
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
                  {reminderChannels.map((channel) => (
                    <Card 
                      key={channel.value}
                      sx={{ 
                        cursor: 'pointer',
                        border: formData.channel === channel.value ? 2 : 1,
                        borderColor: formData.channel === channel.value ? 'secondary.main' : 'divider',
                        transition: 'all 0.2s',
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, channel: channel.value }))}
                    >
                      <CardContent sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ mr: 1, color: 'secondary.main' }}>
                            {channel.icon}
                          </Box>
                          <Typography variant="body2">
                            {channel.label}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Reminders & Final Review
            </Typography>

            <Stack spacing={3}>
              {/* Reminders Section */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    Reminders ({reminders.length}/2)
                  </Typography>
                  <Button
                    onClick={handleAddReminder}
                    disabled={reminders.length >= 2 || !dueDate}
                    startIcon={<AddIcon />}
                    size="small"
                  >
                    Add Reminder
                  </Button>
                </Box>

                {reminders.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No reminders set. Click &quot;Add Reminder&quot; to set up notifications.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {reminders.map((reminder, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DateTimePicker
                            label={`Reminder ${index + 1}`}
                            value={reminder}
                            onChange={(newDate) => handleUpdateReminder(index, newDate)}
                            maxDateTime={dueDate || undefined}
                            slotProps={{
                              textField: {
                                size: 'small',
                                sx: { flexGrow: 1 }
                              }
                            }}
                          />
                        </LocalizationProvider>
                        <IconButton 
                          onClick={() => handleRemoveReminder(index)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              <Divider />

              {/* Review Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Review Follow-up
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {selectedFollowUpKind?.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {selectedFollowUpKind?.label}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Due:</strong> {dueDate ? format(dueDate, 'PPpp') : 'Not set'}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Channel:</strong> {selectedChannel?.label}
                    </Typography>
                    
                    {formData.notes && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Notes:</strong> {formData.notes}
                      </Typography>
                    )}
                    
                    {reminders.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          <strong>Reminders:</strong>
                        </Typography>
                        {reminders.map((reminder, index) => (
                          <Chip 
                            key={index}
                            label={format(reminder, 'MMM dd, yyyy HH:mm')}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: '600px' }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            Schedule Follow-up
          </Typography>
          <Button 
            onClick={handleClose}
            color="inherit"
            disabled={isLoading}
          >
            <CloseIcon />
          </Button>
        </Box>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ minHeight: 400 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            disabled={isLoading}
          >
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
            onClick={handleSubmit}
            disabled={isLoading || !dueDate}
            startIcon={isLoading ? null : <SaveIcon />}
          >
            {isLoading ? 'Scheduling...' : 'Schedule Follow-up'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MUICreateFollowUpModal;
