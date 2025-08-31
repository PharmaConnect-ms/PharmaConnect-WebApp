import { role } from "./common-types";
import { provider } from "./common-types";

interface Doctor {
  id: number;
  username: string;
  role: role;
  provider: provider;
  email: string;
  phone: string | null;
  address: string | null;
  userSummary: string | null;
  profilePicture: string | null;
  age: number | null;
}

export interface DoctorScheduleType {
  id: string;
  doctor: Doctor;
  date: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
