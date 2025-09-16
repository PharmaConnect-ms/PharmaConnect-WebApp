"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid2 as Grid,
  Chip,
} from "@mui/material";
import {
  People as PeopleIcon,
  LocalHospital as MedicalIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { FamilyMember, CareLevel } from "@/types/family-profile-type";

interface FamilyStatsProps {
  familyMembers: FamilyMember[];
  isLoading?: boolean;
}

const FamilyStats: React.FC<FamilyStatsProps> = ({
  familyMembers,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h6" gutterBottom>
          Loading statistics...
        </Typography>
      </Box>
    );
  }

  const totalMembers = familyMembers.length;
  const totalCareProfiles = familyMembers.reduce(
    (acc, member) => acc + (member.careProfiles?.length || 0),
    0
  );
  const membersWithAllergies = familyMembers.filter(
    (member) => member.allergies && member.allergies.length > 0
  ).length;
  const membersWithMedications = familyMembers.filter(
    (member) => member.medications && member.medications.length > 0
  ).length;

  // Care level distribution
  const careLevelCounts = familyMembers.reduce((acc, member) => {
    acc[member.careLevel] = (acc[member.careLevel] || 0) + 1;
    return acc;
  }, {} as Record<CareLevel, number>);

  const stats = [
    {
      title: "Total Members",
      value: totalMembers,
      icon: <PeopleIcon sx={{ fontSize: 32, color: "#42C5E7" }} />,
      color: "#42C5E7",
      bgColor: "rgba(66, 197, 231, 0.1)",
    },
    {
      title: "Active Care Plans",
      value: totalCareProfiles,
      icon: <ScheduleIcon sx={{ fontSize: 32, color: "#4CAF50" }} />,
      color: "#4CAF50",
      bgColor: "rgba(76, 175, 80, 0.1)",
    },
    {
      title: "With Allergies",
      value: membersWithAllergies,
      icon: <WarningIcon sx={{ fontSize: 32, color: "#FF9800" }} />,
      color: "#FF9800",
      bgColor: "rgba(255, 152, 0, 0.1)",
    },
    {
      title: "On Medications",
      value: membersWithMedications,
      icon: <MedicalIcon sx={{ fontSize: 32, color: "#9C27B0" }} />,
      color: "#9C27B0",
      bgColor: "rgba(156, 39, 176, 0.1)",
    },
  ];

  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight="600">
        Family Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        {stats.map((stat, index) => (
          <Grid size={{ xs: 6, sm: 3 }} key={index}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0",
                height: "100%",
              }}
            >
              <CardContent sx={{ padding: 3, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: stat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="700"
                  color={stat.color}
                  gutterBottom
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Care Level Distribution */}
      {totalMembers > 0 && (
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #f0f0f0",
            marginTop: 3,
          }}
        >
          <CardContent sx={{ padding: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              Care Level Distribution
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
              {Object.entries(careLevelCounts).map(([level, count]) => {
                const getCareCareLevelColor = (careLevel: CareLevel) => {
                  switch (careLevel) {
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

                const colors = getCareCareLevelColor(level as CareLevel);
                return (
                  <Chip
                    key={level}
                    label={`${level.replace("_", " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}: ${count}`}
                    sx={{
                      backgroundColor: colors.bg,
                      color: colors.color,
                      fontWeight: "600",
                    }}
                  />
                );
              })}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FamilyStats;
