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
