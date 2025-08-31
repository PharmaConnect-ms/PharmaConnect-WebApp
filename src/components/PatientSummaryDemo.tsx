"use client";

import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import PatientSummaryCard from '@/components/PatientSummaryCard';

const PatientSummaryDemo: React.FC = () => {
  // Sample data that matches your AI clinical note format
  const sampleSummary = `- **Diagnoses**: 
- Acute upper respiratory infection
- Mild hypertension

- **Medications**: 
- Prednisolone 30 mg, once daily for 5 days
- Pantoprazole 40 mg, once daily for 5 days
- Lisinopril 10 mg, once daily
- Amoxicillin 500 mg, three times daily for 7 days

- **Allergies**: 
- Penicillin (rash)
- Shellfish (anaphylaxis)

- **Tests/Results**: 
- Blood pressure: 145/90 mmHg
- Temperature: 101.2°F
- Chest X-ray: Clear lungs

- **Follow-ups/Advice**: 
- Return in 1 week if symptoms persist
- Complete full course of antibiotics
- Monitor blood pressure daily
- Avoid strenuous activity for 3-5 days`;

  const emptySummary = `- **Diagnoses**: -
- **Medications**: -
- **Allergies**: -
- **Tests/Results**: -
- **Follow-ups/Advice**: -`;

  const partialSummary = `- **Diagnoses**: 
- Type 2 Diabetes Mellitus
- **Medications**: 
- Metformin 500 mg, twice daily
- **Allergies**: -
- **Tests/Results**: 
- HbA1c: 7.2%
- **Follow-ups/Advice**: 
- Continue current medication
- Follow up in 3 months`;

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="mb-6 font-bold text-center">
        Patient Summary UI Demo
      </Typography>

      <Box className="space-y-8">
        {/* Full Summary Example */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 text-blue-700 font-semibold">
            Complete Patient Summary Example
          </Typography>
          <PatientSummaryCard userSummary={sampleSummary} />
        </Paper>

        {/* Partial Summary Example */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 text-green-700 font-semibold">
            Partial Patient Summary Example
          </Typography>
          <PatientSummaryCard userSummary={partialSummary} />
        </Paper>

        {/* Empty Summary Example */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 text-gray-700 font-semibold">
            Empty Patient Summary Example
          </Typography>
          <PatientSummaryCard userSummary={emptySummary} />
        </Paper>

        {/* No Summary Example */}
        <Paper className="p-6">
          <Typography variant="h6" className="mb-4 text-red-700 font-semibold">
            No Summary Available Example
          </Typography>
          <PatientSummaryCard userSummary="" />
        </Paper>
      </Box>
    </Container>
  );
};

export default PatientSummaryDemo;
