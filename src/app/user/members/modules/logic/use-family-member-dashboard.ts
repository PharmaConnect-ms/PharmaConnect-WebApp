'use client';

import { useState } from "react";
import { selectAuthUser } from "@/redux/features/authSlice";
import { useSelector } from "react-redux";
import { useCreateFamilyMemberMutation , 
    useCreateCareProfileMutation,
    useGetAllFamilyMembersQuery,
    useGetFamilyMemberByIdQuery,
    useGetCareProfileByIdQuery,
    useUpdateFamilyMemberMutation,
    } from "@/redux/api/family-profile";
import { CreateFamilyMember, CreateCareProfile, FamilyMember } from "@/types/family-profile-type";
import { NotificationState } from "../components";

export const useFamilyMemberDashboard = () => {
  const user = useSelector(selectAuthUser);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string | null>(null);
  const [selectedMemberForDetails, setSelectedMemberForDetails] = useState<FamilyMember | null>(null);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState<FamilyMember | null>(null);
  const [selectedMemberForCareProfile, setSelectedMemberForCareProfile] = useState<FamilyMember | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [isAddCareProfileModalOpen, setIsAddCareProfileModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: "",
    severity: "info",
  });
  
  const { data: familyMembers = [], isLoading: isLoadingFamilyMembers, refetch: refetchFamilyMembers } = useGetAllFamilyMembersQuery(user?.userID ?? '', {
    skip: !user?.userID,
  });
  
  const { data: careProfile, isLoading: isLoadingCareProfile } = useGetCareProfileByIdQuery(selectedFamilyMember ?? '', {
    skip: !selectedFamilyMember,
  });
  
  const [createFamilyMember, { isLoading: isCreatingFamilyMember }] = useCreateFamilyMemberMutation();
  const [createCareProfile, { isLoading: isCreatingCareProfile }] = useCreateCareProfileMutation();
  const [updateFamilyMember, { isLoading: isUpdatingFamilyMember }] = useUpdateFamilyMemberMutation();
  
  const { data: familyMemberDetails } = useGetFamilyMemberByIdQuery(selectedFamilyMember ?? '', {
    skip: !selectedFamilyMember,
  });

  const showNotification = (message: string, severity: NotificationState["severity"], title?: string) => {
    setNotification({
      open: true,
      message,
      severity,
      title,
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const openAddMemberModal = () => setIsAddMemberModalOpen(true);
  const closeAddMemberModal = () => setIsAddMemberModalOpen(false);
  
  const openEditMemberModal = (member: FamilyMember) => {
    setSelectedMemberForEdit(member);
    setIsEditMemberModalOpen(true);
  };
  const closeEditMemberModal = () => {
    setSelectedMemberForEdit(null);
    setIsEditMemberModalOpen(false);
  };
  
  const openAddCareProfileModal = (member: FamilyMember) => {
    setSelectedMemberForCareProfile(member);
    setIsAddCareProfileModalOpen(true);
  };
  const closeAddCareProfileModal = () => {
    setSelectedMemberForCareProfile(null);
    setIsAddCareProfileModalOpen(false);
  };
  
  const openDetailsModal = (member: FamilyMember) => {
    setSelectedMemberForDetails(member);
    setIsDetailsModalOpen(true);
  };
  const closeDetailsModal = () => {
    setSelectedMemberForDetails(null);
    setIsDetailsModalOpen(false);
  };

  const handleCreateFamilyMember = async (memberData: CreateFamilyMember) => {
    try {
      await createFamilyMember(memberData).unwrap();
      refetchFamilyMembers(); // Refresh the list
      closeAddMemberModal();
      showNotification(
        `${memberData.name} has been successfully added to your family.`,
        "success",
        "Family Member Added"
      );
    } catch (error) {
      console.error('Failed to create family member:', error);
      showNotification(
        "Failed to add family member. Please try again.",
        "error",
        "Error"
      );
    }
  };

  const handleCreateCareProfile = async (profileData: CreateCareProfile) => {
    try {
      await createCareProfile(profileData).unwrap();
      closeAddCareProfileModal();
      refetchFamilyMembers(); 
      closeDetailsModal();
      showNotification(
        `Care plan "${profileData.title}" created successfully.`,
        "success",
        "Care Plan Created"
      );
    } catch (error) {
      console.error('Failed to create care profile:', error);
      showNotification(
        "Failed to create care plan. Please try again.",
        "error",
        "Error"
      );
    }
  };

  const handleUpdateFamilyMember = async (memberId: string, memberData: Partial<CreateFamilyMember>) => {
    try {
      await updateFamilyMember({ memberId, updatedData: memberData }).unwrap();
      refetchFamilyMembers(); // Refresh the list
      closeEditMemberModal();
      showNotification(
        `${memberData.name} has been successfully updated.`,
        "success",
        "Family Member Updated"
      );
    } catch (error) {
      console.error('Failed to update family member:', error);
      showNotification(
        "Failed to update family member. Please try again.",
        "error",
        "Error"
      );
    }
  };

  const handleMemberCardClick = (member: FamilyMember) => {
    openDetailsModal(member);
  };

  const handleEditMember = (member: FamilyMember) => {
    openEditMemberModal(member);
    closeDetailsModal(); // Close details modal if open
  };

  return {
    user,
    familyMembers,
    isLoadingFamilyMembers,
    careProfile,
    isLoadingCareProfile,
    createFamilyMember: handleCreateFamilyMember,
    isCreatingFamilyMember,
    createCareProfile: handleCreateCareProfile,
    isCreatingCareProfile,
    updateFamilyMember: handleUpdateFamilyMember,
    isUpdatingFamilyMember,
    familyMemberDetails,
    selectedFamilyMember,
    setSelectedFamilyMember,
    selectedMemberForDetails,
    selectedMemberForEdit,
    selectedMemberForCareProfile,
    isAddMemberModalOpen,
    openAddMemberModal,
    closeAddMemberModal,
    isEditMemberModalOpen,
    openEditMemberModal,
    closeEditMemberModal,
    isAddCareProfileModalOpen,
    openAddCareProfileModal,
    closeAddCareProfileModal,
    isDetailsModalOpen,
    openDetailsModal,
    closeDetailsModal,
    handleMemberCardClick,
    handleEditMember,
    refetchFamilyMembers,
    notification,
    closeNotification,
  };
};
