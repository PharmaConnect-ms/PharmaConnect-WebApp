

interface User {
  id: number;
  username: string;
}

interface DoctorSchedule {
  id: string;
  doctor: User;
  date: string;
  slotDurationMinutes: number;
}

export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

interface Appointment {
  id: string;
  appointmentNo: number;
  type: "physical" | "online"; 
  patient: User;
}

export interface TimeSlotInterface {
  id: string;
  date: string; 
  startTime: string; 
  endTime: string;  
  status: TimeSlotStatus; 
  doctorSchedule: DoctorSchedule;
  appointment?: Appointment;
}
