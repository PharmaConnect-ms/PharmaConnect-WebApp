export type BookEntryType =
  | "visit"
  | "note"
  | "lab"
  | "vitals"
  | "med_change"
  | "imaging"
  | "attachment";

export type BookEntryUploadedBy = "doctor" | "patient" | "admin";

export interface BookEntryInterface {
  id: string;
  bookId: string;

  entryDate: string;
  type: BookEntryType;

  summary: string;   
  details?: string; 

  attachedFileUrl?: string;
  tags?: string;

  // Optional links
  appointmentId?: string;
  prescriptionId?: string;

  uploadedBy: BookEntryUploadedBy;

  createdAt: string;
  updatedAt: string;
}


export interface CreateBookEntry {
  bookId: string;
  entryDate: string;

  type: BookEntryType;

  /** Max 280 chars */
  summary: string;

  details?: string;
  attachedFileUrl?: string;

  tags?: string;

  // Optional cross-links
  appointmentId?: string;
  prescriptionId?: string;

  /** Defaults to 'doctor' server-side */
  uploadedBy?: 'doctor' | 'patient' | 'pharmacist';
}


export interface BookEntryResponse {
  id: string;
  bookId: string;

  entryDate: Date;
  type: BookEntryType;

  summary: string;
  details?: string;
  attachedFileUrl?: string;
  tags?: string;

  appointmentId?: string;
  prescriptionId?: string;

  uploadedBy: 'doctor' | 'patient' | 'pharmacist' | 'admin';

  createdAt: Date;
  updatedAt: Date;
}



export interface BookEntryStatistics {
  total: number;
  byType: Record<BookEntryType, number>;
  byUploadedBy: Record<string, number>;
  recentCount: number;
}
