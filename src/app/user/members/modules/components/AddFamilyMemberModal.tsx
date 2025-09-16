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
  Chip,
  Typography,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { RelationshipType, CareLevel, CreateFamilyMember } from "@/types/family-profile-type";

interface AddFamilyMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (member: CreateFamilyMember) => void;
  isLoading?: boolean;
  userId: string;
}

const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  userId,
}) => {
  const [formData, setFormData] = useState<Partial<CreateFamilyMember>>({
    name: "",
    age: 0,
    dateOfBirth: "",
    relationship: RelationshipType.CHILD,
    careLevel: CareLevel.INDEPENDENT,
    medicalNotes: "",
    allergies: [],
    medications: [],
    userId: userId,
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | number | RelationshipType | CareLevel) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies?.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...(prev.allergies || []), newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies?.filter(allergy => allergy !== allergyToRemove) || []
    }));
  };

  const addMedication = () => {
    if (newMedication.trim() && !formData.medications?.includes(newMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        medications: [...(prev.medications || []), newMedication.trim()]
      }));
      setNewMedication("");
    }
  };

  const removeMedication = (medicationToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications?.filter(med => med !== medicationToRemove) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.age || formData.age <= 0) {
      newErrors.age = "Valid age is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData as CreateFamilyMember);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      age: 0,
      dateOfBirth: "",
      relationship: RelationshipType.CHILD,
      careLevel: CareLevel.INDEPENDENT,
      medicalNotes: "",
      allergies: [],
      medications: [],
      userId: userId,
    });
    setNewAllergy("");
    setNewMedication("");
    setErrors({});
    onClose();
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
        <Typography variant="h5" fontWeight="600">
          Add Family Member
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom color="#42C5E7">
              Basic Information
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                fullWidth
                sx={{ minWidth: 300 }}
              />
              <TextField
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                error={!!errors.age}
                helperText={errors.age}
                sx={{ minWidth: 150 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, marginTop: 2, flexWrap: "wrap" }}>
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Relationship</InputLabel>
                <Select
                  value={formData.relationship}
                  onChange={(e) => handleInputChange("relationship", e.target.value)}
                  label="Relationship"
                >
                  {Object.values(RelationshipType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {type.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Care Level</InputLabel>
                <Select
                  value={formData.careLevel}
                  onChange={(e) => handleInputChange("careLevel", e.target.value)}
                  label="Care Level"
                >
                  {Object.values(CareLevel).map((level) => (
                    <MenuItem key={level} value={level}>
                      {level.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Medical Information */}
          <Box>
            <Typography variant="h6" gutterBottom color="#42C5E7">
              Medical Information
            </Typography>
            
            {/* Allergies */}
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Allergies
              </Typography>
              <Box sx={{ display: "flex", gap: 1, marginBottom: 1 }}>
                <TextField
                  label="Add allergy"
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  onClick={addAllergy}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={!newAllergy.trim()}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {formData.allergies?.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    onDelete={() => removeAllergy(allergy)}
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* Medications */}
            <Box sx={{ marginBottom: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Medications
              </Typography>
              <Box sx={{ display: "flex", gap: 1, marginBottom: 1 }}>
                <TextField
                  label="Add medication"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addMedication()}
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  onClick={addMedication}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  disabled={!newMedication.trim()}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {formData.medications?.map((medication, index) => (
                  <Chip
                    key={index}
                    label={medication}
                    onDelete={() => removeMedication(medication)}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            {/* Medical Notes */}
            <TextField
              label="Medical Notes"
              multiline
              rows={3}
              value={formData.medicalNotes}
              onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
              fullWidth
              placeholder="Any important medical information, conditions, or notes..."
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
          {isLoading ? "Adding..." : "Add Member"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFamilyMemberModal;
