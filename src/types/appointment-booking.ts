import { TimeSlotInterface, TimeSlotStatus } from './time-slots';

export interface AppointmentSlotRow {
  timeRange: string;
  slots: AppointmentSlot[];
}

export interface AppointmentSlot extends TimeSlotInterface {
  slotLabel: string;
  slotPosition: number;
  isBookable: boolean;
  patientName?: string;
  appointmentType?: 'physical' | 'online';
}

export interface TimeSlotGridProps {
  timeSlots: TimeSlotInterface[];
  onSlotSelect?: (slot: AppointmentSlot) => void;
  selectedSlotId?: string;
  viewMode?: 'grid' | 'list';
}

export interface StatusConfig {
  color: string;
  backgroundColor: string;
  borderColor: string;
  label: string;
  textColor: string;
}

export const APPOINTMENT_STATUS_CONFIG: Record<TimeSlotStatus, StatusConfig> = {
  [TimeSlotStatus.AVAILABLE]: {
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
    label: 'Available',
    textColor: '#1976d2'
  },
  [TimeSlotStatus.BOOKED]: {
    color: '#ed6c02',
    backgroundColor: '#fff3e0',
    borderColor: '#ed6c02',
    label: 'Reserved',
    textColor: '#ed6c02'
  },
  [TimeSlotStatus.COMPLETED]: {
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    borderColor: '#2e7d32',
    label: 'Completed',
    textColor: '#2e7d32'
  },
  [TimeSlotStatus.CANCELLED]: {
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    borderColor: '#d32f2f',
    label: 'Cancelled',
    textColor: '#d32f2f'
  },
  [TimeSlotStatus.NO_SHOW]: {
    color: '#757575',
    backgroundColor: '#f5f5f5',
    borderColor: '#757575',
    label: 'No Show',
    textColor: '#757575'
  }
};
