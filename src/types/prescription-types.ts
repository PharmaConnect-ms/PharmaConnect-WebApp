interface User {
  id: number;
  username: string;
}

export interface PrescriptionResponse {
  id: string;
  prescriptionImage: string; 
  patientName: string;
  createdAt: string; 
  doctor: User;
  patient: User;
}

export interface CreatePrescriptionPayload {
  file: File;       
  patientName: string;
  doctorId: number;
  patientId: number;
}
