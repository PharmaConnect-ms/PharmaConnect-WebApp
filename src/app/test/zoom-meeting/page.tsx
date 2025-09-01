'use client';

import React from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { VideoCall, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function ZoomMeetingTestPage() {
  const router = useRouter();

  // Test appointment data
  const testAppointment = {
    id: "test-appointment-123",
    type: "online" as const,
    meetingLink: "https://zoom.us/j/123456789?pwd=testpassword123",
    doctor: {
      id: 1,
      username: "Dr. Smith"
    },
    patient: {
      id: 2,
      username: "John Doe"
    }
  };

  const handleJoinAsDoctorTest = () => {
    const params = new URLSearchParams({
      appointmentId: testAppointment.id,
      meetingLink: testAppointment.meetingLink,
      patientName: testAppointment.patient.username,
      doctorName: testAppointment.doctor.username
    });
    router.push(`/doctor/appointments/zoom-meeting?${params.toString()}`);
  };

  const handleJoinAsPatientTest = () => {
    const params = new URLSearchParams({
      appointmentId: testAppointment.id,
      meetingLink: testAppointment.meetingLink,
      patientName: testAppointment.patient.username,
      doctorName: testAppointment.doctor.username
    });
    router.push(`/user/zoom-meeting?${params.toString()}`);
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="space-y-6">
        <Typography variant="h4" className="font-bold text-center mb-8">
          Zoom Meeting Integration Test
        </Typography>

        <Paper className="p-6 space-y-4">
          <Typography variant="h6" className="font-semibold">
            Test Appointment Details
          </Typography>
          
          <Box className="grid grid-cols-2 gap-4 text-sm">
            <Box>
              <Typography variant="body2" className="font-medium text-gray-600">
                Appointment ID:
              </Typography>
              <Typography variant="body2">{testAppointment.id}</Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" className="font-medium text-gray-600">
                Type:
              </Typography>
              <Typography variant="body2">{testAppointment.type}</Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" className="font-medium text-gray-600">
                Doctor:
              </Typography>
              <Typography variant="body2">{testAppointment.doctor.username}</Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" className="font-medium text-gray-600">
                Patient:
              </Typography>
              <Typography variant="body2">{testAppointment.patient.username}</Typography>
            </Box>
            
            <Box className="col-span-2">
              <Typography variant="body2" className="font-medium text-gray-600">
                Meeting Link:
              </Typography>
              <Typography variant="body2" className="break-all">
                {testAppointment.meetingLink}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Test Zoom Meeting Access
          </Typography>
          
          <Box className="space-y-4">
            <Typography variant="body2" className="text-gray-600">
              Click the buttons below to test the Zoom meeting integration for both doctor and patient views:
            </Typography>
            
            <Box className="flex space-x-4">
              <Button
                variant="contained"
                color="primary"
                startIcon={<VideoCall />}
                onClick={handleJoinAsDoctorTest}
                size="large"
              >
                Join as Doctor
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Person />}
                onClick={handleJoinAsPatientTest}
                size="large"
              >
                Join as Patient
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Features Implemented
          </Typography>
          
          <Box className="space-y-2">
            <Typography variant="body2" className="flex items-center">
              ✅ ZoomMeetingComponent - Reusable Zoom SDK integration
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ Doctor Zoom Meeting Page - `/doctor/appointments/zoom-meeting`
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ Patient Zoom Meeting Page - `/user/zoom-meeting`
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ JoinMeetingButton - Reusable component for any appointment UI
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ useZoomMeeting hook - Reusable logic for joining meetings
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ Zoom Signature API - `/api/zoom/signature`
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ Meeting link parsing - Supports different Zoom URL formats
            </Typography>
            <Typography variant="body2" className="flex items-center">
              ✅ Error handling and loading states
            </Typography>
          </Box>
        </Paper>

        <Paper className="p-6 bg-blue-50">
          <Typography variant="h6" className="font-semibold mb-2 text-blue-900">
            Setup Requirements
          </Typography>
          <Box className="space-y-1 text-blue-800">
            <Typography variant="body2">
              • Ensure NEXT_PUBLIC_ZOOM_CLIENT_ID is set in environment variables
            </Typography>
            <Typography variant="body2">
              • Ensure ZOOM_CLIENT_SECRET is set in environment variables
            </Typography>
            <Typography variant="body2">
              • Appointment records should have `meetingLink` field for online appointments
            </Typography>
            <Typography variant="body2">
              • Zoom Web SDK will be loaded dynamically when needed
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
