'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

interface ZoomMeetingComponentProps {
  meetingNumber: string;
  meetingPassword: string;
  signature: string;
  userName: string;
  userEmail: string;
  onMeetingEnd?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    ZoomMtg: {
      preLoadWasm: () => void;
      prepareWebSDK: () => void;
      i18n: {
        load: (lang: string) => void;
        reload: (lang: string) => void;
      };
      init: (config: {
        leaveUrl: string;
        success: (result: unknown) => void;
        error: (error: unknown) => void;
      }) => void;
      join: (config: {
        signature: string;
        meetingNumber: string;
        userName: string;
        userEmail: string;
        passWord: string;
        success: (result: unknown) => void;
        error: (error: unknown) => void;
      }) => void;
      leaveMeeting: (config: {
        success: () => void;
        error: () => void;
      }) => void;
    };
  }
}

const ZoomMeetingComponent: React.FC<ZoomMeetingComponentProps> = ({
  meetingNumber,
  meetingPassword,
  signature,
  userName,
  userEmail,
  //onMeetingEnd: _onMeetingEnd,
  onError
}) => {
  const meetingContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadZoomSDK = async () => {
      try {
        // Load Zoom Web SDK
        if (typeof window !== 'undefined' && !window.ZoomMtg) {
          const script = document.createElement('script');
          script.src = 'https://source.zoom.us/2.18.0/lib/vendor/react.min.js';
          document.head.appendChild(script);

          const script2 = document.createElement('script');
          script2.src = 'https://source.zoom.us/2.18.0/lib/vendor/react-dom.min.js';
          document.head.appendChild(script2);

          const script3 = document.createElement('script');
          script3.src = 'https://source.zoom.us/2.18.0/lib/vendor/redux.min.js';
          document.head.appendChild(script3);

          const script4 = document.createElement('script');
          script4.src = 'https://source.zoom.us/2.18.0/lib/vendor/redux-thunk.min.js';
          document.head.appendChild(script4);

          const script5 = document.createElement('script');
          script5.src = 'https://source.zoom.us/2.18.0/lib/vendor/lodash.min.js';
          document.head.appendChild(script5);

          const mainScript = document.createElement('script');
          mainScript.src = 'https://source.zoom.us/2.18.0/lib/ZoomMtgEmbedded.umd.min.js';
          mainScript.onload = () => {
            initializeZoom();
          };
          document.head.appendChild(mainScript);
        } else if (window.ZoomMtg) {
          initializeZoom();
        }
      } catch {
        const errorMsg = 'Failed to load Zoom SDK';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
        // Redirect to Google Meet fallback
        setTimeout(() => {
          window.location.href = 'https://meet.google.com/vrn-xror-wyv';
        }, 1000);
      }
    };

    const initializeZoom = () => {
      try {
        if (window.ZoomMtg) {
          window.ZoomMtg.preLoadWasm();
          window.ZoomMtg.prepareWebSDK();
          // Set zoom language to English
          window.ZoomMtg.i18n.load('en-US');
          window.ZoomMtg.i18n.reload('en-US');
          startMeeting();
        }
      } catch {
        const errorMsg = 'Failed to initialize Zoom';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
        // Redirect to Google Meet fallback
        setTimeout(() => {
          window.location.href = 'https://meet.google.com/vrn-xror-wyv';
        }, 1000);
      }
    };

    const startMeeting = () => {
      try {
        window.ZoomMtg.init({
          leaveUrl: window.location.origin + '/doctor/appointments',
          success: (_success: unknown) => {
            console.log('Zoom init success', _success);
            window.ZoomMtg.join({
              signature: signature,
              meetingNumber: meetingNumber,
              userName: userName,
              userEmail: userEmail,
              passWord: meetingPassword,
              success: (_result: unknown) => {
                console.log('Join meeting success', _result);
                setIsLoading(false);
              },
              error: (_error: unknown) => {
                console.error('Join meeting error', _error);
                const errorMsg = 'Failed to join meeting';
                setError(errorMsg);
                onError?.(errorMsg);
                setIsLoading(false);
                // Redirect to Google Meet fallback
                setTimeout(() => {
                  window.location.href = 'https://meet.google.com/vrn-xror-wyv';
                }, 1000);
              }
            });
          },
          error: (_error: unknown) => {
            console.error('Zoom init error', _error);
            const errorMsg = 'Failed to initialize meeting';
            setError(errorMsg);
            onError?.(errorMsg);
            setIsLoading(false);
            // Redirect to Google Meet fallback
            setTimeout(() => {
              window.location.href = 'https://meet.google.com/vrn-xror-wyv';
            }, 1000);
          }
        });
      } catch {
        const errorMsg = 'Failed to start meeting';
        setError(errorMsg);
        onError?.(errorMsg);
        setIsLoading(false);
        // Redirect to Google Meet fallback
        setTimeout(() => {
          window.location.href = 'https://meet.google.com/vrn-xror-wyv';
        }, 1000);
      }
    };

    loadZoomSDK();

    // Cleanup function
    return () => {
      if (window.ZoomMtg) {
        try {
          window.ZoomMtg.leaveMeeting({
            success: () => console.log('Left meeting successfully'),
            error: () => console.log('Error leaving meeting')
          });
        } catch (err) {
          console.error('Error during cleanup:', err);
        }
      }
    };
  }, [meetingNumber, signature, userName, userEmail, meetingPassword, onError]);

  if (error) {
    return (
      <Alert severity="info" className="m-4">
        <Typography variant="body1" className="font-medium">
          Redirecting to Google Meet...
        </Typography>
        <Typography variant="body2" className="mt-2 text-gray-600">
          We&apos;re redirecting you to a backup meeting room.
        </Typography>
      </Alert>
    );
  }

  return (
    <Box className="w-full h-full">
      {isLoading && (
        <Box className="flex flex-col items-center justify-center h-64 space-y-4">
          <CircularProgress size={48} color="primary" />
          <Typography variant="h6" className="text-gray-700">
            Connecting to meeting...
          </Typography>
          <Typography variant="body2" className="text-gray-500">
            Please wait while we set up your Zoom meeting
          </Typography>
        </Box>
      )}
      <div
        ref={meetingContainerRef}
        id="zmmtg-root"
        style={{
          width: '100%',
          height: '600px'
        }}
      />
    </Box>
  );
};

export default ZoomMeetingComponent;
