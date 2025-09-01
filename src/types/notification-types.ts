// types/notifications.ts

export enum NotificationStatus {
  ACTIVE = 'active',
  FIRED = 'fired',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum NotificationType {
  APPOINTMENT_REMINDER = 'appointment_reminder',
  MEDICATION_REMINDER = 'medication_reminder',
  FOLLOW_UP_REMINDER = 'follow_up_reminder',
  GENERAL_REMINDER = 'general_reminder',
}

export interface NotificationInterface {
  id: number;
  title: string;
  description?: string;
  reminderTime: string; 
  status: NotificationStatus;
  type: NotificationType;
  relatedEntityId?: number;
  relatedEntityType?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export enum FiredNotificationStatus {
  SENT = 'sent',
  FAILED = 'failed',
  ACKNOWLEDGED = 'acknowledged',
}

export interface FiredNotificationInterface {
  id: number;
  notificationId: number;
  userId: number;
  title: string;
  description?: string;
  scheduledTime: string; // ISO string
  firedAt: string;       // ISO string
  status: FiredNotificationStatus;
  errorMessage?: string;
  metadata?: Record<string, string>;
  createdAt: string;
}

export interface CreateNotificationDto {
  title: string;
  description?: string;
  reminderTime: string; 
  type?: NotificationType;
  relatedEntityId?: number;
  relatedEntityType?: string;
  userId: number;
}
