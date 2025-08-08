/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Jitsi SDK
const JitsiMeeting = dynamic(() => import('@jitsi/react-sdk').then(mod => mod.JaaSMeeting), {
  ssr: false,
});

const MeetingRoomPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = searchParams.get('user') || 'Guest';
  const token = searchParams.get('token');
  const roomName = searchParams.get('room') || user;

  const [isValid, setIsValid] = useState(true);
  const meetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !roomName) {
      setIsValid(false);
    }
  }, [token, roomName]);

  const handleMeetingEnd = () => {
    alert('Meeting ended. Redirecting...');
    router.push('/user/appointment');
  };

  const handleFullscreen = () => {
    const element = meetingRef.current;
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any)?.webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any)?.mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any)?.msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  };

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-center">Invalid meeting link or missing token.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Meeting Room: {roomName}</h1>
        <button
          onClick={handleFullscreen}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Go Fullscreen
        </button>
      </div>

      <div ref={meetingRef}>
        <JitsiMeeting
          appId="vpaas-magic-cookie-3b77f06727bf40449f82968dd34470c9"
          roomName={roomName}
          jwt={token}
          getIFrameRef={(node) => {
            node.style.height = '800px';
            node.allow = 'camera; microphone; fullscreen; display-capture';
          }}
          configOverwrite={{
            disableThirdPartyRequests: true,
            disableLocalVideoFlip: true,
            backgroundAlpha: 0.5,
          }}
          interfaceConfigOverwrite={{
            VIDEO_LAYOUT_FIT: 'nocrop',
            MOBILE_APP_PROMO: false,
            TILE_VIEW_MAX_COLUMNS: 4,
          }}
          onApiReady={(api) => console.log('Jitsi API ready:', api)}
          onReadyToClose={handleMeetingEnd}
        />
      </div>
    </div>
  );
};

export default MeetingRoomPage;
