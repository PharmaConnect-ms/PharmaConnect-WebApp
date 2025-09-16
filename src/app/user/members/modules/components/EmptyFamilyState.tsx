"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  FamilyRestroom as FamilyIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

interface EmptyFamilyStateProps {
  onAddMember: () => void;
}

const EmptyFamilyState: React.FC<EmptyFamilyStateProps> = ({
  onAddMember,
}) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "1px solid #f0f0f0",
        minHeight: "400px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: 4,
          maxWidth: 400,
        }}
      >
        <FamilyIcon
          sx={{
            fontSize: 120,
            color: "#42C5E7",
            marginBottom: 3,
            opacity: 0.7,
          }}
        />
        
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="600"
          color="text.primary"
        >
          Welcome to Your Family Care Hub
        </Typography>
        
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ marginBottom: 4, lineHeight: 1.6 }}
        >
          Start building your family care network by adding your first family member. 
          You can track their medical information, allergies, medications, and create 
          personalized care plans for each member.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<PersonAddIcon />}
          onClick={onAddMember}
          sx={{
            backgroundColor: "#42C5E7",
            "&:hover": {
              backgroundColor: "#32B5D7",
            },
            borderRadius: "12px",
            textTransform: "none",
            padding: "12px 32px",
            fontSize: "1.1rem",
            fontWeight: "600",
          }}
        >
          Add Your First Family Member
        </Button>

        <Box sx={{ marginTop: 3 }}>
          <Typography variant="caption" color="text.secondary">
            You can add parents, children, siblings, and other family members
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EmptyFamilyState;
