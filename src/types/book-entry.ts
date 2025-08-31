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
  tags?: string[];

  // Optional links
  appointmentId?: string;
  prescriptionId?: string;

  uploadedBy: BookEntryUploadedBy;

  createdAt: string;
  updatedAt: string;
}
