"use client";

import React from "react";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import Chip from "@mui/material/Chip";

const MembersPage = () => {

  // Sample family member data - you can replace this with actual data later
  const familyMembers = [
    {
      id: 1,
      name: "Arthur Morgon",
      relationship: "Brother",
      age: 35,
      bloodType: "O+",
    },
  ];

  const handleAddMember = () => {
    // This will be implemented later when you add the functionality
    console.log("Add new family member");
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Header */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Family Members
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your family members and their medical information
        </Typography>
      </Box>

      {/* Add Member Button */}
      <Box sx={{ marginBottom: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddMember}
          sx={{
            backgroundColor: "#42C5E7",
            "&:hover": {
              backgroundColor: "#32B5D7",
            },
            borderRadius: "12px",
            textTransform: "none",
            padding: "12px 24px",
          }}
        >
          Add Family Member
        </Button>
      </Box>

      {/* Family Members Grid */}
      <Grid container spacing={3}>
        {familyMembers.map((member) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
            <Card
              sx={{
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                },
                cursor: "pointer",
              }}
            >
              <CardContent sx={{ padding: 3 }}>
                {/* Member Icon and Name */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                  }}
                >
                  <PersonIcon
                    sx={{
                      fontSize: 40,
                      color: "#42C5E7",
                      marginRight: 2,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" component="h3" fontWeight="600">
                      {member.name}
                    </Typography>
                    <Chip
                      label={member.relationship}
                      size="small"
                      sx={{
                        backgroundColor: "#E3F2FD",
                        color: "#1565C0",
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                </Box>

                {/* Member Details */}
                <Box sx={{ marginTop: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Age:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {member.age} years
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Blood Type:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {member.bloodType}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Empty State / Add More Card */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            onClick={handleAddMember}
            sx={{
              borderRadius: "16px",
              border: "2px dashed #42C5E7",
              backgroundColor: "transparent",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(66, 197, 231, 0.05)",
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <PersonAddIcon
                sx={{
                  fontSize: 60,
                  color: "#42C5E7",
                  marginBottom: 2,
                }}
              />
              <Typography variant="h6" color="#42C5E7" gutterBottom>
                Add New Member
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click to add a new family member
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MembersPage;
