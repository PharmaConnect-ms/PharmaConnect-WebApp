"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid
} from '@mui/material';
import { Close, Book } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BookStatus, SeverityLevel } from '@/types/condition-book-types';

interface CreateConditionBookModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    status: BookStatus;
    onsetDate: Date;
    severity: SeverityLevel;
    allergies?: string;
    goals: Record<string, string>;
    instructions: string;
    reviewIntervalDays: number;
  }) => void;
  isLoading?: boolean;
  patientName: string;
}

const CreateConditionBookModal: React.FC<CreateConditionBookModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  patientName
}) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'active' as BookStatus,
    onsetDate: new Date(),
    severity: 'normal' as SeverityLevel,
    allergies: '',
    instructions: '',
    reviewIntervalDays: 30
  });
  
  const [goals, setGoals] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);
  
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | number | Date | BookStatus | SeverityLevel) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleGoalChange = (index: number, field: 'key' | 'value', value: string) => {
    const updatedGoals = [...goals];
    updatedGoals[index][field] = value;
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    setGoals([...goals, { key: '', value: '' }]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.title.trim()) {
      setError('Please enter a condition title');
      return;
    }
    
    if (!formData.instructions.trim()) {
      setError('Please enter treatment instructions');
      return;
    }

    // Process goals
    const goalsObject: Record<string, string> = {};
    goals.forEach(goal => {
      if (goal.key.trim() && goal.value.trim()) {
        goalsObject[goal.key.trim()] = goal.value.trim();
      }
    });

    onSubmit({
      ...formData,
      goals: goalsObject,
      allergies: formData.allergies.trim() || undefined
    });
  };

  const handleClose = () => {
    setFormData({
      title: '',
      status: 'active',
      onsetDate: new Date(),
      severity: 'normal',
      allergies: '',
      instructions: '',
      reviewIntervalDays: 30
    });
    setGoals([{ key: '', value: '' }]);
    setError(null);
    onClose();
  };

  const getSeverityColor = (severity: SeverityLevel) => {
    switch (severity) {
      case 'mild': return '#4caf50';
      case 'normal': return '#ff9800';
      case 'severe': return '#f44336';
      default: return '#ff9800';
    }
  };

  const getStatusColor = (status: BookStatus) => {
    switch (status) {
      case 'active': return '#ff9800';
      case 'remission': return '#4caf50';
      case 'closed': return '#9e9e9e';
      default: return '#ff9800';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { minHeight: '600px' }
        }}
      >
        <DialogTitle className="flex items-center justify-between border-b">
          <Box className="flex items-center gap-3">
            <Book className="text-purple-600" />
            <Typography variant="h6" className="font-semibold">
              Create New Condition Book for {patientName}
            </Typography>
          </Box>
          <IconButton onClick={handleClose} disabled={isLoading}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent className="p-6">
          <Box className="space-y-6">
            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Basic Information */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Condition Title *"
                  placeholder="e.g., Chronic Headache"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Onset Date *"
                  value={formData.onsetDate}
                  onChange={(date) => {
                    const dateValue = date ? new Date(date.toString()) : new Date();
                    handleInputChange('onsetDate', dateValue);
                  }}
                  disabled={isLoading}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
            </Grid>

            {/* Status and Severity */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status *</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status *"
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    disabled={isLoading}
                  >
                    <MenuItem value="active">
                      <Box className="flex items-center gap-2">
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: getStatusColor('active') 
                          }} 
                        />
                        Active
                      </Box>
                    </MenuItem>
                    <MenuItem value="remission">
                      <Box className="flex items-center gap-2">
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: getStatusColor('remission') 
                          }} 
                        />
                        In Remission
                      </Box>
                    </MenuItem>
                    <MenuItem value="closed">
                      <Box className="flex items-center gap-2">
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: getStatusColor('closed') 
                          }} 
                        />
                        Closed
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Severity Level *</InputLabel>
                  <Select
                    value={formData.severity}
                    label="Severity Level *"
                    onChange={(e) => handleInputChange('severity', e.target.value)}
                    disabled={isLoading}
                  >
                    <MenuItem value="mild">
                      <Box className="flex items-center gap-2">
                        <Chip 
                          label="MILD" 
                          size="small" 
                          sx={{ bgcolor: getSeverityColor('mild'), color: 'white' }} 
                        />
                      </Box>
                    </MenuItem>
                    <MenuItem value="normal">
                      <Box className="flex items-center gap-2">
                        <Chip 
                          label="MODERATE" 
                          size="small" 
                          sx={{ bgcolor: getSeverityColor('normal'), color: 'white' }} 
                        />
                      </Box>
                    </MenuItem>
                    <MenuItem value="severe">
                      <Box className="flex items-center gap-2">
                        <Chip 
                          label="SEVERE" 
                          size="small" 
                          sx={{ bgcolor: getSeverityColor('severe'), color: 'white' }} 
                        />
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Treatment Instructions */}
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Treatment Instructions *"
              placeholder="Describe the treatment plan, medications, lifestyle changes..."
              value={formData.instructions}
              onChange={(e) => handleInputChange('instructions', e.target.value)}
              disabled={isLoading}
            />

            {/* Goals */}
            <Box>
              <Box className="flex items-center justify-between mb-3">
                <Typography variant="subtitle1" className="font-medium">
                  Treatment Goals
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={addGoal}
                  disabled={isLoading}
                >
                  Add Goal
                </Button>
              </Box>
              
              <Box className="space-y-3">
                {goals.map((goal, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Goal"
                        placeholder="e.g., Reduce pain"
                        value={goal.key}
                        onChange={(e) => handleGoalChange(index, 'key', e.target.value)}
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Target/Description"
                        placeholder="e.g., From 8/10 to 3/10"
                        value={goal.value}
                        onChange={(e) => handleGoalChange(index, 'value', e.target.value)}
                        disabled={isLoading}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Button
                        color="error"
                        size="small"
                        onClick={() => removeGoal(index)}
                        disabled={goals.length === 1 || isLoading}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Box>

            {/* Additional Information */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Known Allergies"
                  placeholder="e.g., Penicillin, Aspirin (or 'none')"
                  value={formData.allergies}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  disabled={isLoading}
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Review Interval (days)"
                  value={formData.reviewIntervalDays}
                  onChange={(e) => handleInputChange('reviewIntervalDays', parseInt(e.target.value))}
                  disabled={isLoading}
                  inputProps={{ min: 1, max: 365 }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <Box className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <Button 
            variant="outlined" 
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} /> : null}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? 'Creating...' : 'Create Condition Book'}
          </Button>
        </Box>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateConditionBookModal;
