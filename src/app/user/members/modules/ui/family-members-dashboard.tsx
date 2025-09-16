"use client";

import React from "react";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFamilyMemberDashboard } from "../logic/use-family-member-dashboard";
import {
  FamilyMemberCard,
  AddFamilyMemberCard,
  AddFamilyMemberModal,
  EditFamilyMemberModal,
  CreateCareProfileModal,
  FamilyMemberDetailsModal,
  FamilyStats,
  FamilyMemberSkeleton,
  EmptyFamilyState,
  Notification,
} from "../components";

const FamilyMembersDashboard = () => {
  const {
    user,
    familyMembers,
    isLoadingFamilyMembers,
    createFamilyMember,
    isCreatingFamilyMember,
    updateFamilyMember,
    isUpdatingFamilyMember,
    createCareProfile,
    isCreatingCareProfile,
    isAddMemberModalOpen,
    openAddMemberModal,
    closeAddMemberModal,
    isEditMemberModalOpen,
    closeEditMemberModal,
    selectedMemberForEdit,
    isAddCareProfileModalOpen,
    openAddCareProfileModal,
    closeAddCareProfileModal,
    selectedMemberForCareProfile,
    isDetailsModalOpen,
    closeDetailsModal,
    selectedMemberForDetails,
    handleMemberCardClick,
    handleEditMember,
    notification,
    closeNotification,
  } = useFamilyMemberDashboard();

  // Show loading skeleton while data is being fetched
  if (isLoadingFamilyMembers) {
    return (
      <Box sx={{ padding: 3 }}>
        {/* Page Header */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
            Family Members
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your family members and their medical information
          </Typography>
        </Box>

        {/* Loading Stats */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight="600">
            Family Overview
          </Typography>
          <Grid container spacing={3}>
            {Array.from({ length: 4 }).map((_, index) => (
              <Grid size={{ xs: 6, sm: 3 }} key={index}>
                <Box
                  sx={{
                    height: 140,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "16px",
                    animation: "pulse 1.5s ease-in-out infinite alternate",
                    "@keyframes pulse": {
                      from: { opacity: 0.6 },
                      to: { opacity: 1 },
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Loading Cards */}
        <FamilyMemberSkeleton count={6} />
      </Box>
    );
  }

  // Show empty state if no family members exist
  if (!familyMembers || familyMembers.length === 0) {
    return (
      <Box sx={{ padding: 3 }}>
        {/* Page Header */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
            Family Members
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your family members and their medical information
          </Typography>
        </Box>

        {/* Empty State */}
        <EmptyFamilyState onAddMember={openAddMemberModal} />

        {/* Add Member Modal */}
        <AddFamilyMemberModal
          open={isAddMemberModalOpen}
          onClose={closeAddMemberModal}
          onSubmit={createFamilyMember}
          isLoading={isCreatingFamilyMember}
          userId={user?.userID || ""}
        />

        {/* Notifications */}
        <Notification
          notification={notification}
          onClose={closeNotification}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Header */}
      <Box sx={{ marginBottom: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
              Family Members
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your family members and their medical information
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={openAddMemberModal}
            sx={{
              backgroundColor: "#42C5E7",
              "&:hover": {
                backgroundColor: "#32B5D7",
              },
              borderRadius: "12px",
              textTransform: "none",
              padding: "12px 24px",
              fontWeight: "600",
              minWidth: "200px",
            }}
          >
            Add Family Member
          </Button>
        </Box>
      </Box>

      {/* Family Statistics */}
      <FamilyStats familyMembers={familyMembers} />

      {/* Family Members Grid */}
      <Box sx={{ marginBottom: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}
        >
          <Typography variant="h5" fontWeight="600">
            Your Family ({familyMembers.length} member{familyMembers.length !== 1 ? "s" : ""})
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {familyMembers.map((member) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={member.id}>
              <FamilyMemberCard
                member={member}
                onEdit={handleEditMember}
                onCardClick={handleMemberCardClick}
              />
            </Grid>
          ))}

          {/* Add Member Card */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <AddFamilyMemberCard onAddMember={openAddMemberModal} />
          </Grid>
        </Grid>
      </Box>

      {/* Add Member Modal */}
      <AddFamilyMemberModal
        open={isAddMemberModalOpen}
        onClose={closeAddMemberModal}
        onSubmit={createFamilyMember}
        isLoading={isCreatingFamilyMember}
        userId={user?.userID || ""}
      />

      {/* Family Member Details Modal */}
      <FamilyMemberDetailsModal
        open={isDetailsModalOpen}
        onClose={closeDetailsModal}
        member={selectedMemberForDetails}
        onEdit={handleEditMember}
        onCreateCareProfile={openAddCareProfileModal}
      />

      {/* Edit Family Member Modal */}
      <EditFamilyMemberModal
        open={isEditMemberModalOpen}
        onClose={closeEditMemberModal}
        onSubmit={updateFamilyMember}
        member={selectedMemberForEdit}
        isLoading={isUpdatingFamilyMember}
      />

      {/* Create Care Profile Modal */}
      <CreateCareProfileModal
        open={isAddCareProfileModalOpen}
        onClose={closeAddCareProfileModal}
        onSubmit={createCareProfile}
        familyMemberId={selectedMemberForCareProfile?.id || ""}
        familyMemberName={selectedMemberForCareProfile?.name || ""}
        userId={user?.userID || ""}
        isLoading={isCreatingCareProfile}
      />

      {/* Notifications */}
      <Notification
        notification={notification}
        onClose={closeNotification}
      />
    </Box>
  );
};

export default FamilyMembersDashboard;
