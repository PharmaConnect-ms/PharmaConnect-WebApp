import { AppointmentResponse } from '@/types/appointment-types';

/**
 * Get the meeting link for an appointment, providing a fallback for online appointments
 * that don't have a meeting link
 */
export const getMeetingLink = (appointment: AppointmentResponse): string | undefined => {
  // If it's not an online appointment, return undefined
  if (appointment.type !== 'online') {
    return undefined;
  }

  // If meeting link exists, return it
  if (appointment.meetingLink) {
    return appointment.meetingLink;
  }

  // For online appointments without a meeting link, provide fallback
  return 'https://meet.google.com/vrn-xror-wyv';
};

/**
 * Check if an appointment has a meeting link (including fallback for online appointments)
 */
export const hasMeetingLink = (appointment: AppointmentResponse): boolean => {
  return appointment.type === 'online'; // All online appointments should have a meeting link (with fallback)
};
