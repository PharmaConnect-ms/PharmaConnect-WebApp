"use client";

import React from 'react';
import { Box, Typography, Chip, Paper, Divider } from '@mui/material';
import { 
  LocalHospital, 
  Medication, 
  Warning, 
  Science, 
  Event,
  InfoOutlined
} from '@mui/icons-material';

interface PatientSummaryProps {
  userSummary: string;
}

interface ParsedSummary {
  diagnoses: string[];
  medications: string[];
  allergies: string[];
  testsResults: string[];
  followUps: string[];
}

const PatientSummaryCard: React.FC<PatientSummaryProps> = ({ userSummary }) => {
  const parseSummary = (summary: string): ParsedSummary => {
    const parsed: ParsedSummary = {
      diagnoses: [],
      medications: [],
      allergies: [],
      testsResults: [],
      followUps: []
    };

    if (!summary) return parsed;

    try {
      // Split by main headings and process each section
      const sections = summary.split(/\*\*([^*]+)\*\*:/);
      
      for (let i = 1; i < sections.length; i += 2) {
        const heading = sections[i].toLowerCase().trim();
        const content = sections[i + 1]?.trim() || '';
        
        // Extract bullet points, filtering out empty ones and dashes
        const items = content
          .split(/[-•]\s+/)
          .map(item => item.trim())
          .filter(item => item && item !== '-' && item !== '' && item !== 'Illegible')
          .map(item => {
            // Clean up any remaining formatting
            return item.replace(/^\s*-\s*/, '').trim();
          })
          .filter(item => item.length > 0);

        if (heading.includes('diagnos')) {
          parsed.diagnoses = items;
        } else if (heading.includes('medication')) {
          parsed.medications = items;
        } else if (heading.includes('allergi')) {
          parsed.allergies = items;
        } else if (heading.includes('test') || heading.includes('result')) {
          parsed.testsResults = items;
        } else if (heading.includes('follow') || heading.includes('advice')) {
          parsed.followUps = items;
        }
      }
    } catch (error) {
      console.warn('Error parsing patient summary:', error);
    }

    return parsed;
  };

  const summary = parseSummary(userSummary);

  const SummarySection = ({ 
    title, 
    items, 
    icon, 
    color, 
    emptyMessage = "None recorded"
  }: {
    title: string;
    items: string[];
    icon: React.ReactNode;
    color: string;
    emptyMessage?: string;
  }) => (
    <Box className="mb-4">
      <Box className="flex items-center gap-2 mb-2">
        {icon}
        <Typography variant="subtitle2" className="font-semibold" style={{ color }}>
          {title}
        </Typography>
      </Box>
      
      {items.length === 0 ? (
        <Typography variant="body2" className="text-gray-500 ml-6">
          {emptyMessage}
        </Typography>
      ) : (
        <Box className="ml-6 space-y-1">
          {items.map((item, index) => (
            <Box key={index} className="flex items-start gap-2">
              <Box 
                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" 
                style={{ backgroundColor: color }}
              />
              <Typography variant="body2" className="text-gray-700 leading-relaxed">
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );

  return (
    <Paper className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
      <Box className="flex items-center gap-2 mb-4">
        <InfoOutlined className="text-blue-600" />
        <Typography variant="subtitle1" className="font-bold text-blue-800">
          Clinical Summary
        </Typography>
      </Box>

      <Box className="space-y-3">
        {/* Diagnoses */}
        <SummarySection
          title="Diagnoses"
          items={summary.diagnoses}
          icon={<LocalHospital sx={{ fontSize: 18, color: '#dc2626' }} />}
          color="#dc2626"
          emptyMessage="No current diagnoses"
        />

        <Divider className="my-3" />

        {/* Medications */}
        <Box className="mb-4">
          <Box className="flex items-center gap-2 mb-2">
            <Medication sx={{ fontSize: 18, color: '#059669' }} />
            <Typography variant="subtitle2" className="font-semibold text-green-600">
              Current Medications
            </Typography>
            {summary.medications.length > 0 && (
              <Chip 
                label={`${summary.medications.length} Active`} 
                size="small" 
                color="success"
                variant="outlined"
              />
            )}
          </Box>
          
          {summary.medications.length === 0 ? (
            <Typography variant="body2" className="text-gray-500 ml-6">
              No medications prescribed
            </Typography>
          ) : (
            <Box className="ml-6 space-y-2">
              {summary.medications.map((medication, index) => {
                // Extract medication name and highlight controlled substances
                const isControlled = medication.toLowerCase().includes('prednisolone') ||
                                   medication.toLowerCase().includes('prednisone') ||
                                   medication.toLowerCase().includes('morphine') ||
                                   medication.toLowerCase().includes('oxycodone') ||
                                   medication.toLowerCase().includes('fentanyl');
                
                return (
                  <Box key={index} className="flex items-start gap-2">
                    <Box 
                      className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        isControlled ? 'animate-pulse' : ''
                      }`}
                      style={{ backgroundColor: isControlled ? '#dc2626' : '#059669' }}
                    />
                    <Typography 
                      variant="body2" 
                      className={`leading-relaxed ${
                        isControlled ? 'text-red-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {medication}
                      {isControlled && (
                        <Chip 
                          label="Controlled" 
                          size="small" 
                          color="error"
                          variant="outlined"
                          className="ml-2"
                          sx={{ fontSize: '0.65rem', height: '18px' }}
                        />
                      )}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        <Divider className="my-3" />

        {/* Allergies */}
        <Box className="mb-4">
          <Box className="flex items-center gap-2 mb-2">
            <Warning sx={{ fontSize: 18, color: '#d97706' }} />
            <Typography variant="subtitle2" className="font-semibold text-orange-600">
              Allergies
            </Typography>
            {summary.allergies.length > 0 && (
              <Chip 
                label={`${summary.allergies.length} Known`} 
                size="small" 
                color="warning"
                variant="outlined"
              />
            )}
          </Box>
          
          {summary.allergies.length === 0 ? (
            <Chip 
              label="No Known Allergies" 
              size="small" 
              variant="outlined"
              className="ml-6"
              sx={{ 
                color: '#059669', 
                borderColor: '#059669',
                backgroundColor: '#ecfdf5'
              }}
            />
          ) : (
            <Box className="ml-6 space-y-1">
              {summary.allergies.map((allergy, index) => {
                // Check for severe allergy indicators
                const isSevere = allergy.toLowerCase().includes('anaphylaxis') || 
                               allergy.toLowerCase().includes('severe') ||
                               allergy.toLowerCase().includes('anaphylactic');
                
                return (
                  <Chip
                    key={index}
                    label={allergy}
                    size="small"
                    color={isSevere ? "error" : "warning"}
                    variant="filled"
                    icon={<Warning sx={{ fontSize: 14 }} />}
                    className="mr-2 mb-1"
                    sx={isSevere ? {
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.8 }
                      }
                    } : {}}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        <Divider className="my-3" />

        {/* Tests & Results */}
        <SummarySection
          title="Tests & Results"
          items={summary.testsResults}
          icon={<Science sx={{ fontSize: 18, color: '#7c3aed' }} />}
          color="#7c3aed"
          emptyMessage="No recent test results"
        />

        <Divider className="my-3" />

        {/* Follow-ups & Advice */}
        <SummarySection
          title="Follow-ups & Advice"
          items={summary.followUps}
          icon={<Event sx={{ fontSize: 18, color: '#0d9488' }} />}
          color="#0d9488"
          emptyMessage="No follow-up instructions"
        />
      </Box>

      {/* Raw Summary Toggle (for debugging or full view) */}
      <Box className="mt-4 pt-3 border-t border-blue-200">
        <details className="cursor-pointer">
          <summary className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View Original Summary
          </summary>
          <Box className="mt-2 p-3 bg-white rounded border text-sm text-gray-600 font-mono whitespace-pre-wrap">
            {userSummary || "No summary available"}
          </Box>
        </details>
      </Box>
    </Paper>
  );
};

export default PatientSummaryCard;
