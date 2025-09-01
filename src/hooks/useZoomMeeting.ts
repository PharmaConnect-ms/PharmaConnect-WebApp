import { useRouter } from 'next/navigation';

export const useZoomMeeting = () => {
  const router = useRouter();

  const joinMeeting = (params: {
    appointmentId: string;
    meetingLink: string;
    patientName: string;
    doctorName: string;
    userType: 'doctor' | 'patient';
  }) => {
    const { appointmentId, meetingLink, patientName, doctorName, userType } = params;
    
    const urlParams = new URLSearchParams({
      appointmentId,
      meetingLink,
      patientName,
      doctorName
    });

    const redirectPath = userType === 'doctor' 
      ? `/doctor/appointments/zoom-meeting?${urlParams.toString()}`
      : `/user/zoom-meeting?${urlParams.toString()}`;

    router.push(redirectPath);
  };

  return { joinMeeting };
};
