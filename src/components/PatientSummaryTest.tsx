"use client";

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import PatientSummaryCard from '@/components/PatientSummaryCard';

const PatientSummaryTest: React.FC = () => {
  // Your exact format from the issue
  const yourSummaryFormat = `**Diagnoses**: -

**Current Medications**:  
- Mefen 500 mg, twice daily for 2 days (starting 9/1/2025)  
- Prednisolone 30 mg, twice daily for 5 days  
- Pantoprazole 40 mg, once daily for 5 days  

**Previous Medications**: -

**Allergies**: -

**Recent Tests/Results**: -

**Follow-ups/Advice**: -

**Medical History**: -`;

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="mb-6 font-bold text-center">
        Patient Summary Test - Your Exact Format
      </Typography>

      <Box className="space-y-8">
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 text-blue-700 font-semibold">
            Testing Your Exact Summary Format
          </Typography>
          <PatientSummaryCard userSummary={yourSummaryFormat} />
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientSummaryTest;
