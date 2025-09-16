"use client";

import React from "react";
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
  IconButton,
  Card,
  CardContent,
  Grid2 as Grid,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  LocalHospital as MedicalIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Cake as CakeIcon,
} from "@mui/icons-material";
import { FamilyMember, CareLevel } from "@/types/family-profile-type";

interface FamilyMemberDetailsModalProps {
  open: boolean;
  onClose: () => void;
  member: FamilyMember | null;
  onEdit?: (member: FamilyMember) => void;
  onCreateCareProfile?: (member: FamilyMember) => void;
}

const FamilyMemberDetailsModal: React.FC<FamilyMemberDetailsModalProps> = ({
  open,
  onClose,
  member,
  onEdit,
  onCreateCareProfile,
}) => {
  if (!member) return null;

  const getCareCareLevelColor = (level: CareLevel) => {
    switch (level) {
      case CareLevel.INDEPENDENT:
        return { bg: "#E8F5E8", color: "#2E7D32" };
      case CareLevel.ASSISTED:
        return { bg: "#FFF3E0", color: "#F57C00" };
      case CareLevel.DEPENDENT:
        return { bg: "#FFF3E0", color: "#F57C00" };
      case CareLevel.CRITICAL:
        return { bg: "#FFEBEE", color: "#D32F2F" };
      default:
        return { bg: "#F5F5F5", color: "#666" };
    }
  };

  const careColors = getCareCareLevelColor(member.careLevel);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#42C5E7",
              marginRight: 2,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="600">
              {member.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Family Member Details
            </Typography>
          </Box>
        </Box>
        <Box>
          {onEdit && (
            <IconButton
              onClick={() => onEdit(member)}
              sx={{ marginRight: 1, color: "#42C5E7" }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "12px", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#42C5E7">
                  Basic Information
                </Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CakeIcon sx={{ marginRight: 1, color: "#666", fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Age
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {member.age} years old
                      </Typography>
                    </Box>
                  </Box>

                  {member.dateOfBirth && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {formatDate(member.dateOfBirth)}
                      </Typography>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Relationship & Care Level
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={member.relationship.replace("_", " ").toLowerCase()}
                        size="small"
                        sx={{
                          backgroundColor: "#E3F2FD",
                          color: "#1565C0",
                          textTransform: "capitalize",
                        }}
                      />
                      <Chip
                        label={member.careLevel.replace("_", " ").toLowerCase()}
                        size="small"
                        sx={{
                          backgroundColor: careColors.bg,
                          color: careColors.color,
                          textTransform: "capitalize",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Medical Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ borderRadius: "12px", height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#42C5E7">
                  Medical Information
                </Typography>

                {/* Allergies */}
                <Box sx={{ marginBottom: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <WarningIcon sx={{ fontSize: 20, color: "#FF9800", marginRight: 1 }} />
                    <Typography variant="subtitle2" fontWeight="600">
                      Allergies
                    </Typography>
                  </Box>
                  {member.allergies && member.allergies.length > 0 ? (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {member.allergies.map((allergy, index) => (
                        <Chip
                          key={index}
                          label={allergy}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No known allergies
                    </Typography>
                  )}
                </Box>

                {/* Medications */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                    <MedicalIcon sx={{ fontSize: 20, color: "#4CAF50", marginRight: 1 }} />
                    <Typography variant="subtitle2" fontWeight="600">
                      Current Medications
                    </Typography>
                  </Box>
                  {member.medications && member.medications.length > 0 ? (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {member.medications.map((medication, index) => (
                        <Chip
                          key={index}
                          label={medication}
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No current medications
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Care Plans */}
          <Grid size={{ xs: 12 }}>
            <Card sx={{ borderRadius: "12px" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 24, color: "#42C5E7", marginRight: 1 }} />
                  <Typography variant="h6" color="#42C5E7">
                    Active Care Plans
                  </Typography>
                </Box>

                {member.careProfiles && member.careProfiles.length > 0 ? (
                  <Grid container spacing={2}>
                    {member.careProfiles.map((profile, index) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <Card
                          variant="outlined"
                          sx={{
                            borderRadius: "8px",
                            borderColor: "#42C5E7",
                            backgroundColor: "rgba(66, 197, 231, 0.05)",
                          }}
                        >
                          <CardContent sx={{ padding: 2 }}>
                            <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                              {profile.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {profile.description}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                              <Chip
                                label={profile.taskType.replace("_", " ").toLowerCase()}
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                              />
                              <Chip
                                label={profile.frequency.replace("_", " ").toLowerCase()}
                                size="small"
                                variant="outlined"
                                sx={{ textTransform: "capitalize" }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: "8px" }}>
                    No active care plans. You can create care plans to help manage this family member&apos;s care routine.
                    {onCreateCareProfile && (
                      <Button
                        onClick={() => onCreateCareProfile(member)}
                        size="small"
                        sx={{ marginTop: 1, display: "block" }}
                      >
                        Create First Care Plan
                      </Button>
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Medical Notes */}
          {member.medicalNotes && (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ borderRadius: "12px" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="#42C5E7">
                    Medical Notes
                  </Typography>
                  <Alert severity="info" sx={{ borderRadius: "8px" }}>
                    {member.medicalNotes}
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ padding: 3, paddingTop: 1 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {onCreateCareProfile && (
          <Button
            onClick={() => onCreateCareProfile(member)}
            variant="outlined"
            sx={{
              color: "#4CAF50",
              borderColor: "#4CAF50",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.04)",
                borderColor: "#4CAF50",
              },
            }}
          >
            Create Care Plan
          </Button>
        )}
        {onEdit && (
          <Button
            onClick={() => onEdit(member)}
            variant="contained"
            sx={{
              backgroundColor: "#42C5E7",
              "&:hover": {
                backgroundColor: "#32B5D7",
              },
            }}
          >
            Edit Member
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FamilyMemberDetailsModal;
