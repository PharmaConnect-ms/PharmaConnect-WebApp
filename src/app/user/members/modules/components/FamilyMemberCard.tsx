"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Avatar,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Edit as EditIcon,
  LocalHospital as MedicalIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";
import { FamilyMember, CareLevel } from "@/types/family-profile-type";

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit?: (member: FamilyMember) => void;
  onCardClick?: (member: FamilyMember) => void;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({
  member,
  onEdit,
  onCardClick,
}) => {
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

  const getRelationshipIcon = () => {
    // You can customize icons based on relationship
    return <PersonIcon />;
  };

  const careColors = getCareCareLevelColor(member.careLevel);

  return (
    <Card
      onClick={() => onCardClick?.(member)}
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease-in-out",
        cursor: onCardClick ? "pointer" : "default",
        border: "1px solid #f0f0f0",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ padding: 3 }}>
        {/* Header with avatar and actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: "#42C5E7",
                marginRight: 2,
              }}
            >
              {getRelationshipIcon()}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3" fontWeight="600">
                {member.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {member.age} years old
              </Typography>
            </Box>
          </Box>
          {onEdit && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onEdit(member);
              }}
              sx={{ color: "#42C5E7" }}
            >
              <EditIcon />
            </IconButton>
          )}
        </Box>

        {/* Relationship and Care Level */}
        <Box sx={{ display: "flex", gap: 1, marginBottom: 2, flexWrap: "wrap" }}>
          <Chip
            label={member.relationship.replace("_", " ").toLowerCase()}
            size="small"
            sx={{
              backgroundColor: "#E3F2FD",
              color: "#1565C0",
              fontSize: "0.75rem",
              textTransform: "capitalize",
            }}
          />
          <Chip
            label={member.careLevel.replace("_", " ").toLowerCase()}
            size="small"
            sx={{
              backgroundColor: careColors.bg,
              color: careColors.color,
              fontSize: "0.75rem",
              textTransform: "capitalize",
            }}
          />
        </Box>

        {/* Medical Information */}
        {(member.allergies?.length || member.medications?.length) && (
          <Box sx={{ marginBottom: 2 }}>
            {member.allergies && member.allergies.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                <WarningIcon sx={{ fontSize: 16, color: "#FF9800", marginRight: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Allergies: {member.allergies.slice(0, 2).join(", ")}
                  {member.allergies.length > 2 && ` +${member.allergies.length - 2} more`}
                </Typography>
              </Box>
            )}
            {member.medications && member.medications.length > 0 && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MedicalIcon sx={{ fontSize: 16, color: "#4CAF50", marginRight: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Medications: {member.medications.slice(0, 2).join(", ")}
                  {member.medications.length > 2 && ` +${member.medications.length - 2} more`}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Care Profiles Count */}
        {member.careProfiles && member.careProfiles.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TimeIcon sx={{ fontSize: 16, color: "#42C5E7", marginRight: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {member.careProfiles.length} active care plan{member.careProfiles.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        )}

        {/* Medical Notes */}
        {member.medicalNotes && (
          <Alert
            severity="info"
            sx={{
              marginTop: 2,
              fontSize: "0.75rem",
              "& .MuiAlert-message": {
                fontSize: "0.75rem",
              },
            }}
          >
            {member.medicalNotes.length > 100
              ? `${member.medicalNotes.substring(0, 100)}...`
              : member.medicalNotes}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;
