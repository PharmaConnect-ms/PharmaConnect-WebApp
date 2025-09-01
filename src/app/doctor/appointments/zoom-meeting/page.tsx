'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container, Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import { ArrowBack, VideoCall } from '@mui/icons-material';
import ZoomMeetingComponent from '@/components/ZoomMeetingComponent';

interface MeetingData {
  meetingNumber: string;
  meetingPassword: string;
  signature: string;
}

export default function ZoomMeetingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const appointmentId = searchParams.get('appointmentId');
  const meetingLink = searchParams.get('meetingLink');
  const patientName = searchParams.get('patientName') || 'Patient';
  const doctorName = searchParams.get('doctorName') || 'Doctor';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);

  const extractMeetingNumber = (link: string) => {
    try {
      // Handle different Zoom URL formats
      let meetingNumber = '';
      let password = '';

      // Format 1: https://zoom.us/j/123456789?pwd=abc123
      const urlMatch = link.match(/\/j\/(\d+)/);
      if (urlMatch) {
        meetingNumber = urlMatch[1];
        const url = new URL(link);
        password = url.searchParams.get('pwd') || '';
      }

      // Format 2: Direct meeting number
      if (!meetingNumber && /^\d{9,11}$/.test(link)) {
        meetingNumber = link;
      }

      if (!meetingNumber) {
        throw new Error('Could not extract meeting number from link');
      }

      return {
        meetingNumber,
        password
      };
    } catch {
      throw new Error('Invalid Zoom meeting link format');
    }
  };

  useEffect(() => {
    if (!appointmentId || !meetingLink) {
      setError('Missing appointment information');
      setLoading(false);
      return;
    }

    const initializeMeeting = async () => {
      try {
        setLoading(true);
        setError(null);

        // Extract meeting number from the link
        const { meetingNumber, password } = extractMeetingNumber(meetingLink);

        // Generate meeting signature
        const signatureResponse = await fetch('/api/zoom/signature', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingNumber,
            role: 0 // 0 for participant, 1 for host
          }),
        });

        if (!signatureResponse.ok) {
          throw new Error('Failed to generate meeting signature');
        }

        const { signature } = await signatureResponse.json();

        setMeetingData({
          meetingNumber,
          meetingPassword: password,
          signature
        });
      } catch (err) {
        console.error('Error initializing meeting:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize meeting');
      } finally {
        setLoading(false);
      }
    };

    initializeMeeting();
  }, [appointmentId, meetingLink]);

  const handleMeetingEnd = () => {
    router.push(`/doctor/appointments/${appointmentId}`);
  };

  const handleReturnToAppointment = () => {
    router.push(`/doctor/appointments/${appointmentId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="flex flex-col items-center justify-center h-64 space-y-4">
          <CircularProgress size={64} color="primary" />
          <Typography variant="h6" className="text-gray-700">
            Setting up your meeting...
          </Typography>
          <Typography variant="body2" className="text-gray-500 text-center">
            Please wait while we prepare your Zoom meeting room
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Box className="space-y-6">
          <Box className="flex items-center space-x-4">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleReturnToAppointment}
              className="mb-4"
            >
              Back to Appointment
            </Button>
          </Box>

          <Alert severity="error" className="mb-6">
            <Typography variant="h6" className="font-medium mb-2">
              Unable to join meeting
            </Typography>
            <Typography variant="body1" className="mb-4">
              {error}
            </Typography>
            <Box className="flex space-x-2 mt-4">
              <Button
                variant="contained"
                onClick={() => window.location.reload()}
                color="primary"
                size="small"
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                href={meetingLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<VideoCall />}
                size="small"
              >
                Open in Zoom App
              </Button>
            </Box>
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!meetingData) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Alert severity="warning">
          <Typography variant="body1">
            Meeting data not available. Please try refreshing the page.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-4">
      <Box className="space-y-4">
        {/* Header */}
        <Box className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
          <Box className="flex items-center space-x-4">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleReturnToAppointment}
              size="small"
            >
              Back to Appointment
            </Button>
            <Box>
              <Typography variant="h6" className="font-semibold text-gray-800">
                Video Consultation
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Meeting with {patientName}
              </Typography>
            </Box>
          </Box>

          <Box className="flex space-x-2">
            <Button
              variant="outlined"
              href={meetingLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<VideoCall />}
              size="small"
            >
              Open in Zoom App
            </Button>
          </Box>
        </Box>

        {/* Meeting Container */}
        <Box className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ZoomMeetingComponent
            meetingNumber={meetingData.meetingNumber}
            meetingPassword={meetingData.meetingPassword}
            signature={meetingData.signature}
            userName={doctorName}
            userEmail="doctor@pharmaconnect.com" // You might want to use actual email
            onMeetingEnd={handleMeetingEnd}
            onError={(error) => setError(error)}
          />
        </Box>
      </Box>
    </Container>
  );
}
