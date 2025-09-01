import { BookEntryInterface } from "./book-entry-type";
import { FollowUpInterface } from "./follow-ups-types";

export type BookStatus = 'active' | 'remission' | 'closed';
export type SeverityLevel = "mild" | "normal" | "severe";


export interface ConditionBooksResponse {
  id: string;
  patientId: string;
  primaryDoctorId: string;
  title: string; // e.g. "Headache"
  status: BookStatus;
  onsetDate: string; // YYYY-MM-DD
  severity: SeverityLevel;
  allergies?: string; // e.g. "no", "penicillin"
  goals: Record<string, string>; // flexible object for goal steps
  instructions: string;
  reviewIntervalDays: number;
  entries?: BookEntryInterface[];
  followUps?: FollowUpInterface[];
  createdAt: string;
  updatedAt: string;
}


export interface ConditionBookPayload {
  patientId: string;
  primaryDoctorId: string;
  title: string;
  status: BookStatus;
  onsetDate: string; // YYYY-MM-DD
  severity: SeverityLevel;
  allergies?: string;
  goals: Record<string, string>;
  instructions: string;
  reviewIntervalDays: number;
}