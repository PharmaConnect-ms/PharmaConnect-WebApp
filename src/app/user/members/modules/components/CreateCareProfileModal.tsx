"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { CareTaskType, CareFrequency, CreateCareProfile } from "@/types/family-profile-type";

interface CreateCareProfileModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (profileData: CreateCareProfile) => void;
  familyMemberId: string;
  familyMemberName: string;
  userId: string;
  isLoading?: boolean;
}

const CreateCareProfileModal: React.FC<CreateCareProfileModalProps> = ({
  open,
  onClose,
  onSubmit,
  familyMemberId,
  familyMemberName,
  userId,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<CreateCareProfile>>({
    title: "",
    description: "",
    taskType: CareTaskType.MEDICATION,
    frequency: CareFrequency.DAILY,
    scheduledTime: "",
    daysOfWeek: [],
    instructions: "",
    familyMemberId: familyMemberId,
    userId: userId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const daysOfWeek = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const handleInputChange = (field: string, value: string | CareTaskType | CareFrequency | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleDayToggle = (day: string) => {
    const currentDays = formData.daysOfWeek || [];
    const updatedDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleInputChange("daysOfWeek", updatedDays);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.frequency === CareFrequency.WEEKLY && (!formData.daysOfWeek || formData.daysOfWeek.length === 0)) {
      newErrors.daysOfWeek = "Please select at least one day for weekly tasks";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData as CreateCareProfile);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      taskType: CareTaskType.MEDICATION,
      frequency: CareFrequency.DAILY,
      scheduledTime: "",
      daysOfWeek: [],
      instructions: "",
      familyMemberId: familyMemberId,
      userId: userId,
    });
    setErrors({});
    onClose();
  };

  const getTaskTypeColor = (taskType: CareTaskType) => {
    switch (taskType) {
      case CareTaskType.MEDICATION:
        return "#4CAF50";
      case CareTaskType.FEEDING:
        return "#FF9800";
      case CareTaskType.EXERCISE:
        return "#2196F3";
      case CareTaskType.CHECKUP:
        return "#9C27B0";
      case CareTaskType.THERAPY:
        return "#00BCD4";
      case CareTaskType.HYGIENE:
        return "#795548";
      default:
        return "#607D8B";
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
          borderRadius: "16px",
          padding: 1,
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ScheduleIcon sx={{ fontSize: 32, color: "#42C5E7", marginRight: 2 }} />
          <Box>
            <Typography variant="h5" fontWeight="600">
              Create Care Plan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For {familyMemberName}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom color="#42C5E7">
              Care Plan Details
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 2 }}>
              <TextField
                label="Care Plan Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
                sx={{ minWidth: 300 }}
                placeholder="e.g., Morning Medication, Physical Therapy Session"
              />
            </Box>
            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
              placeholder="Describe what this care plan involves..."
            />
          </Box>

          {/* Task Configuration */}
          <Box>
            <Typography variant="h6" gutterBottom color="#42C5E7">
              Task Configuration
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginBottom: 2 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Task Type</InputLabel>
                <Select
                  value={formData.taskType}
                  onChange={(e) => handleInputChange("taskType", e.target.value)}
                  label="Task Type"
                >
                  {Object.values(CareTaskType).map((type) => (
                    <MenuItem key={type} value={type}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: getTaskTypeColor(type),
                            marginRight: 1,
                          }}
                        />
                        {type.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={formData.frequency}
                  onChange={(e) => handleInputChange("frequency", e.target.value)}
                  label="Frequency"
                >
                  {Object.values(CareFrequency).map((freq) => (
                    <MenuItem key={freq} value={freq}>
                      {freq.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Scheduled Time"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 150 }}
              />
            </Box>

            {/* Days of Week Selection for Weekly Tasks */}
            {formData.frequency === CareFrequency.WEEKLY && (
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select Days of the Week
                </Typography>
                {errors.daysOfWeek && (
                  <Alert severity="error" sx={{ marginBottom: 2, padding: "4px 16px" }}>
                    {errors.daysOfWeek}
                  </Alert>
                )}
                <FormGroup row>
                  {daysOfWeek.map((day) => (
                    <FormControlLabel
                      key={day.value}
                      control={
                        <Checkbox
                          checked={formData.daysOfWeek?.includes(day.value) || false}
                          onChange={() => handleDayToggle(day.value)}
                          sx={{
                            color: "#42C5E7",
                            "&.Mui-checked": {
                              color: "#42C5E7",
                            },
                          }}
                        />
                      }
                      label={day.label}
                    />
                  ))}
                </FormGroup>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", marginTop: 1 }}>
                  {formData.daysOfWeek?.map((day) => (
                    <Chip
                      key={day}
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                      size="small"
                      color="primary"
                      onDelete={() => handleDayToggle(day)}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Instructions */}
          <Box>
            <Typography variant="h6" gutterBottom color="#42C5E7">
              Instructions & Notes
            </Typography>
            <TextField
              label="Detailed Instructions"
              multiline
              rows={4}
              value={formData.instructions}
              onChange={(e) => handleInputChange("instructions", e.target.value)}
              fullWidth
              placeholder="Provide detailed instructions on how to perform this care task..."
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ padding: 3, paddingTop: 1 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: "#42C5E7",
            "&:hover": {
              backgroundColor: "#32B5D7",
            },
          }}
        >
          {isLoading ? "Creating..." : "Create Care Plan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCareProfileModal;
