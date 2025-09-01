'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import { usePrescriptionDashboard } from '../logic/usePrescriptionDashboard';
import PrescriptionList from '@/components/prescription/PrescriptionList';

const PrescriptionDashboardUI: React.FC = () => {
  const {
    prescriptions,
    loadingPrescriptions,
  } = usePrescriptionDashboard();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ minHeight: '80vh' }}>
        <PrescriptionList
          prescriptions={prescriptions}
          loading={loadingPrescriptions}
        />
      </Box>
    </Container>
  );
};

export default PrescriptionDashboardUI;