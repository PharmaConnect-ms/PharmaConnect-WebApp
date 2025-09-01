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
  Chip,
  Stack,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  DatePicker,
  LocalizationProvider
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  LocalHospital as LabIcon,
  Favorite as VitalsIcon,
  Medication as MedIcon,
  CameraAlt as ImagingIcon,
  AttachFile as AttachmentIcon,
  EventNote as VisitIcon,
  Note as NoteIcon
} from '@mui/icons-material';
import { CreateBookEntry, BookEntryType } from '@/types/book-entry-type';

interface MUICreateBookEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookEntry) => Promise<void>;
  bookId: string;
  isLoading?: boolean;
}

const entryTypes: { 
  value: BookEntryType; 
  label: string; 
  icon: React.ReactNode;
  description: string;
}[] = [
  { 
    value: 'visit', 
    label: 'Patient Visit', 
    icon: <VisitIcon />,
    description: 'Record a patient consultation or visit'
  },
  { 
    value: 'note', 
    label: 'Clinical Note', 
    icon: <NoteIcon />,
    description: 'Add general notes or observations'
  },
  { 
    value: 'lab', 
    label: 'Lab Results', 
    icon: <LabIcon />,
    description: 'Document laboratory test results'
  },
  { 
    value: 'vitals', 
    label: 'Vital Signs', 
    icon: <VitalsIcon />,
    description: 'Record patient vital measurements'
  },
  { 
    value: 'med_change', 
    label: 'Medication Change', 
    icon: <MedIcon />,
    description: 'Document medication adjustments'
  },
  { 
    value: 'imaging', 
    label: 'Imaging Results', 
    icon: <ImagingIcon />,
    description: 'Add radiology or imaging findings'
  },
  { 
    value: 'attachment', 
    label: 'File Attachment', 
    icon: <AttachmentIcon />,
    description: 'Attach external documents or files'
  },
];

const steps = ['Entry Type', 'Basic Information', 'Details & Review'];

const MUICreateBookEntryModal: React.FC<MUICreateBookEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bookId,
  isLoading = false,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateBookEntry>({
    bookId,
    entryDate: new Date().toISOString().split('T')[0],
    type: 'note',
    summary: '',
    details: '',
    attachedFileUrl: '',
    tags: '',
    appointmentId: '',
    prescriptionId: '',
    uploadedBy: 'doctor',
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const selectedEntryType = entryTypes.find(type => type.value === formData.type);

  const handleNext = () => {
    if (activeStep === 0 && !formData.type) {
      setError('Please select an entry type');
      return;
    }
    if (activeStep === 1 && !formData.summary.trim()) {
      setError('Please provide a summary');
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
    if (!formData.summary.trim()) {
      setError('Summary is required');
      return;
    }

    const payload: CreateBookEntry = {
      ...formData,
      bookId,
      entryDate: selectedDate.toISOString().split('T')[0],
      tags: tags.join(', ') || undefined,
      details: formData.details || undefined,
      attachedFileUrl: formData.attachedFileUrl || undefined,
      appointmentId: formData.appointmentId || undefined,
      prescriptionId: formData.prescriptionId || undefined,
    };

    try {
      await onSubmit(payload);
      handleClose();
    } catch (error) {
      console.error('Error creating book entry:', error);
      setError('Failed to create entry. Please try again.');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    const today = new Date();
    setFormData({
      bookId,
      entryDate: today.toISOString().split('T')[0],
      type: 'note',
      summary: '',
      details: '',
      attachedFileUrl: '',
      tags: '',
      appointmentId: '',
      prescriptionId: '',
      uploadedBy: 'doctor',
    });
    setSelectedDate(today);
    setActiveStep(0);
    setError('');
    setTags([]);
    setCurrentTag('');
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Select Entry Type
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose the type of entry you want to create
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
              {entryTypes.map((type) => (
                <Card 
                  key={type.value}
                  sx={{ 
                    cursor: 'pointer',
                    border: formData.type === type.value ? 2 : 1,
                    borderColor: formData.type === type.value ? 'primary.main' : 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 2,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>
                        {type.icon}
                      </Box>
                      <Typography variant="h6">
                        {type.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
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
              {selectedEntryType?.icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {selectedEntryType?.label} - Basic Information
              </Typography>
            </Box>

            <Stack spacing={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Entry Date"
                  value={selectedDate}
                  onChange={(newDate) => {
                    const dateValue = newDate instanceof Date ? newDate : newDate?.toDate() || new Date();
                    if (dateValue) {
                      setSelectedDate(dateValue);
                      setFormData(prev => ({ 
                        ...prev, 
                        entryDate: dateValue.toISOString().split('T')[0]
                      }));
                    }
                  }}
                  maxDate={new Date()}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      helperText: 'Select the date for this entry'
                    }
                  }}
                />
              </LocalizationProvider>

              <TextField
                label="Summary"
                value={formData.summary}
                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder={`Brief summary of the ${selectedEntryType?.label.toLowerCase()}...`}
                fullWidth
                required
                multiline
                rows={2}
                inputProps={{ maxLength: 280 }}
                helperText={`${formData.summary.length}/280 characters - This will be visible in the timeline`}
                error={formData.summary.trim() === ''}
              />

              <TextField
                label="Detailed Notes"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Add detailed information, observations, or notes..."
                fullWidth
                multiline
                rows={4}
                helperText="Optional: Add comprehensive details about this entry"
              />
            </Stack>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Additional Details & Review
            </Typography>

            <Stack spacing={3}>
              {/* Tags Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    label="Add Tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    size="small"
                    placeholder="Type and press Enter"
                    helperText="Add tags to categorize this entry"
                  />
                  <Button 
                    onClick={handleAddTag}
                    variant="outlined"
                    disabled={!currentTag.trim()}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <TextField
                label="Attachment URL"
                value={formData.attachedFileUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, attachedFileUrl: e.target.value }))}
                placeholder="https://example.com/document.pdf"
                fullWidth
                type="url"
                helperText="Optional: Link to external document or file"
              />

              <Divider />

              {/* Review Section */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Review Entry
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {selectedEntryType?.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {selectedEntryType?.label}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {selectedDate.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Summary:</strong> {formData.summary}
                    </Typography>
                    {formData.details && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Details:</strong> {formData.details}
                      </Typography>
                    )}
                    {tags.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" component="span">
                          <strong>Tags:</strong>
                        </Typography>
                        <Box sx={{ display: 'inline-flex', gap: 0.5, ml: 1 }}>
                          {tags.map((tag) => (
                            <Chip key={tag} label={tag} size="small" />
                          ))}
                        </Box>
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
            Create New Book Entry
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
            disabled={isLoading || !formData.summary.trim()}
            startIcon={isLoading ? null : <SaveIcon />}
          >
            {isLoading ? 'Creating...' : 'Create Entry'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default MUICreateBookEntryModal;
