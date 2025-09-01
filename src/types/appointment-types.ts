import { TimeSlotStatus } from "./time-slots";

interface User {
  id: number;
  username: string;
}

interface Patient extends User {
    userSummary: string;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string; 
  endTime: string;  
  status: TimeSlotStatus;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export interface AppointmentResponse {
  id: string;
  type: "physical" | "online"; 
  scheduledAt: string; 
  status: AppointmentStatus;
  appointmentNo: number;
  createdAt: string; 
  doctor: User;
  patient: Patient;
  timeSlot: TimeSlot;
  meetingLink?: string; 
  notes?: string;
}


export interface AppointmentPayload {
  timeSlotId: string;
  patientId: number;
  type: 'physical' | 'online'; 
  notes: string;
}