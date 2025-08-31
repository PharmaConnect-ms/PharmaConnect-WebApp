'use client';
import React, { useState } from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { TimeSlotInterface } from '@/types/time-slots';
import { AppointmentSlot } from '@/types/appointment-booking';
import SimpleAppointmentGrid from './SimpleAppointmentGrid';
import MobileAppointmentList from './MobileAppointmentList';
import AppointmentViewModal from './AppointmentBookingModal';

interface ResponsiveAppointmentViewProps {
  timeSlots: TimeSlotInterface[];
  onViewDetails?: (slot: AppointmentSlot) => void;
}

const ResponsiveAppointmentView: React.FC<ResponsiveAppointmentViewProps> = ({
  timeSlots,
  onViewDetails
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSlotSelect = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const handleViewDetails = (slot: AppointmentSlot) => {
    onViewDetails?.(slot);
  };

  return (
    <Box>
      {/* Clean Professional Layout - No Progress Bars */}
      {isMobile ? (
        <MobileAppointmentList
          timeSlots={timeSlots}
          onSlotSelect={handleSlotSelect}
          selectedSlotId={selectedSlot?.id}
        />
      ) : (
        <SimpleAppointmentGrid
          timeSlots={timeSlots}
          onSlotSelect={handleSlotSelect}
          selectedSlotId={selectedSlot?.id}
        />
      )}
      
      <AppointmentViewModal
        open={modalOpen}
        onClose={handleCloseModal}
        slot={selectedSlot}
        onViewDetails={handleViewDetails}
      />
    </Box>
  );
};

export default ResponsiveAppointmentView;
