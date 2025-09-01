export type FollowUpKind = "review" | "lab_review" | "repeat_rx" | "procedure";
export type FollowUpStatus = "upcoming" | "completed" | "missed" | "cancelled";
export type ReminderChannel = "push" | "sms" | "email";

export interface FollowUpInterface {
  id: string;
  bookId: string;

  dueAt: string; 
  kind: FollowUpKind;

  notes?: string;
  status: FollowUpStatus;

  remindAt1?: string; 
  remindAt2?: string;
  channel: ReminderChannel;

  createdAt: string;
  updatedAt: string;
}



export type UUID = string;
export type ISODateString = string;


export interface FollowUpDto {
  id: UUID;
  bookId: UUID;

  dueAt: ISODateString;
  kind: FollowUpKind;

  notes?: string | null;

  status: FollowUpStatus;

  // Simple reminder fields
  remindAt1?: ISODateString | null;
  remindAt2?: ISODateString | null;
  channel: ReminderChannel;

  createdAt: ISODateString;
  updatedAt: ISODateString;
}


export interface CreateFollowUpRequest {
  bookId: UUID;
  dueAt: ISODateString;
  kind?: FollowUpKind;
  notes?: string;
  remindAt1?: ISODateString;
  remindAt2?: ISODateString;
  channel?: ReminderChannel;
}


export type FollowUpResponse = FollowUpDto;


export interface FollowUpStatistics {
  total: number;
  upcoming: number;
  completed: number;
  missed: number;
  cancelled: number;
  overdue: number;
}


export interface RescheduleFollowUpRequest {
  newDueAt: ISODateString;
  notes?: string;
}


export interface MarkFollowUpStatusRequest {
  notes?: string;
}


export interface FollowUpModel {
  id: UUID;
  bookId: UUID;

  dueAt: Date;
  kind: FollowUpKind;

  notes?: string | null;

  status: FollowUpStatus;

  remindAt1?: Date | null;
  remindAt2?: Date | null;
  channel: ReminderChannel;

  createdAt: Date;
  updatedAt: Date;
}
